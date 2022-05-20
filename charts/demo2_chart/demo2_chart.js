// Wait for window to be ready
jQuery(function() {
    prepare_demo2_chart();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_demo2_chart(){

  loadJson(`${window.charts_path}/demo2_chart/custom_data_file.json`,
    function (error, data) {
      if (error === null) {

        window.chart_data['demo2_chart'] = data;

        // Create custom tools for the sidebar (optional)
        data.my_custom_choice = 1;
        var customTools = `
        <button onclick="toggleChartArea(this, 'choice', 'demo2_chart')" value="OFF" class="chart-btn">
          <i class="fa-solid fa-sliders"></i>My custom choice
        </button>

        <div class="chart-btn-area" id="chart-demo2_chart-choice-btns">

          <button class="chart-btn" id="demo2_chart-choice-1" onclick="setChoice_demo2_chart(1)">
            <i class="fa-solid fa-square-check"></i>Choice 1
          </button>

          <button class="chart-btn" id="demo2_chart-choice-2" onclick="setChoice_demo2_chart(2)">
            <i class="fa-solid fa-square"></i></i>Choice 2
          </button>

        </div>
        `

        // Render Chart Interface
        createChartInterface({
          chartID: "demo2_chart",
          renderFunc: render_demo2_chart,
          customTools: customTools,
        })
      } else {
          console.log(error)
    }
  });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_demo2_chart(canvasID, modal) {

  var data = window.chart_data['demo2_chart']

  // Create a bigger chart in the modal
  if (modal == true) {
    var height = '200%'
  } else {
    var height = '100%'
  }

  var options = {
    chart: {
      type: 'line',
      height: height, // In most cases, this should be set to '100%'
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
    series: generateSeries_demo2_chart(data),
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
    //chart.hideSeries('var2');
    //chart.hideSeries('var3');
  }

  // Render chart to canvas and return chart
  // The function createApexChart() can be found in assets/js/chartutils.js
  return [createApexChart(canvasID, options, callback),createApexChart(canvasID+'-2', options)];

}


// Function to change custom choice
function setChoice_demo2_chart(choice){

  var charts = window.charts['demo2_chart']
  var data = window.chart_data['demo2_chart']
  data.my_custom_choice = choice

  var btn1 = document.getElementById(`demo2_chart-choice-1`)
  var btn2 = document.getElementById(`demo2_chart-choice-2`)

  if (choice == 1) {
    btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>Choice 1`
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>Choice 2`
    charts[0].updateSeries(generateSeries_demo2_chart(data))
    charts[1].updateSeries(generateSeries_demo2_chart(data))
  } else if (choice == 2) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>Choice 1`
    btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>Choice 2`
    charts[0].updateSeries(generateSeries_demo2_chart(data))
    charts[1].updateSeries(generateSeries_demo2_chart(data))
  }

};


// Generate data series based on custom choice
function generateSeries_demo2_chart(){

  var data = window.chart_data['demo2_chart']
  if (data.my_custom_choice == 1) {

    return [{
        name: 'var1',
        data: data['var1']
      },{
        name: 'var2',
        data: data['var2']
      },{
        name: 'var3',
        data: data['var3']
    }];

  } else if (data.my_custom_choice == 2) {

    return [{
        name: 'var1',
        data: data['var1_choice_2']
      },{
        name: 'var2',
        data: data['var2_choice_2']
      },{
        name: 'var3',
        data: data['var3_choice_2']
    }];

  }

}