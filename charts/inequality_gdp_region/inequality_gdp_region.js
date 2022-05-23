//--------------------------------------- window.ready
jQuery(function() {
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
        years: { start: 1960, end: 2020},
    };
    importFilesAndShow_inequality_gdp_region();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gdp_region(){
	jQuery.get(`${window.charts_path}/${"inequality_gdp_region"}/${"inequality_gdp_region"}.csv`, function(gdp_region){
        window.chart_data["inequality_gdp_region"].data = fromCSV(gdp_region, ['string'].concat(Array(8).fill('number')));
        
        // Render Chart Interface
        createChartInterface({
          chartID:'inequality_gdp_region',
          renderFunc:render_inequality_gdp_region,
        })


	});
}

//--------------------------------------- showChart
function render_inequality_gdp_region(canvasID){

    var chartID = "inequality_gdp_region"
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
                breakpoint: 601,
                options: {
                    yaxis: {
                        tickAmount: 5,
                        labels: { formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true) }
                    },
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
        yaxis: {
            max: 65e3,
            labels: { formatter: (val, index) => '$'+formatYAxisLabel(val, index, 0, true) }
        },
        colors: ['#775DD0', '#FF4560', '#FEB019', '#00E396', '#008FFB', '#A5978B'],
        grid: {
            padding: {
                top: 0,
            }
        },
        tooltip: {
            y: { 
                formatter: (val, index) => '$'+formatTooltipVal(val, index), 
            },
            followCursor: true,
            shared: false,
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

	return createApexChart(canvasID, options);

}


