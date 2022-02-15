# Global Inequalities Charts 

The GlobalInequalities Charts is a wordpress divi module and a javascript library to integrate interactive charts in a wordpress site and provide chart tools.

## Overview

Each chart has a unique ID, denoted in this documentation as [chartID]. This ID is used to identify the chart in the javascript library and it has to be unique.

The chart files are in the root directory of the plugin at `/wp-content/plugins/global-inequalities-charts/`:

- plugin-root
    - charts
        - [chartID] -> one folder for each chart
            - [chartID].json
            - [chartID].js
            - [chartID].csv
    - assets
        - js -> here is where the magic happens
    - includes -> the divi module
    - languages -> could be used for translations
    - node_modules -> the dependencies folder
    - scripts -> automatically generated js
    - styles -> automatically generated css



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

##  [chartID].json schema v1
- name: the human readable name that shows in the divi editor
- schema_version: the version of the schema, this increases, when new features are added
- the author of the chart
- libraries: libraries that should be loaded in order to show the graph, currently supports apexcharts and d3js 

```
{
    "name":"Demo 2",
    "schema_version":1,
    "author":"Demo user <demo1@user.com>",
    "libraries":{
        "apexcharts":true,
        "d3js":false
    }
}
```



