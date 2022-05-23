//--------------------------------------- window.ready
jQuery(function () {
    checkObjectKeysFunc();
    window.chart_data["poverty_region"] = {
        regions: {
            EAP: "East Asia and Pacific",
            SAS: "South Asia",
            SSF: "Sub-Saharan Africa",
            LCN: "Latin America and the Caribbean",
            MEA: "Middle East and North Africa"
        },
        years: { start: 1981, end: 2018 },
        poverty_lines: ["7_5", "10", "15"],
    };

    importFilesAndShow_poverty_region();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_region() {
    const baseUrl = `${window.charts_path}/${"poverty_region"}/${"poverty_region"}`;
    jQuery.get(baseUrl + '.csv', function (povcal) {
        window.chart_data["poverty_region"].data = fromCSV(povcal,  ['string', 'string', 'number', 'number'], false, ',', true);
        // Render Chart Interface
        var chart = createChartInterface({
            chartID: 'poverty_region',
            renderFunc: render_poverty_region,
        })
    });
}

//--------------------------------------- showChart
function render_poverty_region(canvasID) {

    var chartID = "poverty_region"
    var options = {
        chart: {
            type: 'area',
            stacked: true,
            height: '100%',
            fontFamily: 'Open Sans',
            toolbar: {
                show: false,
                tools: { zoom: false }
            },
            selection: { enable: false },
        },
        theme: {
            palette: 'palette1',
        },
        fill: {type: 'solid', opacity:0.7},
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
    // todo also render 10 and 15
    let data_hash = {};
    window.chart_data[chartID].poverty_lines.forEach((pLine, i) => {
        let data_filtered = window.chart_data[chartID].data.filter(row => row.povline == pLine.replace('_','.'));
        let data_poor = groupSum(data_filtered, ['year','region'], 'povline' );
        data_hash[pLine] = data_poor;
    })

    let years = [];
    for (let year = window.chart_data[chartID].years.start, end = window.chart_data[chartID].years.end; year <= end; ++year)
        years.push(year);

    let series = [];

    Object.keys(window.chart_data[chartID].regions).forEach((region, i) => {
        series[i] = { name: window.chart_data[chartID].regions[region], data:[]};

          years.forEach(year => {
            let data_row = data_hash["7_5"][year+'_'+region];
            if (data_row)
                series[i].data.push(data_row['poor_pop']*1e6);
            else
                series[i].data.push(null);
        });
    });
    options['chart'].id = ('Number of people in poverty world').replace(/ /g, "");
    options['xaxis'] = { categories: years, tickAmount: 30, tooltip: { enabled: false } };
    options.series = series;
    return createApexChart(canvasID, options);
}