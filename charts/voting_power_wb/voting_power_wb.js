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
      type: "donut",
      fontFamily: "Open Sans",
      toolbar: {
        show: false,
        tools: { zoom: false },
      },
    },
    responsive: [
      {
        breakpoint: 601,
        options: {
          plotOptions: {
            pie: {
              dataLabels: {
                offset: 0,
                minAngleToShowLabel: 20,
              },
            },
          },
          dataLabels: {
            style: {
              fontSize: "12px",
            },
          },
          legend: {
            offsetY: -80,
          },
        },
      },
      {
        breakpoint: 420,
        options: {
          dataLabels: {
            style: {
              fontSize: "10px",
            },
          },
          legend: {
            fontSize: "10px",
            offsetY: -20,
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
      },
      formatter: function(val, op) {
        return [val.toFixed(2) + "%"];
      },
      offsetY: -4,
    },
    tooltip: {
      y: {
        formatter: (val, index) => val.toFixed(2) + "%",
      },
      followCursor: true,
      shared: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
        customScale: 1,
        dataLabels: {
          minAngleToShowLabel: 15,
        },
      },
    },
    legend: {
      offsetY: -150,
      position: 'bottom',
    },
    colors: [
      "#3f51b5",
      "#4091c2",
      "#43A337",
      "#287621",
      "#5EE04C",
      "#36FF40",
      "#53C744",
    ],
    grid: {
      padding: {
        bottom: -80,
      },
    },
    series: [53.6, 9.4, 8.9, 6.9, 7.0, 6.9, 7.3],
    labels: ["G7 and European Union", "Rest of Global North", "Latin America", "Middle East and North Africa", "East Asia and Pacific", "South and Central Asia", "Sub-Saharan Africa"],
  }
  options['chart'].id = "voting_power_wb"
  return createApexChart(canvasID, options);

}