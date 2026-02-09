export interface Event {
  id: string;
  name: string;           // 賽事名稱
  eventDate: string;      // 比賽日期 (YYYY-MM-DD)
  location: string;       // 地點
  isDomestic: boolean;    // true=國內, false=國外
  registrationUrl?: string;       // 報名連結
  registrationDeadline?: string;  // 報名截止日 (YYYY-MM-DD)
  nameColor?: string;             // 賽事名稱文字顏色 (hex)
  locationColor?: string;         // 地點文字顏色 (hex)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventFilters {
  isDomestic?: boolean | null;
  fromDate?: string;
  toDate?: string;
  location?: string;
  keyword?: string;
}
