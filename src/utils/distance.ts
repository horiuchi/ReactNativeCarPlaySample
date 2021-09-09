import * as geolib from 'geolib';

export type DistanceUnit = 'metric' | 'imperial';

export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  return geolib.getDistance(
    {latitude: lat1, longitude: lon1},
    {latitude: lat2, longitude: lon2},
  );
}

export function getDistanceString(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  distanceUnit?: DistanceUnit,
): string {
  const distance = getDistance(lat1, lon1, lat2, lon2);
  return buildDistanceString(distance, distanceUnit);
}

export function buildDistanceString(
  meters: number,
  distanceUnit: DistanceUnit = 'metric',
): string {
  switch (distanceUnit) {
    case 'metric':
      if (meters <= 1005) {
        return `${Math.floor((meters + 5) / 10) * 10}m`;
      }

      if (meters < 10000) {
        return `${(meters / 1000).toFixed(1)}km`;
      } else {
        return `${Math.floor(meters / 1000)}km`;
      }

    case 'imperial':
      const feet = meters * 3.2808;
      if (feet <= 1010) {
        // Under 1000ft : 20ft step
        return `${Math.floor((feet + 10) / 20) * 20}ft`;
      }

      const miles = meters * 0.000621371;
      if (miles < 1.0) {
        // Note toFixed() returns rounded value
        return `${miles.toFixed(2)}mi`;
      } else if (miles < 10.0) {
        return `${miles.toFixed(1)}mi`;
      } else {
        return `${Math.floor(miles)}mi`;
      }
  }
}
