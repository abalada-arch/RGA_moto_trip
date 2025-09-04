import { WeatherData, RouteIncident, RouteWork, TrafficInfo } from '../types';

// Configuration des APIs
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// URLs des données data.gouv.fr
const DATA_GOUV_URLS = {
  traffic: 'https://www.data.gouv.fr/fr/datasets/r/79d0fc73-7c8c-4b8b-b7e9-8d9c9c2c1b1a', // URL exemple
  incidents: 'https://www.data.gouv.fr/fr/datasets/r/incidents-france.json',
  works: 'https://www.data.gouv.fr/fr/datasets/r/travaux-france.json'
};

/**
 * Récupère les prévisions météo pour un point et une date donnés
 */
export async function fetchWeatherForecast(
  lat: number, 
  lng: number, 
  date: Date
): Promise<WeatherData | null> {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not configured');
    return null;
  }

  try {
    // Pour les prévisions, on utilise l'endpoint forecast
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Trouver la prévision la plus proche de la date demandée
    const targetTime = date.getTime();
    let closestForecast = data.list[0];
    let minTimeDiff = Math.abs(new Date(closestForecast.dt * 1000).getTime() - targetTime);

    for (const forecast of data.list) {
      const forecastTime = new Date(forecast.dt * 1000).getTime();
      const timeDiff = Math.abs(forecastTime - targetTime);
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestForecast = forecast;
      }
    }

    // Convertir en format WeatherData
    const weatherData: WeatherData = {
      id: `weather_${lat}_${lng}_${date.getTime()}`,
      location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat,
      lng,
      temperature: Math.round(closestForecast.main.temp),
      condition: mapOpenWeatherToCondition(closestForecast.weather[0].main),
      windSpeed: Math.round(closestForecast.wind.speed * 3.6), // m/s to km/h
      windDirection: getWindDirection(closestForecast.wind.deg),
      humidity: closestForecast.main.humidity,
      visibility: closestForecast.visibility ? closestForecast.visibility / 1000 : 10, // m to km
      lastUpdate: new Date()
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
}

/**
 * Récupère les données de trafic de data.gouv.fr
 */
