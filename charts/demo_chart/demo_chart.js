// Wait for window to be ready
jQuery(function() {
    prepare_demo_chart();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_demo_chart(){

  loadJson(`${window.charts_path}/demo_chart/custom_data_file.json`, 
    function (error, data) {
      if (error === null) {

        // Optional custom tools for the sidebar
        var customTools = `
        <button class="chart-btn">
          <i class="fa-solid fa-sliders"></i>My custom tools
        </button>
        `

        // Render Chart Interface
        createChartInterface({
          chartID: "demo_chart",
          renderFunc: render_demo_chart, 
          chartData: data,
          customTools: customTools,
        })
      } else {
          console.log(error)
    }
  });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_demo_chart(canvasID, data) {
  
  var options = {
    chart: {
      type: 'line',
      height: '100%', // This makes the chart fill out the given space
      fontFamily: 'Open Sans', // Same as the rest of the plugin
      // Hide & disable all apexchart tools
      // (since we have the tools from the plugin)
      toolbar: {
        show: false,
        tools: {zoom: false}
      },
      selection: {enable: false},
    },
    yaxis: {
      decimalsInFloat: 2,
    },
    series: [{
      name: 'var1',
      data: data['var1']
    },{
      name: 'var2',
      data: data['var2']
    },{
      name: 'var3',
      data: data['var3']
    }],
    xaxis: {
      categories: data['year']
    },
    // Recommended paddings
    grid: {
        padding: {
            bottom: 0,
            left: 10,
            right: 0,
            top: 0,
        }
    },
  }

  // This callback function can be used to 
  // manipulate the chart after rendering
  function callback(chart) {
    chart.hideSeries('var2');
    chart.hideSeries('var3');
  }

  // Convenience function to render apexcharts on canvas
  var chart = createApexChart(canvasID, options, callback);
    
}