// Wait for window to be ready
jQuery(function () {
  prepare_eco_breakdown_treemap();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_eco_breakdown_treemap() {
  createChartInterface({
    chartID: "eco_breakdown_treemap",
    renderFunc: render_eco_breakdown_treemap,
  })

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_eco_breakdown_treemap(canvasID, modal) {
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
        fontSize: '12px',
      },
      formatter: function(text, op) {
        return [text, op.value+"%"]
      },
      offsetY: -4
    },
    tooltip: {
      y: {
          formatter: (val, index) => formatTooltipVal(val, index,0)+"%",
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
          y: 27
        },
        {
          x: 'UK+EU',
          y: 25
        },
        {
          x: 'Rest of Europe and HICs',
          y: 24
        },
        {
          x: 'China',
          y: 15
        },
        {
          x: 'Rest of Global South',
          y: 8
        },
      ]
    }
  ]
  options.series = series;
  options['chart'].id = "eco_breakdown_treemap"
  return createApexChart(canvasID, options);

}