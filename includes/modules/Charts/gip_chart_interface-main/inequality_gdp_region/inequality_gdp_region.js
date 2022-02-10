//--------------------------------------- window.ready
$(function() {
    checkObjectKeysFunc();
    window.chart_data["inequality_gdp_region"] = {
        regions: [
            { key: "USA", name: 'USA'},
            { key: "ADV", name: 'Rest of Global North'},
            { key: "LCN", name: 'Latin America & Caribbean'},
            { key: "MEA", name: 'Middle East & North Africa'},
            { key: "EAS", name: 'East Asia & Pacific'},
            //{ key: "ECS", name: 'Europe & Central Asia}',
            { key: "SSF", name: 'Sub-Saharan Africa'},
            { key: "SAS", name: 'South Asia'}
        ],
        years: { start: 1960, end: 2018},
    };
    importFilesAndShow_inequality_gdp_region();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gdp_region(){
	$.get(`${window.path_to_charts2}/${"inequality_gdp_region"}/${"inequality_gdp_region"}.csv`, function(gdp_region){
        window.chart_data["inequality_gdp_region"].data = fromCSV(gdp_region, ['string'].concat(Array(8).fill('number')));
        
        // Render Chart Interface
        createChartInterface({
          chartID:'inequality_gdp_region',
          chartTitle:"GDP per capita: World regions",
          chartDescription:"Constant 2010 USD",
          chartSources:"Chart Sources",
          renderFunc:render_inequality_gdp_region,
          topMargin:"-15px",
        })


	});
}

//--------------------------------------- showChart
function render_inequality_gdp_region(canvasID){

    var chartID = "inequality_gdp_region"
    var options = {
        chart: {
            type: 'line',
            toolbar: {
                show: false,
                tools: {zoom: false}
            },
        },
        theme: {
            palette: 'palette3',
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
                    yaxis: {
                        tickAmount: 5,
                        labels: { formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true) }
                    },
                }
            }
        ],
        stroke: {
            curve: 'straight',
            width: 3
        },
        yaxis: {
            labels: { formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true) }
        },
        grid: {
            padding: {
                top: 0,
            }
        },
	}

	let div_id = '#gdp_region';

	let data = window.chart_data["inequality_gdp_region"].data;
    let data_hash  = makeHash(data, 'year');

	let years = [];
	for (let year=window.chart_data["inequality_gdp_region"].years.start, end = window.chart_data["inequality_gdp_region"].years.end; year <= end; ++year)
		years.push(year);

    let series = [];
    window.chart_data["inequality_gdp_region"].regions.forEach( regionObj => {
        series.push({name: regionObj.name, data: []});
    });

    years.forEach(year => {
        let data_row = data_hash[year];
        if (data_row){
            window.chart_data["inequality_gdp_region"].regions.forEach( (regionObj, i) => {
                series[i].data.push(data_row[regionObj.key]);
            });
        }else{
            window.chart_data["inequality_gdp_region"].regions.forEach( (regionObj, i) => {
                series[i].data.push(null);
            });
        }
    });

	options['xaxis'] = { categories: years, tickAmount: 30, tooltip: {enabled: false} };
	options.series = series;

	var chart = createApexChart(canvasID, chartID, options);

}


