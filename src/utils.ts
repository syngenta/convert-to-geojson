import proj4 from 'proj4';
import JSZip from 'jszip';
import fs from 'fs';
import util from 'util';

/**
 * get filename before extension
 * @param fileFullName
 * @returns
 */
export const getFileName = (fileFullName = '') => {
  if (fileFullName === '') {
    return '';
  }
  const arr = fileFullName.split('.');
  return arr[0];
};

/**
 * get file extension from file name
 * @param fileFullName
 * @param dot
 * @returns
 */
export const getExtension = (fileFullName = '', dot = true) => {
  if (fileFullName === '') {
    return '';
  }
  const arr = fileFullName.split('.');
  const ext = `${arr[arr.length - 1].toLowerCase()}`;
  if (dot === false) {
    return ext;
  }
  return `.${ext}`;
};

/**
 * remove unwanted bbox object from response
 * @param geojson
 * @param fileName
 * @returns
 */
export const getCorrectResponse = (geojson: any, fileName: string) => {
  let response = geojson;
  if (geojson.length > 1) {
    for (const val of geojson) {
      if (!('bbox' in val) && 'type' in val && val.type === 'FeatureCollection') {
        response = val;
        break;
      }
    }
  }
  return {
    response,
    fileName: getFileName(fileName),
  };
};

/**
 * change project to supported format
 * projectionType = 2154 => this is lambert-96
 * projectionType = 5842 => this is america-5842
 * @param geojson
 * @param projectionType
 * @returns
 */
export const changeProjection = (geojson: any, projectionType: string) => {
  if (projectionType === '2154' || projectionType === '5842') {
    proj4.defs(
      'EPSG:2154',
      // eslint-disable-next-line max-len
      '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    );
    proj4.defs(
      'EPSG:5842',
      // eslint-disable-next-line max-len
      '+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9996 +x_0=500000 +y_0=10000000 +datum=WGS84 +units=m +no_defs',
    );
    geojson.features.map((feature: any) => {
      const coordinates = feature.geometry.coordinates;
      feature.geometry.coordinates = coordinates.map((rows: any) => {
        return rows.map((row: any) => {
          return proj4(`EPSG:${projectionType}`, 'WGS84', [row[0], row[1]]);
        });
      });
      return feature;
    });
  }
  return geojson;
};

/**
 *
 * @param file
 */
export const convertJson = async (file: any) => {
  const data = await file.text();
  const geojson = JSON.parse(data);
  return getCorrectResponse(geojson, file.name);
};

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
  let missingMandatoryExt: string[] = [];
  let error: any;
  try {
    const mandatoryExt = ['shp', 'dbf', 'shx'];
    const providedExt: any = [];
    const MAX_FILES = 1000;
    let fileCount = 0;
    const readFile = util.promisify(fs.readFile);
    const newdata = await readFile(file, 'binary');
    if (newdata) {
      const zip = await JSZip.loadAsync(newdata);
      zip.forEach((relativePath, zipEntry) => {
        fileCount++;
        if (fileCount > MAX_FILES) {
          error = new Error(`Reached max. number of files. Max. files allowed: ${MAX_FILES}`);
        }
        if (zipEntry.name) {
          const ext = getExtension(zipEntry.name, false);
          if (ext) {
            providedExt.push(ext);
          }
        }
      });
      missingMandatoryExt = mandatoryExt.filter((ext) => {
        return !providedExt.includes(ext);
      });
    } else {
      error = new Error(`Bad file`);
    }
    return {
      missingMandatoryExt,
      error,
    };
  } catch (err) {
    return {
      missingMandatoryExt,
      error: err,
    };
  }
};
