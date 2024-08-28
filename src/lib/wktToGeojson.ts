import { parse } from 'wellknown';
import { getFileName } from './../utils';

/**
 * get geojson from wkt files
 * @param file
 */
export const fromWktToGeojson = async (file: any) => {
  const data = await file.text();
  const geojson = parse(data.toString());
  return {
    response: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { ...geojson },
        },
      ],
    },
    fileName: getFileName(file.name),
  };
};
