// Wait for window to be ready
jQuery(function () {
  prepare_drain_sankey();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_drain_sankey() {
  createChartInterface({
    chartID: "drain_sankey",
    renderFunc: render_drain_sankey,
  })

}

// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_drain_sankey(canvasID, modal) {
  setTimeout(function(){
  var canvas = document.createElement('canvas');

  canvas.id = canvasID.replace("#", "") + '_canvas';
  // canvas.width = 400;
  // canvas.height = 400;

  let parent = document.getElementById(canvasID.replace("#", ""))
  parent.appendChild(canvas);
  var ctx = canvas.getContext("2d");


  var colors = {
    "Global North": "orange"
  };

  // the y-order of nodes, smaller = higher
  var priority = {
    "China": 1,
  };
  var labels = {
    // Oil: 'black gold (label changed)'
  }

  function getColor(name) {
    return colors[name] || "green";
  }

  var chart = new Chart(ctx, {
    type: "sankey",
    data: {
      datasets: [
        {
          data: [
            { from: "China", to: "Global North", flow: 18.760 },
            { from: "Southeast Asia and the Pacific", to: "Global North", flow: 11.127 },
            { from: "North Africa, the Middle East and Central Asia", to: "Global North", flow: 10.088 },
            { from: "Peripheral Europe", to: "Global North", flow: 8.750 },
            { from: "Latin America and the Carribean", to: "Global North", flow: 6.475 },
            { from: "South Asia", to: "Global North", flow: 4.624 },
            { from: "Sub-Saharan Africa", to: "Global North", flow: 2.264 },
          ],
          priority,
          labels,
          colorFrom: (c) => getColor(c.dataset.data[c.dataIndex].from),
          colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),
          borderWidth: 0,
          borderColor: 'black'
        }
      ]
    }
  });
},200);
}
