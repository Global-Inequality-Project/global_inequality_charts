//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["poverty_average_income"] = {
        regions: {
            EAP: "East Asia and Pacific",
            SAS: "South Asia",
            SSF: "Sub-Saharan Africa",
            LCN: "Latin America and the Caribbean",
            MEA: "Middle East and North Africa",
            WOR: "World",
          },
        years: { start: 1981, end: 2017 },
    };

    importFilesAndShow_poverty_average_income();

});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_average_income() {

    var chartID = "poverty_average_income"

    jQuery.get(`${window.charts_path}/${chartID}/${chartID}.csv`, function (poverty_average_income) {
        window.chart_data[chartID].data = fromCSV(poverty_average_income, ['string', 'number', 'number', 'number']);

        // Render Chart Interface
        createChartInterface({
            chartID: 'poverty_average_income',
            renderFunc: render_poverty_average_income,
        })

    });
}

//--------------------------------------- showChart
function render_poverty_average_income(canvasID) {

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

    let chart_data = window.chart_data["poverty_average_income"]

    let years = [];
    for (let year = window.chart_data["poverty_average_income"].years.start, end = window.chart_data["poverty_average_income"].years.end; year <= end; ++year)
        years.push(year);
    let series = [];
    let shortcut = [];
    Object.entries(chart_data.regions).forEach(([key,value]) => {
        series.push({name: key, data: []});
        //shortcut.push({value: key})
    });

    for (let i = 0; i < years.length; i++) {
        // console.log(chart_data.data[i],i)
        if (chart_data.data[i]) {
            series.forEach(country => {
                // console.log(shortcut[country])
                country_name = country.name
                country.data.push(chart_data.data[i].country_name)
            })
        } else {
            series.forEach(country => {
                country.data.push(null)
            })
        }
    }
    console.log(series)


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

// series korrekt erstellen, vielleicht nur möglich über hash function


