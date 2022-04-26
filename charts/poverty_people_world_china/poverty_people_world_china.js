//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["poverty_people_world_china"] = {
        years: { start: 1981, end: 2015 },
        data: { "7_5": null, "10": null, "15": null },
        poverty_lines: ["7_5", "10", "15"],
    };

    importFilesAndShow_poverty_people_world_china();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_people_world_china() {
    const baseUrl = `${window.charts_path}/${"poverty_people_world_china"}/${"poverty_people_world_china"}`;
    jQuery.get(baseUrl + '_7.5.csv', function (povcal_7_5) {
        window.chart_data["poverty_people_world_china"].data["7_5"] = fromCSV(povcal_7_5, ['string'].concat(Array(5).fill("number")));
        jQuery.get(baseUrl + '_10.csv', function (povcal_10) {
            window.chart_data["poverty_people_world_china"].data["10"] = fromCSV(povcal_10, ['string'].concat(Array(5).fill("number")));
            jQuery.get(baseUrl + '_15.csv', function (povcal_15) {
                window.chart_data["poverty_people_world_china"].data["15"] = fromCSV(povcal_15, ['string'].concat(Array(5).fill("number")));
                // hideShow('7_5');
                // showChart();
                // Render Chart Interface
                var chart = createChartInterface({
                    chartID: 'poverty_people_world_china',
                    renderFunc: render_poverty_people_world_china,
                })
            });
        });
    })
}

//--------------------------------------- showChart
function render_poverty_people_world_china(canvasID) {
    // TODO: add options for ppp 10 and 15
    var chartID = "poverty_people_world_china"
    var options = {
        chart: {
            type: 'line',
            height: '100%',
            fontFamily: 'Open Sans',
            toolbar: {
                show: false,
                tools: { zoom: false }
            },
            selection: { enable: false },
        },
        theme: {
            palette: 'palette6',
        },
        responsive: [
            {
                breakpoint: 960,
                options: {
                    xaxis: { tickAmount: 10 }
                }
            },
            {
                breakpoint: 401,
                options: {
                    //chart: {height: 300},
                }
            }
        ],
        dataLabels: {
            enabled: false,
        },
        yaxis: {
            min: 0,
            max: 100,
            labels: { formatter: (val, index) => formatYAxisLabel(val, index) + '%' }
        },
        tooltip: {
            y: {
                formatter: (val, index) => '$' + formatTooltipVal(val, index),
            },
            followCursor: true,
            shared: false,
        },
        legend: {
            show: true
        },
    }

    let data = window.chart_data[chartID].data;
    let data_hash = {};
    window.chart_data[chartID].poverty_lines.forEach((pLine, i) => {
        data_hash[pLine] = makeHash(data[pLine], 'year');
    })

    let years = [];
    for (let year = window.chart_data[chartID].years.start, end = window.chart_data[chartID].years.end; year <= end; ++year)
        years.push(year);

    let series = [
        { name: 'World', data: [] },
        { name: 'World minus China', data: [] }
    ];
    years.forEach(year => {

        window.chart_data[chartID].poverty_lines.forEach((pLine, i) => {
            let data_row = data_hash[pLine][year];
            if (i === 0) {
                if (data_row && i === 0) {
                    series[0].data.push(data_row['pct_poor']);
                    series[1].data.push(data_row['pct_poor_minus_china']);
                } else {
                    series[0].data.push(null);
                    series[1].data.push(null);
                }
            }
        });
    });

    options['chart'].id = chartID;
    options['xaxis'] = { categories: years, tooltip: { enabled: false } };
    options.series = series;

    // setTimeout(function () {
    //     window.charts[chartID].hideSeries("10");
    //     window.charts[chartID].hideSeries("15");
    // }, 600)
    return createApexChart(canvasID, options);
}