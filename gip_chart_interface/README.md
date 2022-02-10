# GIP Chart Interface

The GIP Chart Interface is a javascript library to integrate interactive charts in a wordpress site and provide chart tools.

## Overview

Each chart has a unique ID, denoted in this documentation as [chartID].

The chart files are in the root directory of the website next to wordpress:

- root
    - charts
        - chartinterface.js -> main code
        - chartutils.js -> used for some of the charts
        - style.css
        - [chartID] -> one folder for each chart
            - [chartID].js
            - [chartID].csv
    - wordpress files and folders


## Usage

A chart is integrated into a wordpress page as follows:

- Creating an element <div id="[chartID]"></div> where the chart should appear.
- Creating at the end of the page:
    - an element <div id="chart-modal-wrapper"></div> 
    - the scripts chartinterface.js and [chartID].js
    - any other necessary scripts

Elements are included at the end of a page using the HFCM wordpress module.



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

