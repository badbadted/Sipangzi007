import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  type QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Event, EventFilters } from '../types/event';

const EVENTS_COLLECTION = 'events';

// 將 Firestore 文件轉換為 Event 型別
function docToEvent(docSnapshot: { id: string; data: () => Record<string, unknown> }): Event {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name as string,
    eventDate: data.eventDate as string,
    location: data.location as string,
    isDomestic: data.isDomestic as boolean,
    registrationUrl: data.registrationUrl as string | undefined,
    registrationDeadline: data.registrationDeadline as string | undefined,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : undefined,
    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined,
  };
}

// 取得賽事列表（含篩選）
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const constraints: QueryConstraint[] = [];

      // 國內/國外篩選
      if (filters?.isDomestic !== undefined && filters.isDomestic !== null) {
        constraints.push(where('isDomestic', '==', filters.isDomestic));
      }

      // 日期範圍篩選
      if (filters?.fromDate) {
        constraints.push(where('eventDate', '>=', filters.fromDate));
      }
      if (filters?.toDate) {
        constraints.push(where('eventDate', '<=', filters.toDate));
      }

      // 僅在未篩選國內/國外時在 Firestore 使用 orderBy，避免複合索引需求；有篩選時改為記憶體排序
      const hasIsDomesticFilter =
        filters?.isDomestic !== undefined && filters.isDomestic !== null;
      if (!hasIsDomesticFilter) {
        constraints.push(orderBy('eventDate', 'asc'));
      }

      const q = query(collection(db, EVENTS_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);
      let events = snapshot.docs.map(docToEvent);

      // 地點關鍵字篩選（前端過濾）
      if (filters?.location) {
        const keyword = filters.location.toLowerCase();
        events = events.filter(e => e.location.toLowerCase().includes(keyword));
      }

      // 賽事名稱關鍵字篩選（前端過濾）
      if (filters?.keyword) {
        const keyword = filters.keyword.toLowerCase();
        events = events.filter(e => e.name.toLowerCase().includes(keyword));
      }

      // 依比賽日期由小到大排序（舊到新）
      events.sort((a, b) => a.eventDate.localeCompare(b.eventDate));

      return events;
    },
  });
}

// 新增賽事
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
        ...event,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// 更新賽事
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...event }: Omit<Event, 'createdAt' | 'updatedAt'>) => {
      const docRef = doc(db, EVENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...event,
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// 刪除賽事
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, EVENTS_COLLECTION, id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
