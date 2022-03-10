# Global Inequality Charts 

A divi module to display interactive charts on a wordpress site and provide tools to share, download data, and more.

## Overview

Each chart has a unique ID, denoted in this documentation as [chartID]. This ID is used to identify the chart in the javascript library and it has to be unique.

The chart files are in the root directory of the plugin at `/wp-content/plugins/global_inequality_charts/`:

- plugin-root
    - charts
        - [chartID] -> one folder for each chart
            - [chartID].json
            - [chartID].js
            - [chartID].csv
            - [chartID].png -> for open graph data
    - assets
        - js -> here is where the magic happens
    - includes -> the divi module
    - languages -> could be used for translations
    - node_modules -> the dependencies folder
    - scripts -> automatically generated js
    - styles -> automatically generated css

## Licensing

The plugin code is released under the MIT license. Each of the charts and the corresponding datasets can be subject to different authorships and license terms, which are indicated in the respective directory of each chart. 

## Usage

A chart is integrated into a wordpress page as follows:

- open a page or a post with the divi editor
- add the `global inequalities charts` module to the page
- in the settings of the module the chart can be selected by the name defined in `[chartID].json`

## The chart interface

The interface is created by calling createChartInterface() 

The function createChartInterface() is defined in chartinterface.js.

The function takes the following inputs:

- chartID (string)
- chartTitle (string)
- chartDescription (string)
- renderFunc: See section 'The chart'

The chart interface consists of the chart itself, as well as the following set of tools:

- Share 
    - Twitter
    - Facebook
    - Copy link
- Expand
- Download
    - Data (csv)
    - Picture (png) 
- Show sources



## The chart content

The script [chartID].js defines the renderFunc and calls createChartInterface().

The renderFunc takes one input canvasID, which defines where the chart should be rendered.

## How to add a chart

- create a new folder in `charts` with the name of the `[chartID]`
- in the folder create the 3 files
   - `[chartID].json` -> contains the chart settings
   - `[chartID].csv` -> contains the chart data
   - `[chartID].js` -> contains the chart render function
   - `[chartID].png` -> is the image that is used, when the chart is shared (1200×630 px)
   - `[chartID].css` -> contains custom css for the graph



##  [chartID].json schema v2
- id: [chartID]
- title: the human readable name that shows in the divi editor
- schema_version: the version of the schema, this increases, when new features are added
- the author of the chart
- description: a short description of the chart
- source: the source of the data
- libraries: libraries that should be loaded in order to show the graph, currently supports apexcharts, chartutils and d3js(v4.13). They are optional and can be omitted when not used.


```
{
    "id": "demo1",
    "title": "Demo 1 Chart Title",
    "schema_version": 2,
    "author": "Joël Foramitti <demo1@user.com>",
    "description": "Demo1 Chart Description",
    "sources": "Demo1 Chart Sources",
    "libraries": {
        "apexcharts": true,
        "d3js": true,
        "chartutils": true
    }
}
```

### schema Libraries

If the chart needs libraries, they can be added to the `libraries` object. If the library is not yet available, it can be added to the `assets/js` folder or it has to be added to the `package.json` and added to the `.github/workflows/workflows.yaml`. Adding a library via `package.json` is the prefered way. Please don't add libraries via a CDN, this can't be accepted because of the GDPR. The library should be a javascript file that contains the library. In order to load the library correctly it has to be added to the `includes/modules/Charts/Charts.php -> load_libraries` file . Please contact a developer if you need to add a new library.

## Building the divi module 

This is not necessary for adding a chart, but it is necessary to update the style and script files.

- install nodejs version 14, version 16 is not supported. We recommend to use nvm for this.  [https://github.com/elegantthemes/create-divi-extension/issues/541].
- install yarn with `npm install -g yarn`
- install the dependencies with `yarn install`
- build the module with `yarn build`

For development you can use `yarn start`. This will start a local server that serves the files and builds the module after saving a file. 


