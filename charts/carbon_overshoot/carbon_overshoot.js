//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["carbon_overshoot"] = {
        data: {},
        countries: {},
        my_custom_choice: 1,
        countries_sorted: []
    };
    importFilesAndShow_carbon_overshoot();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_carbon_overshoot() {
    loadCsv(`${window.charts_path}/${"carbon_overshoot"}/${"carbon_overshoot"}.csv`, function (err, overshot_data) {
        if (err === null) {
            loadCsv(`${window.charts_path}/${"carbon_overshoot"}/country.csv`, function (err, countries) {
                if (err === null) {
                    window.chart_data["carbon_overshoot"].data = fromCSV(overshot_data, ['string'].concat(Array(8).fill('number')));
                    window.chart_data["carbon_overshoot"].countries = CSVLookup(countries, '%');
                    var data = window.chart_data['carbon_overshoot']
                    // Create custom tools for the sidebar (optional)
                    data.my_custom_choice = 1;
                    var customTools = `


          <button class="chart-btn" id="carbon_overshoot-choice-1" onclick="setChoice_carbon_overshoot(1)">
            <i class="fa-solid fa-square-check"></i>1.5°
          </button> 

          <button class="chart-btn" id="carbon_overshoot-choice-2" onclick="setChoice_carbon_overshoot(2)">
            <i class="fa-solid fa-square"></i></i>2°
          </button>

        `
                    // Render Chart Interface
                    createChartInterface({
                        chartID: 'carbon_overshoot',
                        renderFunc: render_carbon_overshoot,
                        customTools: customTools,
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
function render_carbon_overshoot(canvasID) {

    var data = window.chart_data['carbon_overshoot']
    const series = generateSeries_carbon_overshoot(data);
    let title = "overshoot of 1.5C budget";
    if (data.my_custom_choice == 2) {
        title = "overshoot of 2C budget"
    }
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
            enabled: false
        },
        yaxis: {
            max: 3.8e11,
            labels: {
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
            shared: true,
            intersect: false
        },
        series: series,
        title: {
            text: "overshoot of 1.5C budget",
            style: {
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "Open Sans",
                color: '#000'
            },
            align: 'center',
            margin: 0
        }
    }



    options.xaxis.categories = window.chart_data["carbon_overshoot"].countries_sorted;
    options['chart'].id = ('Overshoot of 350ppm Carbon Budget').replace(/ /g, "");
    return createApexChart(canvasID, options);

}


// Function to change custom choice
function setChoice_carbon_overshoot(choice) {

    var chart = window.charts['carbon_overshoot']
    var data = window.chart_data['carbon_overshoot']
    data.my_custom_choice = choice

    var btn1 = document.getElementById(`carbon_overshoot-choice-1`)
    var btn2 = document.getElementById(`carbon_overshoot-choice-2`)
    let title = "overshoot of 1.5C budget"
    if (choice == 1) {
        btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>1.5°`
        btn2.innerHTML = `<i class="fa-solid fa-square"></i>2°`
    } else if (choice == 2) {
        btn1.innerHTML = `<i class="fa-solid fa-square"></i>1.5°`
        btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>2°`
        title = "overshoot of 2C budget"

    }
    const updateData = generateSeries_carbon_overshoot(data);
    chart.updateOptions({
        xaxis: { categories: window.chart_data["carbon_overshoot"].countries_sorted },
        title: { text: title },
        chart:{height: updateData[0].data.length * 25}
    })
    chart.updateSeries(updateData)

};

// Generate data series based on custom choice
function generateSeries_carbon_overshoot() {

    var data = window.chart_data['carbon_overshoot']
    var identifer = ""
    if (data.my_custom_choice == 1) {
        identifer = "overshoot_15C"
    } else if (data.my_custom_choice == 2) {
        identifer = "overshoot_2C"

    }
    window.chart_data["carbon_overshoot"].data.forEach(function (row) {
        row[identifer] *= row[identifer] < 0 ? 0 : 1;
    });
    let sorted = window.chart_data["carbon_overshoot"].data.sort((a, b) => b[identifer] - a[identifer]);
    sorted = sorted.filter(x => x.iso != 'GUY'); // EXCLUDING Guyana
    let series = [
        { name: 'tonnes of CO2', data: [] },
    ];
    window.chart_data["carbon_overshoot"].countries_sorted = [];
    sorted.forEach(row => {
        let overshoot = +row[identifer];
        if (overshoot > 0) {
            series[0].data.push(overshoot);
            window.chart_data["carbon_overshoot"].countries_sorted.push(window.chart_data["carbon_overshoot"].countries[row['iso']]);
        }
    });
    return series;

}