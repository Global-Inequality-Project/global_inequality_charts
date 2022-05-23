//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["poverty_num_min_china"] = {
        years: { start: 1981, end: 2015 },
    };

    importFilesAndShow_poverty_num_min_china();

});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_num_min_china() {

    var chartID = "poverty_num_min_china"

    jQuery.get(`${window.charts_path}/${chartID}/${chartID}.csv`, function (poverty_num_min_china) {
        window.chart_data[chartID].data = fromCSV(poverty_num_min_china, ['string', 'number', 'number', 'number']);

        // Render Chart Interface
        createChartInterface({
            chartID: 'poverty_num_min_china',
            renderFunc: render_poverty_num_min_china,
        })

    });
}

//--------------------------------------- showChart
function render_poverty_num_min_china(canvasID) {

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
            palette: 'palette7',
        },
        responsive: [
            {
                breakpoint: 961,
                options: {
                    xaxis: { tickAmount: 10 }
                }
            },
            {
                breakpoint: 401,
                options: {
                    yaxis: {
                        tickAmount: 5,
                        labels: {
                            formatter: (val, index) => formatYAxisLabel(val, index, 0, true)
                        }
                    },
                }
            }
        ],

        yaxis: {
            min: 0,
            labels: { formatter: (val, index) => formatYAxisLabel(val, index, 1, true) }
        },
        colors: ['#775DD0', '#FF4560', '#FEB019', '#00E396', '#008FFB', '#A5978B'],
        grid: {
            padding: {
                top: 0,
            }
        },
        legend: { fontSize: '12px', markers: { width: 10, height: 10, radius: 10, offsetY: '-2px' } },
        tooltip: { y: { formatter: (val, index) => formatTooltipVal(val, index) } }
    }

    let div_id = '#poverty_num_min_china';
    let data = window.chart_data["poverty_num_min_china"].data;
    let data_hash = makeHash(data, 'year');

    let years = [];
    for (let year = window.chart_data["poverty_num_min_china"].years.start, end = window.chart_data["poverty_num_min_china"].years.end; year <= end; ++year)
        years.push(year);

    let series = [
        { name: '7.5$/day', data: [] },
        { name: '10$/day', data: [] },
        { name: '15$/day', data: [] }
    ];

    years.forEach(year => {
        let data_row = data_hash[year];
        if (data_row) {
            series[0].data.push(data_row['7.5']);
            series[1].data.push(data_row['10']);
            series[2].data.push(data_row['15']);
        } else {
            series[0].data.push(null);
            series[1].data.push(null);
            series[2].data.push(null);
        }
    });

    options['xaxis'] = { categories: years, tickAmount: 30, tooltip: { enabled: false } };
    options['chart'].id = ('Number of people in poverty in the world, minus China').replace(/ /g, "");
    options.series = series;

    return createApexChart(canvasID, options);
}

//--------------------------------------- abbreviatedTooltip
function abbreviatedTooltip(dataPointIndex, w) {
    let config_series = w.config.series;
    let year = w.globals.categoryLabels[dataPointIndex];
    let color1 = w.config.colors[0];
    let marker1 = '<div class="custom-tooltip-marker" style="background-color:' + color1 + '"></div>';
    let val1 = formatYAxisLabel(config_series[0].data[dataPointIndex], null, 0, true)

    let color2 = w.config.colors[1];
    let marker2 = '<div class="custom-tooltip-marker" style="background-color:' + color2 + '"></div>';
    let val2 = formatYAxisLabel(config_series[1].data[dataPointIndex], null, 0, true)

    let color3 = w.config.colors[2];
    let marker3 = '<div class="custom-tooltip-marker" style="background-color:' + color3 + '"></div>';
    let val3 = formatYAxisLabel(config_series[2].data[dataPointIndex], null, 0, true)

    return '<div class="custom-tooltip-box">' +
        '<div class="custom-tooltip-title">' + year + '</div>' +
        '<div class="custom-tooltip-line">' + marker1 + '<div>Poverty Line 7.5$/day: <b>' + val1 + '</b></div></div>' +
        '<div class="custom-tooltip-line">' + marker2 + '<div>Poverty Line 10$/day: <b>' + val2 + '</b></div></div>' +
        '<div class="custom-tooltip-line">' + marker3 + '<div>Poverty Line 15$/day: <b>' + val3 + '</b></div></div>' +
        '</div>';
}



