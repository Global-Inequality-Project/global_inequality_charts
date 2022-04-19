//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["poverty_people"] = {
        years: { start: 1981, end: 2015 },
        data: { "1_9": null, "7_5": null, "10": null, "15": null },
        poverty_lines: ["1_9", "7_5", "10", "15"],
    };

    importFilesAndShow_poverty_people();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_people() {
    const baseUrl = `${window.charts_path}/${"poverty_people"}/${"poverty_people"}`;
    jQuery.get(baseUrl + '_1.9.csv', function (povcal_1_9) {
        window.chart_data["poverty_people"].data["1_9"] = fromCSV(povcal_1_9, ['string'].concat(Array(5).fill("number")));
        jQuery.get(baseUrl + '_7.5.csv', function (povcal_7_5) {
            window.chart_data["poverty_people"].data["7_5"] = fromCSV(povcal_7_5, ['string'].concat(Array(5).fill("number")));
            jQuery.get(baseUrl + '_10.csv', function (povcal_10) {
                window.chart_data["poverty_people"].data["10"] = fromCSV(povcal_10, ['string'].concat(Array(5).fill("number")));
                jQuery.get(baseUrl + '_15.csv', function (povcal_15) {
                    window.chart_data["poverty_people"].data["15"] = fromCSV(povcal_15, ['string'].concat(Array(5).fill("number")));
                    // hideShow('7_5');
                    // showChart();
                    // Render Chart Interface
                    var chart = createChartInterface({
                        chartID: 'poverty_people',
                        renderFunc: render_poverty_people,
                    })
                });
            });
        })
    });
}

//--------------------------------------- showChart
function render_poverty_people(canvasID) {

    var chartID = "poverty_people"
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
            max: 6e9,
            tickAmount: 13,
            forceNiceScale: true,
            labels: { formatter: (val, index) => formatBillionsLabel(val, index, 1, true) }
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        tooltip: {
            y: { 
                formatter: (val, index) => '$'+formatTooltipVal(val, index), 
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

    let series = [];
    window.chart_data[chartID].poverty_lines.forEach(dataObj => {

        series.push({ name: dataObj.replace('_','.'), data: [] });
    });
    years.forEach(year => {

        window.chart_data[chartID].poverty_lines.forEach((pLine, i) => {
            let data_row = data_hash[pLine][year];
            if (data_row) {
                series[i].data.push(data_row["poor_pop_world"]*1e6);
            } else {
                series[i].data.push(null);
            }
        });
    });

    options['chart'].id = ('Number of people in poverty world').replace(/ /g, "");
    options['xaxis'] = { categories: years, tickAmount: 30, tooltip: {enabled: false} };
    options.series = series;
    setTimeout(function(){
        window.charts[chartID].hideSeries("1_9");
        window.charts[chartID].hideSeries("7_5");
        window.charts[chartID].hideSeries("15");
    }, 600 )
    return createApexChart(canvasID, options);
}