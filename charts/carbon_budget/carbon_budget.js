//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["carbon_budget"] = {
        data: {},
        countries: {},
        my_custom_choice: 1,
        countries_sorted: []
    };
    importFilesAndShow_carbon_budget();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_carbon_budget() {
    loadCsv(`${window.charts_path}/${"carbon_budget"}/${"carbon_budget"}.csv`, function (err, overshot_data) {
        if (err === null) {
            loadCsv(`${window.charts_path}/${"carbon_budget"}/country.csv`, function (err, countries) {
                if (err === null) {
                    window.chart_data["carbon_budget"].data = fromCSV(overshot_data, ['string'].concat(Array(8).fill('number')));
                    window.chart_data["carbon_budget"].countries = CSVLookup(countries, '%');
                    var data = window.chart_data['carbon_budget']
                    // Create custom tools for the sidebar (optional)
                    data.my_custom_choice = 1;
                    var customTools = `
        <button onclick="toggleChartArea(this, 'choice', 'carbon_budget')" value="OFF" class="chart-btn">
          <i class="fa-solid fa-sliders"></i>Degrees
        </button>

        <div class="chart-btn-area" id="chart-carbon_budget-choice-btns">

          <button class="chart-btn" id="carbon_budget-choice-1" onclick="setChoice_carbon_budget(1)">
            <i class="fa-solid fa-square-check"></i>1.5°
          </button> 

          <button class="chart-btn" id="carbon_budget-choice-2" onclick="setChoice_carbon_budget(2)">
            <i class="fa-solid fa-square"></i></i>2°
          </button>

        </div>
        `
                    // Render Chart Interface
                    createChartInterface({
                        chartID: 'carbon_budget',
                        renderFunc: render_carbon_budget,
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
function render_carbon_budget(canvasID) {

    var data = window.chart_data['carbon_budget']
    const series = generateSeries_carbon_budget(data);
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
            // max: 3.8e11,
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
            labels: { formatter: (val, index) => formatYAxisLabel(val, index, 0) + " %" },
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
            // followCursor: true,
            shared: true,
            intersect: false
        },
        annotations: {
            xaxis: [
                {
                    x: '100',
                    borderColor: '#9A0000',
                    label: {
                        orientation: 'horizontal',
                        text: '100%',
                        borderColor: "#9A0000",
                        offsetY: -17,
                        style: {
                            color: "#fff",
                            background: "#9A0000"
                        },
                    }
                }
            ]
        },
        series: series,
    }



    options.xaxis.categories = window.chart_data["carbon_budget"].countries_sorted;
    options['chart'].id = ('Overshoot of 350ppm Carbon Budget').replace(/ /g, "");
    return createApexChart(canvasID, options);

}


// Function to change custom choice
function setChoice_carbon_budget(choice) {

    var chart = window.charts['carbon_budget']
    var data = window.chart_data['carbon_budget']
    data.my_custom_choice = choice

    var btn1 = document.getElementById(`carbon_budget-choice-1`)
    var btn2 = document.getElementById(`carbon_budget-choice-2`)
    console.log(chart)
    if (choice == 1) {
        btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>1.5°`
        btn2.innerHTML = `<i class="fa-solid fa-square"></i>2°`
    } else if (choice == 2) {
        btn1.innerHTML = `<i class="fa-solid fa-square"></i>1.5°`
        btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>2°`
    }
    const updateData = generateSeries_carbon_budget(data);
    chart.updateOptions({ xaxis: { categories: window.chart_data["carbon_budget"].countries_sorted } })
    chart.updateSeries(updateData)

};

// Generate data series based on custom choice
function generateSeries_carbon_budget() {

    var data = window.chart_data['carbon_budget']
    var identifer = ""
    if (data.my_custom_choice == 1) {
        identifer = "pct_overshoot_15C"
    } else if (data.my_custom_choice == 2) {
        identifer = "pct_overshoot_2C"

    }
    window.chart_data["carbon_budget"].data.forEach(function (row) {
        row[identifer] *= row[identifer] < 0 ? 0 : 1;
    });
    let sorted = window.chart_data["carbon_budget"].data.sort((a, b) => b[identifer] - a[identifer]);
    sorted = sorted.filter(x => x.iso != 'GUY'); // EXCLUDING Guyana
    let series = [
        { name: '% Budget Used', data: [] },
    ];
    window.chart_data["carbon_budget"].countries_sorted = [];
    sorted.forEach(row => {
        let overshoot = +row[identifer];
        if (overshoot > 0) {
            series[0].data.push(overshoot * 100);
            window.chart_data["carbon_budget"].countries_sorted.push(window.chart_data["carbon_budget"].countries[row['iso']]);
        }
    });
    return series;

}