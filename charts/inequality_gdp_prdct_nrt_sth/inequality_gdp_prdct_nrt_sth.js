//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["inequality_gdp_prdct_nrt_sth"] = {
        years: { start: 1960, end: 2020 }
    };
    importFilesAndShow_inequality_gdp_prdct_nrt_sth();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gdp_prdct_nrt_sth() {
    jQuery.get(`${window.charts_path}/${"inequality_gdp_prdct_nrt_sth"}/${"inequality_gdp_prdct_nrt_sth"}.csv`, function (gdp_prdct_nrt_sth) {
        window.chart_data["inequality_gdp_prdct_nrt_sth"].data = fromCSV(gdp_prdct_nrt_sth, ['string', 'number', 'number']);

        // Render Chart Interface
        createChartInterface({
            chartID: 'inequality_gdp_prdct_nrt_sth',
            renderFunc: render_inequality_gdp_prdct_nrt_sth,
        })


    });
}

//--------------------------------------- showChart
function render_inequality_gdp_prdct_nrt_sth(canvasID) {

    var chartID = "inequality_gdp_prdct_nrt_sth"
    var options = {
        chart: {
            type: 'line',
            height: '100%',
            fontFamily: 'Open Sans',
            toolbar: {
                show: false,
                tools: { zoom: false }
            },
        },
        theme: {
            palette: 'palette3',
        },
        responsive: [
            {
                breakpoint: 960,
                options: {
                    xaxis: { tickAmount: 10 }
                }
            },
            {
                breakpoint: 601,
                options: {
                    yaxis: {
                        tickAmount: 5,
                        labels: { formatter: (val, index) => '$' + formatYAxisLabel(val, index, 0, true) }
                    },
                    tooltip: {
                        y: {
                            title: {
                                // Names are too long for mobile view
                                // Alternatively, formatter could change seriesName to abbreviation
                                formatter: (seriesName) => '',
                            }
                        },
                    }
                }

            },
        ],
        stroke: {
            curve: 'straight',
            width: 3
        },
        yaxis: {
            labels: { formatter: (val, index) => '$' + formatYAxisLabel(val, index, 0, true) }
        },
        colors: ['#775DD0', '#FF4560', '#FEB019', '#00E396', '#008FFB', '#A5978B'],
        grid: {
            padding: {
                top: 0,
            }
        },
        tooltip: {
            y: {
                formatter: (val, index) => '$' + formatTooltipVal(val, index),
            },
            followCursor: true,
            shared: false,
        },
    }

    let div_id = '#gdp_nrt_sth';
    let data = window.chart_data["inequality_gdp_prdct_nrt_sth"].data;
    let data_hash = makeHash(data, 'year');

    let years = [];
    for (let year = window.chart_data["inequality_gdp_prdct_nrt_sth"].years.start, end = window.chart_data["inequality_gdp_prdct_nrt_sth"].years.end; year <= end; ++year)
        years.push(year);

    let series = [
        { name: 'Global North', data: [] },
        { name: 'Global South', data: [] }
    ];

    years.forEach(year => {
        let data_row = data_hash[year];
        if (data_row) {
            series[0].data.push(data_row['ADV']);
            series[1].data.push(data_row['EMR']);
        } else {
            series[0].data.push(null);
            series[1].data.push(null);
        }
    });

    options['xaxis'] = { categories: years, tickAmount: 30, tooltip: { enabled: false } };
    options.title = { text: 'GDP * GDP per capita: Global North vs. Global South' };
    options.subtitle = { text: 'Constant 2015 USD (Trillions)' }
    options['chart'].id = ('GDP * GDP per capita Global North vs Global South').replace(/ /g, "");
    options.series = series;

    return createApexChart(canvasID, options);

}


