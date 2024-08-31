import { Blob } from 'blob-polyfill';
import { fromTopojsonToGeojson } from './../src/lib/topojsonToGeojson';
import { fromWktToGeojson } from './../src/lib/wktToGeojson';
import { fromJsonToGeojson } from './../src/lib/jsonToGeojson';
import { getCorrectResponse } from './../src/utils';

jest.mock('topojson-client', () => ({
  feature: jest.fn().mockReturnValue({ type: 'FeatureCollection', features: [] }),
}));

describe('fromTopojsonToGeojson', () => {
  beforeEach(() => {
    global.Blob = Blob;
  });
  const data =
    '{"type":"Topology","objects":{"collection":{"type":"GeometryCollection","geometries":[]}}}';
  it('should return the correct response when converting TopoJSON to GeoJSON', async () => {
    const file = new Blob([data], 'example.topojson', { type: 'application/json' });
    file['name'] = 'example.topojson';
    const response = await fromTopojsonToGeojson(file);
    expect(response).toEqual(
      getCorrectResponse({ type: 'FeatureCollection', features: [] }, 'example.topojson'),
    );
  });

  it('should throw an error when the TopoJSON is invalid', async () => {
    const file = new Blob([data], 'example.topojson', { type: 'application/json' });
    file['name'] = 'example.topojson';
    // Provide an invalid TopoJSON to test error handling
    file.text = jest.fn().mockResolvedValue('invalid TopoJSON');
    await expect(fromTopojsonToGeojson(file)).rejects.toThrow(
      'Unexpected token i in JSON at position 0',
    );
  });
});

jest.mock('wellknown', () => ({
  parse: jest.fn().mockReturnValue({ type: 'Point', coordinates: [102.0, 0.5] }),
}));

describe('fromWktToGeojson', () => {
  beforeEach(() => {
    global.Blob = Blob;
  });
  it('should return the correct response when converting WKT to GeoJSON', async () => {
    const file = new Blob(['POINT(102 0.5)'], 'example.wkt', { type: 'text/plain' });
    file['name'] = 'example.wkt';
    const response = await fromWktToGeojson(file);
    expect(response).toEqual({
      response: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: [102.0, 0.5] },
          },
        ],
      },
      fileName: 'example',
    });
  });

  it('should throw an error when the WKT is invalid', async () => {
    const file = new Blob(['INVALID WKT'], 'example.wkt', { type: 'text/plain' });
    file['name'] = 'example.wkt';
    file.text = jest.fn().mockRejectedValue(new Error('Unexpected token i in JSON at position 0'));
    await expect(fromWktToGeojson(file)).rejects.toThrow(
      'Unexpected token i in JSON at position 0',
    );
  });
});

describe('fromJsonToGeojson', () => {
  beforeEach(() => {
    global.Blob = Blob;
  });
  it('should return the correct response when converting JSON to GeoJSON', async () => {
    const file = new Blob(['{"type":"FeatureCollection","features":[]}'], 'example.json', {
      type: 'application/json',
    });
    file['name'] = 'example.json';
    const response = await fromJsonToGeojson(file);
    expect(response).toEqual(
      getCorrectResponse({ type: 'FeatureCollection', features: [] }, 'example.json'),
    );
  });

  it('should throw an error when the JSON is invalid', async () => {
    const file = new Blob(['INVALID JSON'], 'example.json', { type: 'application/json' });
    file['name'] = 'example.json';
    file.text = jest.fn().mockRejectedValue(new Error('Unexpected token i in JSON at position 0'));
    await expect(fromJsonToGeojson(file)).rejects.toThrow(
      'Unexpected token i in JSON at position 0',
    );
  });
});
