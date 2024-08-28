import * as topojson from 'topojson-client';
import { getCorrectResponse } from './../utils';

/**
 * get geojson from topojson file
 * @param file
 */
export const fromTopojsonToGeojson = async (file: any) => {
  const str = await file.text();
  const data = JSON.parse(str);
  const geojson = topojson.feature(data, data.objects.collection);
  return getCorrectResponse(geojson, file.name);
};
