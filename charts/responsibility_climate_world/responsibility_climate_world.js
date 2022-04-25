// Wait for window to be ready
jQuery(function () {
  prepare_responsibility_climate_world();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_responsibility_climate_world() {
  createChartInterface({
    chartID: "responsibility_climate_world",
    renderFunc: render_responsibility_climate_world,
  })

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_responsibility_climate_world(canvasID, modal) {
  console.log(canvasID);
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
          formatter: (val, index) => formatTooltipVal(val, index)+"%",
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
  options['chart'].id = "responsibility_climate_world"
  return createApexChart(canvasID, options);

}