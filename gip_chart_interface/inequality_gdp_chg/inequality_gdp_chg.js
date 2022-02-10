//--------------------------------------- window.ready
$(function() {
    checkObjectKeysFunc();
    window.chart_data["inequality_gdp_chg"] = {
        percentiles: { start: 1, end: 100},
    };

    importFilesAndShow_inequality_gdp_chg();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gdp_chg(){
	$.get(`${window.path_to_charts}/${"inequality_gdp_chg"}/${"inequality_gdp_chg"}.csv`, function(gdp_nrt_sth){
        window.chart_data["inequality_gdp_chg"].data = fromCSV(gdp_nrt_sth, ['string', 'number', 'number']);
        

        // Render Chart Interface
        createChartInterface({
          chartID:'inequality_gdp_chg',
          chartTitle:"Distribution of new income (1980-2016)",
          chartDescription:"Constant 2018 USD",
          chartSources:"Chart Sources",
          renderFunc:render_inequality_gdp_chg,
          topMargin:"-15px"
        })


	});
}

//--------------------------------------- showChart
function render_inequality_gdp_chg(canvasID) {
    
    var chartID = "inequality_gdp_chg"
    var options = {
        chart: {
            type: 'bar',
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

    var chart = createApexChart(canvasID, chartID, options);
}


//--------------------------------------- percentileTooltip
function percentileTooltip(dataPointIndex, w){
    let config_series = w.config.series;

    let percentile = w.globals.seriesX[0][dataPointIndex];
    let color = w.config.colors[0];
    let marker = '<div class="custom-tooltip-marker" style="background-color:'+color+'"></div>';
    //let val = '$'+formatYAxisLabel(config_series[0].data[dataPointIndex], null, 1, false);
    let val = '$'+addCommas(config_series[0].data[dataPointIndex]);

    return '<div class="custom-tooltip-box">' +
        '<div class="custom-tooltip-title">' + percentile + '</div>' +
        '<div class="custom-tooltip-line">'+ marker + '<div><b>' + val +'</b></div></div>' +
        '</div>';
}
