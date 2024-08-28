import tj from '@mapbox/togeojson';
import { getCorrectResponse } from './../utils';

/**
 * get geojson from kml files
 * @param file
 */
export const fromKmlToGeojson = async (file: any) => {
  const data = await file.text();
  const parser = new DOMParser();
  const kml = parser.parseFromString(data.toString(), 'application/xml');
  const geojson = tj.kml(kml);
  return getCorrectResponse(geojson, file.name);
};
