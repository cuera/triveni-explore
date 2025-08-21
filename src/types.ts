export type DeptId = string;

export interface Department {
  id: DeptId;
  name: string;
  teacher?: string;
  classes?: string;
  room: string;
  floor: string;
  activities: string[];
  theme?: string;
  description?: string;
}

export interface TimelineItem {
  time: string;
  event: string;
  location: string;
  type: 'ceremony' | 'performance' | 'demonstration' | 'exhibition' | 'activity' | 'workshop' | 'break';
  description?: string;
  departmentId?: DeptId;
}

export interface Room {
  code: string;
  block: string;
  floor: string;
  note?: string;
  hotspot?: { x: number; y: number; }
}

export interface SearchResult {
  type: 'department' | 'room';
  item: Department | Room;
  score?: number;
}

