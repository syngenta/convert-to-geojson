import { getExtension } from './utils';
import { fromZipToGeojson } from './lib/zipToGeojson';
import { fromKmlToGeojson } from './lib/kmlToGeojson';
import { fromWktToGeojson } from './lib/wktToGeojson';
import { fromTopojsonToGeojson } from './lib/topojsonToGeojson';
import { fromJsonToGeojson } from './lib/jsonToGeojson';

/**
 * use this function
 * @param file
 * @param projectionType
 */
export const getGeojson = async (file: any, projectionType = 'WGS84') => {
  try {
    if (!file) {
      return new Error('Invalid File');
    } else {
      const ext = getExtension(file.name, false).toLowerCase();
      if (ext === 'json' || ext === 'geojson') {
        return fromJsonToGeojson(file);
      } else if (ext === 'topojson') {
        return fromTopojsonToGeojson(file);
      } else if (ext === 'kml') {
        return fromKmlToGeojson(file);
      } else if (ext === 'wkt') {
        return fromWktToGeojson(file);
      } else if (ext === 'zip') {
        return fromZipToGeojson(file, projectionType);
      } else {
        return new Error('Invalid File');
      }
    }
  } catch (error) {
    return error;
  }
};
