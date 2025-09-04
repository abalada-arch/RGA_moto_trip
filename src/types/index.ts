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
  // Données enrichies pour le mode préparation
  forecastWeather?: WeatherData[];
  routeRoadInfo?: RoadInfo[];
  routeTrafficInfo?: TrafficInfo[];
  routeIncidents?: RouteIncident[];
  routeWorks?: RouteWork[];
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
  pois?: POI[];
  restaurants?: RestaurantPOI[];
  hotels?: HotelPOI[];
}

export interface FuelData {
  id: string;
  stationName: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  services: string[];
  lastUpdate: Date;
  addedBy: string;
}

export interface FuelConsumption {
  id: string;
  date: Date;
  odometer: number;
  liters: number;
  cost: number;
  stationName: string;
  consumption: number; // L/100km
}

export interface VoiceMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isVoice: boolean;
  duration?: number;
  acknowledged: string[];
}

export interface TripMemory {
  id: string;
  type: 'photo' | 'note' | 'achievement';
  title: string;
  content: string;
  lat?: number;
  lng?: number;
  timestamp: Date;
  addedBy: string;
  tags: string[];
}

export interface TollCalculation {
  id: string;
  route: string;
  vehicleType: 'moto' | 'car';
  sections: Array<{
    name: string;
    distance: number;
    cost: number;
  }>;
  totalCost: number;
  lastUpdate: Date;
}

export interface TrafficInfo {
  id: string;
  route: string;
  severity: 'low' | 'medium' | 'high';
  type: 'traffic' | 'accident' | 'roadwork' | 'weather';
  description: string;
  delay: number; // minutes
  alternativeRoute?: string;
  lastUpdate: Date;
  lat?: number;
  lng?: number;
}

export interface RouteIncident {
  id: string;
  type: 'accident' | 'breakdown' | 'obstacle' | 'other';
  description: string;
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high';
  startTime: Date;
  estimatedEndTime?: Date;
  affectedLanes?: string;
  source: string;
}

export interface RouteWork {
  id: string;
  description: string;
  lat: number;
  lng: number;
  startDate: Date;
  endDate?: Date;
  workType: 'maintenance' | 'construction' | 'repair';
  trafficImpact: 'none' | 'slow' | 'closure';
  alternativeRoute?: string;
  source: string;
}

export interface RestaurantPOI extends POI {
  type: 'restaurant';
  cuisine: string;
  priceRange: '$' | '$$' | '$$$';
  openingHours: string;
  hasParking: boolean;
  rating: number;
}

export interface HotelPOI extends POI {
  type: 'hotel';
  hasGarage: boolean;
  priceRange: '$' | '$$' | '$$$';
  services: string[];
  rating: number;
}