import JSZip from 'jszip';
import shp from 'shpjs';
import fs from 'fs';
import { getExtension, getFileName, changeProjection, getCorrectResponse } from './../utils';

/**
 *
 * @param zip
 * @param zipEntry
 * @returns
 */
export const getFileSize = async (zip: any, zipEntry: any) => {
  const newfile = zip.file(zipEntry.name);
  let size = 0;
  if (newfile) {
    const newfileContent = await newfile.async('nodebuffer');
    if (newfileContent) {
      size = newfileContent.length;
    }
  }
  return size;
};

/**
 *
 * @param file
 * @returns
 */
export const validateZip = async (file: any) => {
  const mandatoryExt = ['shp', 'dbf', 'shx'];
  const providedExt: any = [];
  let missingMandatoryExt: string[] = [];
  const MAX_FILES = 1000;
  let fileCount = 0;
  const MAX_SIZE = 1000000000;
  let totalSize = 0;
  let error: any;
  fs.readFile(file, function (err, data) {
    if (err) {
      error = err;
    }
    JSZip.loadAsync(data).then((zip) => {
      zip.forEach(async (relativePath, zipEntry) => {
        // Sensitive
        if (!zip.file(zipEntry.name)) {
          fs.mkdirSync(zipEntry.name);
        } else {
          zip
            .file(zipEntry.name)
            ?.async('nodebuffer')
            .then((content) => {
              fs.writeFileSync(zipEntry.name, content);
            });
        }
        fileCount++;
        if (fileCount > MAX_FILES) {
          error = new Error(`Reached max. number of files. Max. files allowed: ${MAX_FILES}`);
        }
        if (zipEntry.name) {
          const fileSize = await getFileSize(zip, zipEntry);
          totalSize += fileSize;
          if (totalSize > MAX_SIZE) {
            error = new Error(`Reached max. number of files. Max. files allowed: ${MAX_FILES}`);
          } else {
            const ext = getExtension(zipEntry.name, false);
            if (ext) {
              providedExt.push(ext);
            }
          }
        }
      });

      missingMandatoryExt = mandatoryExt.filter((ext) => {
        return !providedExt.includes(ext);
      });
    });
  });
  return {
    missingMandatoryExt,
    error,
  };
};

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
