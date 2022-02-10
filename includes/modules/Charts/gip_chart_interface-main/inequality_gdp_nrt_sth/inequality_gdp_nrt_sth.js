//--------------------------------------- window.ready
$(function() {
    checkObjectKeysFunc();
    window.chart_data["inequality_gdp_nrt_sth"] = {
        years: { start: 1960, end: 2018},
    };

    importFilesAndShow_inequality_gdp_nrt_sth();

});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gdp_nrt_sth(){
	$.get(`${window.path_to_charts2}/${"inequality_gdp_nrt_sth"}/${"inequality_gdp_nrt_sth"}.csv`, function(gdp_nrt_sth){
        window.chart_data["inequality_gdp_nrt_sth"].data = fromCSV(gdp_nrt_sth, ['string', 'number', 'number']);
        

        // Render Chart Interface
        createChartInterface({
          chartID:'inequality_gdp_nrt_sth',
          chartTitle:"GDP per capita: Global North vs. Global South",
          chartDescription:"Constant 2010 USD",
          chartSources:"Chart Sources",
          renderFunc:render_inequality_gdp_nrt_sth,
          topMargin:"-15px",
        })

	});
}

//--------------------------------------- showChart
function render_inequality_gdp_nrt_sth(canvasID){

    var chartID = "inequality_gdp_nrt_sth"
    var options = {
        chart: {
            type: 'line',
            toolbar: {
                show: false,
                tools: {zoom: false}
            },
        },
        theme: {
            palette: 'palette7',
        },
        responsive: [
            {
                breakpoint: 961,
                options: {
                    xaxis: {tickAmount: 10}
                }
            },
            {
                breakpoint: 401,
                options: {
                    yaxis: {
                        tickAmount: 5,
                        labels: {
                            formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true)
                        }
                    },
                }
            }
        ],
        stroke: {
            curve: 'straight',
            width: 2.5
        },
        yaxis: {
            labels: { formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true) }
        },
        grid: {
            padding: {
                top: 0,
            }
        },
        legend: { fontSize: '12px', markers: { width: 10, height: 10, radius: 10, offsetY: '-2px'}},
        tooltip: { y: { formatter: (val, index) => '$'+formatTooltipVal(val, index) }}
	}

	let div_id = '#gdp_nrt_sth';
    let data = window.chart_data["inequality_gdp_nrt_sth"].data;
    let data_hash  = makeHash(data, 'year');

	let years = [];
	for (let year=window.chart_data["inequality_gdp_nrt_sth"].years.start, end = window.chart_data["inequality_gdp_nrt_sth"].years.end; year <= end; ++year)
		years.push(year);

	let series = [
        { name: 'Global North', data:[]},
        { name: 'Global South', data:[]}
    ];

    years.forEach(year => {
        let data_row = data_hash[year];
        if (data_row){
            series[0].data.push(data_row['ADV']);
            series[1].data.push(data_row['EMR']);
        }else{
            series[0].data.push(null);
            series[1].data.push(null);
        }
    });

	options['xaxis'] = { categories: years, tickAmount: 30, tooltip: {enabled: false}  };
    options['chart'].id = ('GDP per capita Global North vs Global South').replace(/ /g,"");
	options.series = series;

	var chart = createApexChart(canvasID, chartID, options);
}


//--------------------------------------- abbreviatedTooltip
function abbreviatedTooltip(dataPointIndex, w){
    let config_series = w.config.series;
    let year = w.globals.categoryLabels[dataPointIndex];
    let color1 = w.config.colors[0];
    let marker1 = '<div class="custom-tooltip-marker" style="background-color:'+color1+'"></div>';
    let val1 = '$'+formatYAxisLabel(config_series[0].data[dataPointIndex], null, 0, true)

    let color2 = w.config.colors[1];
    let marker2 = '<div class="custom-tooltip-marker" style="background-color:'+color2+'"></div>';
    let val2 = '$'+formatYAxisLabel(config_series[1].data[dataPointIndex], null, 0, true)

    return '<div class="custom-tooltip-box">' +
        '<div class="custom-tooltip-title">' + year+ '</div>' +
        '<div class="custom-tooltip-line">'+ marker1 + '<div>North: <b>' + val1 +'</b></div></div>' +
        '<div class="custom-tooltip-line">'+ marker2 + '<div>South: <b>' + val2 +'</b></div></div>' +
        '</div>';
}
