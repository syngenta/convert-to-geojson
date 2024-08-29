import shp from 'shpjs';
import { getFileName, changeProjection, getCorrectResponse, validateZip } from './../utils';

/**
 * get geojson from zip files
 * @param file
 * @param projectionType
 */
export const fromZipToGeojson = async (file: any, projectionType: string) => {
  try {
    const zipValidation = await validateZip(file);
    if (zipValidation.error) {
      return zipValidation.error;
    } else if (zipValidation.missingMandatoryExt.length > 0) {
      return new Error(
        `Missing following mandatory files - ${zipValidation.missingMandatoryExt.toString()}`,
      );
    }

    const data = await file.arrayBuffer();
    const geojson = await shp(data);
    const correctResponse = getCorrectResponse(geojson, file.name);
    return {
      response: changeProjection(correctResponse.response, projectionType),
      fileName: getFileName(file.name),
    };
  } catch (error) {
    return error;
  }
};
