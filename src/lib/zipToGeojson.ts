import JSZip from 'jszip';
import shp from 'shpjs';
import { getExtension, getFileName, changeProjection, getCorrectResponse } from './../utils';

/**
 * get geojson from zip files
 * @param file
 * @param projectionType
 */
export const fromZipToGeojson = async (file: any, projectionType: string) => {
  try {
    const mandatoryExt = ['shp', 'dbf', 'shx'];
    const providedExt: any = [];
    let missingMandatoryExt: string[] = [];
    const MAX_FILES = 1000;
    let fileCount = 0;
    JSZip.loadAsync(file).then((zip) => {
      zip.forEach((relativePath, zipEntry) => {
        fileCount++;
        if (fileCount > MAX_FILES) {
          return new Error(`Reached max. number of files. Max. files allowed: ${MAX_FILES}`);
        }
        const ext = getExtension(zipEntry.name, false);
        if (ext) {
          providedExt.push(ext);
        }
      });

      missingMandatoryExt = mandatoryExt.filter((ext) => {
        return !providedExt.includes(ext);
      });
    });

    if (missingMandatoryExt.length > 0) {
      return new Error(`Missing following mandatory files - ${missingMandatoryExt.toString()}`);
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
