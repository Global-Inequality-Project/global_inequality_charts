//--------------------------------------- window.ready
jQuery(function() {
    checkObjectKeysFunc();
    window.chart_data["eco_breakdown_material_footprint_income_group"] = {
        categories: { start: 'Low Income', end: 'Upper Income'},
    };

    importFilesAndShow_eco_breakdown_material_footprint_income_group();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_eco_breakdown_material_footprint_income_group(){
	jQuery.get(`${window.charts_path}/${"eco_breakdown_material_footprint_income_group"}/${"eco_breakdown_material_footprint_income_group"}.csv`, function(eco_breakdown_material_footprint_income_group){
        window.chart_data["eco_breakdown_material_footprint_income_group"].data = fromCSV(eco_breakdown_material_footprint_income_group, ['string', 'string', 'number']);

        // Render Chart Interface
        createChartInterface({
          chartID:'eco_breakdown_material_footprint_income_group',
          renderFunc:render_eco_breakdown_material_footprint_income_group,
        })

	});
}

//--------------------------------------- showChart
function render_eco_breakdown_material_footprint_income_group(canvasID) {

    var chartID = "eco_breakdown_material_footprint_income_group"
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
        yaxis: {
            tickAmount: 5,
            labels: {
                formatter:  index =>  index+' TpC',
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
                formatter: (val, index) => formatTooltipVal(val, index, 2)+' Tonnes per Capita',
                title: {
                    formatter: (seriesName) => '',
                },
            },
            x: {
                formatter: (val) => 'MF by income group (1970-2017): '+val,
            }
        },
        legend: {
            show: false
        },
	}

	let data = window.chart_data["eco_breakdown_material_footprint_income_group"].data;
    let data_hash  = makeHash(data, 'category');

	let categories = ['Low Income','Lower Middle', 'Upper Middle', 'Upper Income'];

	let series = [ { name: 'Global resource use (1900-2017)', data:[]}];

    categories.forEach(category => {
        let data_row = data_hash[category];
        if (data_row)
            series[0].data.push(data_row['Income_group']);
        else
            series[0].data.push(null);
    });

    options['xaxis'] = { categories: categories, tickAmount: 30, tooltip: {enabled: false}  };
    options['chart'].id = ('Global resource use (1900-2017)').replace(/ /g,"");
	options.series = series;

    return createApexChart(canvasID, options);
}