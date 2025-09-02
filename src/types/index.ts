export interface TripStage {
  id: string;
  day: number;
  title: string;
  distance: number;
  duration: number;
  startLocation: string;
  endLocation: string;
  description?: string;
}

export interface POI {
  id: string;
  name: string;
  type: 'col' | 'pause' | 'fuel' | 'restaurant' | 'viewpoint' | 'hotel' | 'other';
  lat: number;
  lng: number;
  description?: string;
  addedBy?: string;
}

export interface GPXTrack {
  id: string;
  name: string;
  points: Array<{ lat: number; lng: number; elevation?: number }>;
  distance: number;
  uploadedAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'group' | 'personal';
  assignedTo?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  category: 'fuel' | 'food' | 'accommodation' | 'tolls' | 'other';
  date: Date;
  participants: string[];
}

export interface RiderStatus {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'riding' | 'fuel' | 'pause' | 'emergency';
  lastUpdate: Date;
  statusMessage?: string;
  validatedBy: string[];
  needsValidation: boolean;
}