export async function fetchDataGouvTraffic(): Promise<any[]> {
  try {
    // Note: L'URL exacte peut varier, il faut vérifier sur data.gouv.fr
    const response = await fetch('https://www.data.gouv.fr/fr/datasets/r/79d0fc73-7c8c-4b8b-b7e9-8d9c9c2c1b1a');
    
    if (!response.ok) {
      throw new Error(`Traffic API error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    return [];
  }
}

/**
 * Récupère les incidents de data.gouv.fr
 */
export async function fetchDataGouvIncidents(): Promise<RouteIncident[]> {
  try {
    // URL d'exemple - à ajuster selon la vraie structure de l'API
    const response = await fetch('https://www.data.gouv.fr/fr/datasets/r/incidents-france.json');
    
    if (!response.ok) {
      throw new Error(`Incidents API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Convertir les données brutes en format RouteIncident
    return data.map((incident: any) => ({
      id: incident.id || `incident_${Date.now()}_${Math.random()}`,
      type: mapIncidentType(incident.type),
      description: incident.description || incident.message || 'Incident signalé',
      lat: parseFloat(incident.lat || incident.latitude),
      lng: parseFloat(incident.lng || incident.longitude),
      severity: mapSeverity(incident.severity || incident.impact),
      startTime: new Date(incident.startTime || incident.timestamp || Date.now()),
      estimatedEndTime: incident.endTime ? new Date(incident.endTime) : undefined,
      affectedLanes: incident.lanes,
      source: 'data.gouv.fr'
    })).filter((incident: RouteIncident) => 
      !isNaN(incident.lat) && !isNaN(incident.lng)
    );
  } catch (error) {
    console.error('Error fetching incidents data:', error);
    return [];
  }
}

/**
 * Récupère les travaux de data.gouv.fr
 */
export async function fetchDataGouvWorks(): Promise<RouteWork[]> {
  try {
    const response = await fetch('https://www.data.gouv.fr/fr/datasets/r/travaux-france.json');
    
    if (!response.ok) {
      throw new Error(`Works API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((work: any) => ({
      id: work.id || `work_${Date.now()}_${Math.random()}`,
      description: work.description || work.message || 'Travaux en cours',
      lat: parseFloat(work.lat || work.latitude),
      lng: parseFloat(work.lng || work.longitude),
      startDate: new Date(work.startDate || work.timestamp || Date.now()),
      endDate: work.endDate ? new Date(work.endDate) : undefined,
      workType: mapWorkType(work.type),
      trafficImpact: mapTrafficImpact(work.impact),
      alternativeRoute: work.alternative,
      source: 'data.gouv.fr'
    })).filter((work: RouteWork) => 
      !isNaN(work.lat) && !isNaN(work.lng)
    );
  } catch (error) {
    console.error('Error fetching works data:', error);
    return [];
  }
}

/**
 * Filtre les incidents le long d'un tracé GPX
 */
export function filterIncidentsAlongRoute(
  incidents: RouteIncident[], 
  gpxPoints: Array<{ lat: number; lng: number }>,
  radiusKm: number = 2
): RouteIncident[] {
  return incidents.filter(incident => {
    return gpxPoints.some(point => {
      const distance = calculateDistance(
        incident.lat, incident.lng,
        point.lat, point.lng
      );
      return distance <= radiusKm;
    });
  });
}

/**
 * Filtre les travaux le long d'un tracé GPX
 */
export function filterWorksAlongRoute(
  works: RouteWork[], 
  gpxPoints: Array<{ lat: number; lng: number }>,
  radiusKm: number = 2
): RouteWork[] {
  return works.filter(work => {
    return gpxPoints.some(point => {
      const distance = calculateDistance(
        work.lat, work.lng,
        point.lat, point.lng
      );
      return distance <= radiusKm;
    });
  });
}

/**
 * Génère des points d'échantillonnage le long d'un tracé GPX pour les prévisions météo
 */
export function generateWeatherSamplePoints(
  gpxPoints: Array<{ lat: number; lng: number }>,
  intervalKm: number = 50
): Array<{ lat: number; lng: number; estimatedTime: Date }> {
  const samplePoints: Array<{ lat: number; lng: number; estimatedTime: Date }> = [];
  let totalDistance = 0;
  let lastSampleDistance = 0;
  const startTime = new Date();
  const averageSpeedKmh = 60; // Vitesse moyenne estimée

  for (let i = 1; i < gpxPoints.length; i++) {
    const segmentDistance = calculateDistance(
      gpxPoints[i-1].lat, gpxPoints[i-1].lng,
      gpxPoints[i].lat, gpxPoints[i].lng
    );
    
    totalDistance += segmentDistance;
    
    // Ajouter un point d'échantillonnage tous les intervalKm
    if (totalDistance - lastSampleDistance >= intervalKm) {
      const estimatedTime = new Date(
        startTime.getTime() + (totalDistance / averageSpeedKmh) * 60 * 60 * 1000
      );
      
      samplePoints.push({
        lat: gpxPoints[i].lat,
        lng: gpxPoints[i].lng,
        estimatedTime
      });
      
      lastSampleDistance = totalDistance;
    }
  }

  // Toujours inclure le point final
  if (gpxPoints.length > 0) {
    const finalTime = new Date(
      startTime.getTime() + (totalDistance / averageSpeedKmh) * 60 * 60 * 1000
    );
    
    samplePoints.push({
      lat: gpxPoints[gpxPoints.length - 1].lat,
      lng: gpxPoints[gpxPoints.length - 1].lng,
      estimatedTime: finalTime
    });
  }

  return samplePoints;
}

// Fonctions utilitaires

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function mapOpenWeatherToCondition(weatherMain: string): WeatherData['condition'] {
  switch (weatherMain.toLowerCase()) {
    case 'clear': return 'sunny';
    case 'clouds': return 'cloudy';
    case 'rain': return 'rainy';
    case 'thunderstorm': return 'stormy';
    case 'snow': return 'snowy';
    case 'mist':
    case 'fog': return 'foggy';
    default: return 'cloudy';
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function mapIncidentType(type: string): RouteIncident['type'] {
  switch (type?.toLowerCase()) {
    case 'accident': return 'accident';
    case 'breakdown': return 'breakdown';
    case 'obstacle': return 'obstacle';
    default: return 'other';
  }
}

function mapSeverity(severity: string): 'low' | 'medium' | 'high' {
  switch (severity?.toLowerCase()) {
    case 'high':
    case 'severe': return 'high';
    case 'medium':
    case 'moderate': return 'medium';
    default: return 'low';
  }
}

function mapWorkType(type: string): RouteWork['workType'] {
  switch (type?.toLowerCase()) {
    case 'construction': return 'construction';
    case 'repair': return 'repair';
    default: return 'maintenance';
  }
}

function mapTrafficImpact(impact: string): RouteWork['trafficImpact'] {
  switch (impact?.toLowerCase()) {
    case 'closure':
    case 'closed': return 'closure';
    case 'slow':
    case 'reduced': return 'slow';
    default: return 'none';
  }
}