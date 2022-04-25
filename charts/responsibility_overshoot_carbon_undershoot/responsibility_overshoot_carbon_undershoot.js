//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["responsibility_overshoot_carbon_undershoot"] = {
        data: {},
        countries: {}
    };
    importFilesAndShow_responsibility_overshoot_carbon_undershoot();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_responsibility_overshoot_carbon_undershoot() {
    loadCsv(`${window.charts_path}/${"responsibility_overshoot_carbon_undershoot"}/${"responsibility_overshoot_carbon_undershoot"}.csv`, function (err, overshot_data) {
        if (err === null) {
            loadCsv(`${window.charts_path}/${"responsibility_overshoot_carbon_undershoot"}/country.csv`, function (err, countries) {
                if (err === null) {
                    window.chart_data["responsibility_overshoot_carbon_undershoot"].data = fromCSV(overshot_data, ['string'].concat(Array(8).fill('number')));
                    window.chart_data["responsibility_overshoot_carbon_undershoot"].countries = CSVLookup(countries, '%');

                    // Render Chart Interface
                    createChartInterface({
                        chartID: 'responsibility_overshoot_carbon_undershoot',
                        renderFunc: render_responsibility_overshoot_carbon_undershoot,
                    })
                } else {
                    console.error("failed to load data ", err)
                }
            });
        } else {
            console.error("failed to load data ", err)
        }



    });
}

//--------------------------------------- showChart
function render_responsibility_overshoot_carbon_undershoot(canvasID) {

    var chartID = "responsibility_overshoot_carbon_undershoot"
    var options = {
        chart: {
            type: 'bar',
            stacked: true,
            height: '3500',
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
                    xaxis: { tickAmount: 1 }
                }
            },
            {
                breakpoint: 601,
                options: {
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
        plotOptions: {
            bar: {
                horizontal: true,

                dataLabels: {
                    position: 'middle',
                }
            }
        },
        // dataLabels: {
        //     enabled: false,
        //     //textAnchor: 'start',
        //     formatter: (val, index) => formatTooltipVal(val, index),
        //     offsetX: 10,
        //     style: {
        //         fontWeight: 'normal',
        //         colors: ['black']
        //     }
        // },
        yaxis: {
            max: 3.8e11,
            labels: { align: 'left' }
        },
        xaxis: {
            tickAmount: 1,
            position: 'top',
            axisBorder: { show: false },
            labels: { formatter: (val, index) => formatYAxisLabel(val, index, 0) },
            axisTicks: { height: 0 }
        },
        colors: ['#775DD0', '#73c71c'],
        grid: {
            padding: {
                top: 0,
            }
        },
        tooltip: {
            y: {
                formatter: (val, index) => formatTooltipVal(val, index),
            },
            followCursor: true,
            shared: false,
        },
        annotations: {
            xaxis: [

                {
                    label: {
                        text: '0',
                        orientation: 'horizontal',
                        offsetY: -17,
                        textAnchor: 'middle'
                    },
                    x: 0,
                    borderColor: '#4d4d4d',
                }
            ],
        },
        legend: { show: false},
    }

    let sorted = window.chart_data["responsibility_overshoot_carbon_undershoot"].data.sort((a, b) => b['overshoot_350'] - a['overshoot_350']);
    sorted = sorted.filter(x => x.iso != 'GUY'); // EXCLUDING Guyana
    let countries = [];
    let series = [
        { name: 'tonnes of CO2', data: [] },
        { name: 'tonnes of CO2', data: [] }
    ];
    sorted.forEach(row => {
        let overshoot = +row['overshoot_350'];
        if (overshoot > 0) {
            series[0].data.push(overshoot);
            series[1].data.push(0);
        } else {
            series[0].data.push(0);
            series[1].data.push(overshoot);
        }

        countries.push(window.chart_data["responsibility_overshoot_carbon_undershoot"].countries[row['iso']]);
    });
    console.log(series, sorted)

    options.xaxis.categories = countries;
    options['chart'].id = ('Overshoot of 350ppm Carbon Budget').replace(/ /g, "");
    options.series = series;
    return createApexChart(canvasID, options);

}


