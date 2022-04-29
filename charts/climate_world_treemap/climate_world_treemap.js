// Wait for window to be ready
jQuery(function () {
  prepare_climate_world_treemap();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_climate_world_treemap() {
  createChartInterface({
    chartID: "climate_world_treemap",
    renderFunc: render_climate_world_treemap,
  })

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_climate_world_treemap(canvasID, modal) {
  var options = {
    chart: {
      type: 'treemap',
      fontFamily: 'Open Sans',
      toolbar: {
        show: false,
        tools: { zoom: false }
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
      },
      formatter: function(text, op) {
        return [text, op.value+"%"]
      },
      offsetY: -4
    },
    tooltip: {
      y: {
          formatter: (val, index) => formatTooltipVal(val, index, 0)+"%",
      },
      followCursor: true,
      shared: false,
  },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.5,
        reverseNegativeShade: true,
        colorScale: {
          ranges: [
            {
              from: -6,
              to: 9,
              color: '#52B12C'
            },
            {
              from: 10,
              to: 50,
              color: '#CD363A'
            }
          ]
        }
      }
    }
  }
  var series = [
    {
      data: [
        {
          x: 'USA',
          y: 40
        },
        {
          x: 'EU-28',
          y: 29
        },
        {
          x: 'Rest of Europe',
          y: 13
        },
        {
          x: 'Rest of Global North',
          y: 10
        },
        {
          x: 'Global South',
          y: 8
        },
      ]
    }
  ]
  options.series = series;
  options['chart'].id = "climate_world_treemap"
  return createApexChart(canvasID, options);

}