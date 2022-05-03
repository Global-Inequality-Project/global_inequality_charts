// Wait for window to be ready
jQuery(function () {
  prepare_voting_power_wb();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_voting_power_wb() {
  createChartInterface({
    chartID: "voting_power_wb",
    renderFunc: render_voting_power_wb,
  })

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_voting_power_wb(canvasID, modal) {
  var options = {
    chart: {
      type: 'donut',
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
      formatter: function (val, op) {
        return [val.toFixed(2) + "%"]
      },
      offsetY: -4
    },
    tooltip: {
      y: {
        formatter: (val, index) => val.toFixed(1) + "%",
      },
      followCursor: true,
      shared: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10
      }
    },
    colors: ['#3f51b5', '#4091c2', '#43A337','#287621', '#5EE04C', '#36FF40','#53C744'],
    grid: {
      padding: {
        bottom: -80
      }
    },
    series: [53.6, 9.4, 8.9, 6.9, 7.0, 6.9, 7.3],
    labels: ["G7 and European Union", "Rest of North", "Latin America", "Middle East and North Africa", "East Asia", "South and Central Asia", "Sub-Saharan Africa"],
  }
  options['chart'].id = "voting_power_wb"
  return createApexChart(canvasID, options);

}