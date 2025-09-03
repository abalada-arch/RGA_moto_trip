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

export interface TripRecording {
  id: string;
  startTime: Date;
  endTime?: Date;
  isRecording: boolean;
  distance: number;
  duration: number;
  averageSpeed: number;
  maxSpeed: number;
  maxLean: number;
  coordinates: Array<{
    lat: number;
    lng: number;
    timestamp: Date;
    speed?: number;
    heading?: number;
    altitude?: number;
  }>;
  stageName?: string;
}

export interface TripStats {
  totalDistance: number;
  totalDuration: number;
  averageSpeed: number;
  maxSpeed: number;
  maxLean: number;
  fuelStops: number;
  pauseCount: number;
  recordings: TripRecording[];
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

export interface WeatherData {
  id: string;
  location: string;
  lat: number;
  lng: number;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
  windSpeed: number;
  windDirection: string;
  humidity: number;
  visibility: number;
  lastUpdate: Date;
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'rain' | 'snow' | 'wind' | 'fog' | 'ice';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  affectedStages: string[];
}

export interface RoadInfo {
  id: string;
  name: string;
  type: 'col' | 'tunnel' | 'bridge' | 'dangerous_curve';
  elevation?: number;
  status: 'open' | 'closed' | 'restricted';
  conditions: string;
  lastUpdate: Date;
  warnings?: string[];
}

export interface SharedGPX {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: string;
  downloadCount: number;
  stages: string[];
  description?: string;
}