//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["climate_overshoot_carbon"] = {
        data: {},
        countries: {}
    };
    importFilesAndShow_climate_overshoot_carbon();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_climate_overshoot_carbon() {
    loadCsv(`${window.charts_path}/${"climate_overshoot_carbon"}/${"climate_overshoot_carbon"}.csv`, function (err, overshot_data) {
        if (err === null) {
            loadCsv(`${window.charts_path}/${"climate_overshoot_carbon"}/country.csv`, function (err, countries) {
                if (err === null) {
                    window.chart_data["climate_overshoot_carbon"].data = fromCSV(overshot_data, ['string'].concat(Array(8).fill('number')));
                    window.chart_data["climate_overshoot_carbon"].countries = CSVLookup(countries, '%');

                    // Render Chart Interface
                    createChartInterface({
                        chartID: 'climate_overshoot_carbon',
                        renderFunc: render_climate_overshoot_carbon,
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
function render_climate_overshoot_carbon(canvasID) {

    var chartID = "climate_overshoot_carbon"
    window.chart_data[chartID].data.forEach(function (row) {
        row['overshoot_350'] *= row['overshoot_350'] < 0 ? 0 : 1;
    });
    let sorted = window.chart_data[chartID].data.sort((a, b) => b['overshoot_350'] - a['overshoot_350']);
    sorted = sorted.filter(x => x.iso != 'GUY'); // EXCLUDING Guyana
    let countries = [];
    let series = [
        { name: 'tonnes of CO2', data: [] },
    ];
    sorted.forEach(row => {
        let overshoot = +row['overshoot_350'];
        if (overshoot > 0) {
            series[0].data.push(overshoot);
            countries.push(window.chart_data[chartID].countries[row['iso']]);
        }
    });
    var options = {
        chart: {
            type: 'bar',
            stacked: true,
            height: series[0].data.length * 25,
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
            }
        },
        dataLabels: {
            enabled: false,
        },
        yaxis: {
            max: 3.8e11,
            labels: {
                offsetY: 2,
                align: 'left',
                style: {
                    fontSize: '12px',
                },
            }
        },
        xaxis: {
            tickAmount: 1,
            position: 'top',
            axisBorder: { show: false },
            labels: { formatter: (val, index) => formatYAxisLabel(val, index, 0) },
            axisTicks: { height: 0 },
            categories: countries
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
            intersect: false,
            shared:true
        },
        series: series
    }



    options['chart'].id = ('Overshoot of 350ppm Carbon Budget').replace(/ /g, "");
    return createApexChart(canvasID, options);

}


