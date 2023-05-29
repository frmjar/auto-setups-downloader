# auto-setups-downloader
A nodejs application to automatically download all Pure Driving School setups without having to do it manually one by one.

## How to use
It is very simple to use. 
  1. Enter the username and password you use to log in to Pure Driving School in utils/constantes or create an .env file in the root directory. 
  2. In that same file or .env, add the default download path of the setups, and the iRacing path of the setups (by default documents/iRacing/setups)
  3. In utils/mapeo.json it is indicated that each of the series and cars must be mapped.

## utils/mapeo.json example use

``` json
  "advancedmx5": {
        "coche": "mx5 mx52016",
        "serie": "advanced"
      } 
```

  - ``advancedmx5`` is the name that pure driving school gives to the series that you want to download.
  - ``coche`` indicates the name of the car in iRacing. (The name that appears in the iRacing sutups folder).
  - ``serie`` corresponds to the series name. It is a personal name, not tied to iRacing.

## Compile and run

To compile the project, simply do ``npm install``.
Then just run ``npm run descargar`` and all available Pure Driving School setups will be downloaded.
