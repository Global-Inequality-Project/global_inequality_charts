
//--------------------------------------- window.ready
jQuery(function() {
    checkObjectKeysFunc();
    window.chart_data["inequality_gdp_nrt_sth"] = {
        years: { start: 1960, end: 2020},
    };

    importFilesAndShow_inequality_gdp_nrt_sth();

});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gdp_nrt_sth(){
	
    var chartID = "inequality_gdp_nrt_sth"

    jQuery.get(`${window.charts_path}/${chartID}/${chartID}.csv`, function(gdp_nrt_sth){
        window.chart_data[chartID].data = fromCSV(gdp_nrt_sth, ['string', 'number', 'number']);
        
        // Render Chart Interface
        createChartInterface({
          chartID:'inequality_gdp_nrt_sth',
          renderFunc:render_inequality_gdp_nrt_sth,
        })

	});
}

//--------------------------------------- showChart
function render_inequality_gdp_nrt_sth(canvasID){

    var options = {
        chart: {
            type: 'line',
            height: '100%',
            fontFamily: 'Open Sans',
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
        yaxis: {
            labels: { formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true) }
        },
        colors: ['#775DD0', '#FF4560', '#FEB019', '#00E396', '#008FFB', '#A5978B'],
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

	return createApexChart(canvasID, options);
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
