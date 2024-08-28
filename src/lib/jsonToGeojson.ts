import { convertJson } from './../utils';

/**
 * get geojson from json files
 * @param file
 */
export const fromJsonToGeojson = (file: any) => {
  return convertJson(file);
};
