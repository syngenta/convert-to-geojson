import {
  getFileName,
  getExtension,
  changeProjection,
  getCorrectResponse,
  convertJson,
  getFileSize,
} from './../src/utils';
import { geojson } from './test_constants';
import { Blob } from 'blob-polyfill';

describe('getFileName', () => {
  it('returns file name for filename with extension', () => {
    const fileName = getFileName('example.txt');
    expect(fileName).toBe('example');
  });

  it('returns an empty string for no file name is provided', () => {
    const fileName = getFileName();
    expect(fileName).toBe('');
  });

  it('returns the file name for filename without extension', () => {
    const fileName = getFileName('example');
    expect(fileName).toBe('example');
  });

  it('returns the file name for a file name with multiple dots', () => {
    const fileName = getFileName('my.file.name.txt');
    expect(fileName).toBe('my');
  });
});

describe('getExtension', () => {
  it('returns extension with dot for a valid file name with extension', () => {
    const extension = getExtension('example.txt');
    expect(extension).toBe('.txt');
  });

  it('returns extension without dot for valid file name with extension', () => {
    const extension = getExtension('example.txt', false);
    expect(extension).toBe('txt');
  });

  it('returns an empty string when no file name is provided', () => {
    const extension = getExtension();
    expect(extension).toBe('');
  });

  it('returns extension with dot for file name with multiple dots true', () => {
    const extension = getExtension('my.file.name.txt');
    expect(extension).toBe('.txt');
  });

  it('returns extension without dot for filename multiple dots false', () => {
    const extension = getExtension('my.file.name.txt', false);
    expect(extension).toBe('txt');
  });
});

describe('changeProjection', () => {
  it('returns unmodified geojson for valid geojson and projection other than 2154 or 5842', () => {
    const modifiedGeojson = changeProjection(geojson, '4326');
    expect(modifiedGeojson).toEqual(geojson);
  });
  it('returns unmodified geojson for valid geojson and projection 2154 or 5842', () => {
    const modifiedGeojson = changeProjection(geojson, '2154');
    expect(modifiedGeojson).toEqual(geojson);
  });
});

describe('getCorrectResponse', () => {
  it('returns correct response and file name for a valid geojson and file name', () => {
    const fileName = 'example.geojson';
    const result = getCorrectResponse(geojson, fileName);
    expect(result).toEqual({
      response: geojson,
      fileName: getFileName(fileName),
    });
  });

  it('returns the correct response and file name when a single valid geojson is provided', () => {
    const fileName = 'example.geojson';
    const result = getCorrectResponse(geojson, fileName);
    expect(result).toEqual({
      response: geojson,
      fileName: getFileName(fileName),
    });
  });

  it('returns correct response and file name for multiple geojson', () => {
    const fileName = 'example.geojson';
    const result = getCorrectResponse([geojson, geojson], fileName);
    // Add assertions to check if the correct response and file name are returned
    expect(result).toEqual({
      response: geojson,
      fileName: getFileName(fileName),
    });
  });
});

describe('convertJson', () => {
  beforeEach(() => {
    global.Blob = Blob;
  });
  it('should return the correct response when converting JSON', async () => {
    const file = new Blob(['{"type":"FeatureCollection","features":[]}'], 'example.json', {
      type: 'application/json',
    });
    file['name'] = 'example.json';
    const response = await convertJson(file);
    expect(response).toEqual(
      getCorrectResponse({ type: 'FeatureCollection', features: [] }, 'example.json'),
    );
  });

  it('should throw an error when the JSON is invalid', async () => {
    const file = new Blob(['{"type":"FeatureCollection","features":[]}'], 'example.json', {
      type: 'application/json',
    });
    file.text = jest.fn().mockResolvedValue('invalid JSON');
    await expect(convertJson(file)).rejects.toThrow('Unexpected token i in JSON at position 0');
  });
});

describe('getFileSize', () => {
  it('should return the correct file size when the file exists in the zip', async () => {
    // Mock the zip object and zipEntry object
    const zip = {
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(Buffer.from('file content')),
      }),
    };
    const zipEntry = { name: 'example.txt' };

    const size = await getFileSize(zip, zipEntry);
    expect(size).toBe(12); // Assuming the file content length is 12
  });

  it('should return 0 when the file does not exist in the zip', async () => {
    // Mock the zip object and zipEntry object
    const zip = {
      file: jest.fn().mockReturnValue(null),
    };
    const zipEntry = { name: 'nonexistent.txt' };

    const size = await getFileSize(zip, zipEntry);
    expect(size).toBe(0);
  });

  it('should return 0 when the file content is empty', async () => {
    // Mock the zip object and zipEntry object
    const zip = {
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(Buffer.from('')),
      }),
    };
    const zipEntry = { name: 'empty.txt' };

    const size = await getFileSize(zip, zipEntry);
    expect(size).toBe(0);
  });
});
