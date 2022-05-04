//--------------------------------------- window.ready
jQuery(function() {
    checkObjectKeysFunc();
    window.chart_data["eco_breakdown_global_use"] = {
        years: { start: 1900, end: 2017},
    };

    importFilesAndShow_eco_breakdown_global_use();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_eco_breakdown_global_use(){
	jQuery.get(`${window.charts_path}/${"eco_breakdown_global_use"}/${"eco_breakdown_global_use"}.csv`, function(gdp_nrt_sth){
        window.chart_data["eco_breakdown_global_use"].data = fromCSV(gdp_nrt_sth, ['string', 'number', 'number']);

        // Render Chart Interface
        createChartInterface({
          chartID:'eco_breakdown_global_use',
          renderFunc:render_eco_breakdown_global_use,
        })

	});
}

//--------------------------------------- showChart
function render_eco_breakdown_global_use(canvasID) {

    var chartID = "eco_breakdown_global_use"
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
                formatter: (val, index) => formatYAxisLabel(val, index, 0, true)+' Gt',
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
                formatter: (val, index) => formatTooltipVal(val, index, 2)+' Gt',
                title: {
                    formatter: (seriesName) => '',
                },
            },
            x: {
                formatter: (val) => 'Year: '+val,
            }
        },
        legend: {
            show: false
        },
        annotations: {
            yaxis: [
                {
                y: 50,
                borderColor: '#9A0000',
                borderWidth: 5,
                strokeDashArray: 5,
                offsetY: 2.5,
                label: {
                    text: 'Sustainability threshold',
                    position: 'left',
                    textAnchor: 'start',
                    borderColor: '#9A0000',
                    offsetY: 1,
                    offsetX: 5,
                    style: {
                        color: '#fff',
                        fontSize: '14px',
                        background: '#9A0000'
                    }
                }
                },
                {
                y: 50,
                borderColor: '#9A0000',
                borderWidth: 5,
                strokeDashArray: 5,
                offsetY: 2.5,
                label: {
                    text: '50 Gt',
                    position: 'left',
                    textAnchor: 'start',
                    borderColor: '#fff',
                    offsetY: 5,
                    offsetX: -38,
                    style: {
                        color: '#9A0000',
                    },
                    },
                }
            ]
        }
	}

	let data = window.chart_data["eco_breakdown_global_use"].data;
    let data_hash  = makeHash(data, 'year');

	let years = [];
	for (let year=window.chart_data["eco_breakdown_global_use"].years.start, end = window.chart_data["eco_breakdown_global_use"].years.end; year <= end; ++year)
		years.push(year);

	let series = [ { name: 'Global resource use (1900-2017)', data:[]}];

    years.forEach(year => {
        let data_row = data_hash[year];
        if (data_row)
            series[0].data.push(data_row['Gigatonnes']);
        else
            series[0].data.push(null);
    });

    options['xaxis'] = { categories: years, tickAmount: 30, tooltip: {enabled: false}  };
    options['chart'].id = ('Global resource use (1900-2017)').replace(/ /g,"");
	options.series = series;

    return createApexChart(canvasID, options);
}