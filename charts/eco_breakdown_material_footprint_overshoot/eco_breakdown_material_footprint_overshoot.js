//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["eco_breakdown_material_footprint_overshoot"] = {
        data: {},
        countries:{}
    };
    importFilesAndShow_eco_breakdown_material_footprint_overshoot();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_eco_breakdown_material_footprint_overshoot() {
    loadCsv(`${window.charts_path}/${"eco_breakdown_material_footprint_overshoot"}/${"eco_breakdown_material_footprint_overshoot"}.csv`, function (err, overshot_data) {
        if (err === null) {
            loadCsv(`${window.charts_path}/${"eco_breakdown_material_footprint_overshoot"}/country.csv`, function (err, countries) {
                if (err === null) {
                    window.chart_data["eco_breakdown_material_footprint_overshoot"].data = fromCSV(overshot_data, ['string'].concat(Array(8).fill('number')));
                    window.chart_data["eco_breakdown_material_footprint_overshoot"].countries = CSVLookup(countries,'%');

                    // Render Chart Interface
                    createChartInterface({
                        chartID: 'eco_breakdown_material_footprint_overshoot',
                        renderFunc: render_eco_breakdown_material_footprint_overshoot,
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
function render_eco_breakdown_material_footprint_overshoot(canvasID) {

    var chartID = "eco_breakdown_material_footprint_overshoot"
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
            }
        },
        dataLabels: {
            enabled: false
        },
        yaxis: {
            //max: 3.8e11,
            labels: { align: 'left'}
        },
        xaxis: {
            tickAmount: 1,
            position: 'top',
            axisBorder: { show: false },
            labels: { formatter: (val, index) => formatYAxisLabel(val, index, 0)+' Gt'},
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
    }


    let sorted = window.chart_data["eco_breakdown_material_footprint_overshoot"].data.sort((a, b) => b['Cumulative-MF-overshoot'] - a['Cumulative-MF-overshoot']);
    //sorted = sorted.filter(x => x.iso != 'GUY'); // EXCLUDING Guyana
    let countries = [];
    let series = [
        { name: 'Gigatonnes (Gt)', data:[]},
    ];
    sorted.forEach(row => {
        let overshoot = +row['Cumulative-MF-overshoot'];
        if (overshoot > 0) {
            series[0].data.push(overshoot);
            countries.push(window.chart_data["eco_breakdown_material_footprint_overshoot"].countries[row['category']]);
        }
    });

    options.xaxis.categories = countries;
    options['chart'].id = ('Cumulative Material Footprint overshoot (1970-2017)').replace(/ /g, "");
    options.series = series;
    return createApexChart(canvasID, options);

}

