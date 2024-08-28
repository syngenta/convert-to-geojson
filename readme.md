# Extract geojson from shape files

## About
This package will help us to extract the geojson data from different shape files. It supports following files - `zip, kml, wkt, topojson, json, geojson`.

## Installation
`npm install --save @syngenta-digital/convert-shape-files-to-geojson`

## How to use?
Import the package:
`import getGeojson from '@syngenta-digital/convert-shape-files-to-geojson';`

Call the function:
`const geojson = await getGeojson(file);`

Here 
- `file` - should be the file from which you want to extract the geojson data

If you have multiple files, you need to call this function multiple times.

## Outout will look like this
```
{
    "response": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                23.93942364598064,
                                -9.075276196185797
                            ],
                            [
                                23.93942364598064,
                                -9.093105275018814
                            ],
                            [
                                23.95383160389386,
                                -9.093105275018814
                            ],
                            [
                                23.95383160389386,
                                -9.075276196185797
                            ],
                            [
                                23.93942364598064,
                                -9.075276196185797
                            ]
                        ]
                    ]
                },
                "properties": {}
            }
        ]
    },
    "fileName": "map"
}
```

## Files for testing:
You can use files from `shape_files_for_testing` folder for testing

## References
- https://github.com/mapbox/togeojson#readme
- https://github.com/calvinmetcalf/shapefile-js
- https://github.com/topojson/topojson-client
- https://github.com/mapbox/wellknown

## FAQ
