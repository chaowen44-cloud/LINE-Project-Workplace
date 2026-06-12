export interface TimelineItem {
  id: string;
  project: string;
  startDate: string;
  etcDate: string;
  pic: string;
  note: string;
  isEditing?: boolean;
  completed?: boolean;
}

export interface CalendarEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
}

export interface PushItem {
  id: string;
  assetUrl: string; // Base64 string or placeholder
  campaign: string;
  pushTime: string;
  reach: string;
  openRate: string;
  actionPoints: string;
  isEditing?: boolean;
}

export interface LapAdItem {
  id: string;
  assetUrl: string; // Base64 string or placeholder
  campaign: string;
  period: string; // e.g. "2026-06-01 to 2026-06-15"
  taGroup: string;
  impression: string;
  addedFriends: string;
  ctr: string;
  cpm: string;
  cpf: string;
  cost: string;
  isEditing?: boolean;
}
