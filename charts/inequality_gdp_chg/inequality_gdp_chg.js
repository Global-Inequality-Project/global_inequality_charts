//--------------------------------------- window.ready
jQuery(function() {
    checkObjectKeysFunc();
    window.chart_data["inequality_gdp_chg"] = {
        percentiles: { start: 1, end: 100},
    };

    importFilesAndShow_inequality_gdp_chg();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gdp_chg(){
	jQuery.get(`${window.charts_path}/${"inequality_gdp_chg"}/${"inequality_gdp_chg"}.csv`, function(gdp_nrt_sth){
        window.chart_data["inequality_gdp_chg"].data = fromCSV(gdp_nrt_sth, ['string', 'number', 'number']);
        
        // Render Chart Interface
        createChartInterface({
          chartID:'inequality_gdp_chg',
          renderFunc:render_inequality_gdp_chg,
        })

	});
}

//--------------------------------------- showChart
function render_inequality_gdp_chg(canvasID) {
    
    var chartID = "inequality_gdp_chg"
    var options = {
        chart: {
            type: 'bar',
            height: '100%',
            fontFamily: 'Open Sans',
            toolbar: {
                show: false,
                tools: {zoom: false}
            },
            selection: {enable: false},
        },
        theme: {
            palette: 'palette6',
        },
        responsive: [
            {
                breakpoint: 960,
                options: {
                    xaxis: {tickAmount: 10}
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
        xaxis: {
            type: 'numeric',
            tickAmount: 20,
            tickPlacement: 'between',
            labels: {
                rotateAlways: true,
                formatter: percentile => formatPercentileLabel(percentile),
                maxHeight: 60,
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            max: 150e3,
            tickAmount: 5,
            labels: { 
                formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true),
                maxWidth: 40,
            }
        },
        grid: {
            padding: {
                top: 0,
            }
        },
        tooltip: {
            y: { 
                formatter: (val, index) => '$'+formatTooltipVal(val, index, 0), 
                title: {
                    formatter: (seriesName) => '',
                },
            },
            x: {
                formatter: (val) => 'Percentile: '+val,
            }
        },
        legend: {
            show: false
        },
	}

	let data = window.chart_data["inequality_gdp_chg"].data;
    let data_hash  = makeHash(data, 'percentile');

	let percentiles = [];
	for (let percentile=window.chart_data["inequality_gdp_chg"].percentiles.start, end = window.chart_data["inequality_gdp_chg"].percentiles.end; percentile <= end; ++percentile)
		percentiles.push(percentile);

	let series = [ { name: 'Change in annual income (1980-2016)', data:[]}];

    percentiles.forEach(percentile => {
        let data_row = data_hash[percentile];
        if (data_row)
            series[0].data.push(data_row['change']);
        else
            series[0].data.push(null);
    });

    options['chart'].id = ('Distribution of New Income 1980to2016').replace(/ /g,"");
	options.series = series;

    return createApexChart(canvasID, options);
}