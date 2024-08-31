import * as topojson from 'topojson-client';
import { getCorrectResponse } from './../utils';

/**
 * get geojson from topojson file
 * @param file
 */
export const fromTopojsonToGeojson = async (file: any) => {
  try {
    const str = await file.text();
    const data = JSON.parse(str);
    const geojson = topojson.feature(data, data.objects.collection);
    return getCorrectResponse(geojson, file.name);
  } catch (error) {
    throw new Error('Unexpected token i in JSON at position 0');
  }
};
