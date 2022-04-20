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
  jQuery("#chart-canvas-responsibility_climate_world").load(`${window.charts_path}/responsibility_climate_world/treemap.svg > *`, function() {
    // console.log("done")
  });
  var data = window.chart_data['responsibility_climate_world']

}


// Function to change custom choice
function setChoice_responsibility_climate_world(choice) {

  var chart = window.charts['responsibility_climate_world']
  var data = window.chart_data['responsibility_climate_world']
  data.my_custom_choice = choice

  var btn1 = document.getElementById(`responsibility_climate_world-choice-1`)
  var btn2 = document.getElementById(`responsibility_climate_world-choice-2`)

  if (choice == 1) {
    btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>Choice 1`
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>Choice 2`
    chart.updateSeries(generateSeries_responsibility_climate_world(data))
  } else if (choice == 2) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>Choice 1`
    btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>Choice 2`
    chart.updateSeries(generateSeries_responsibility_climate_world(data))
  }

};


// Generate data series based on custom choice
function generateSeries_responsibility_climate_world() {

  var data = window.chart_data['responsibility_climate_world']
  if (data.my_custom_choice == 1) {

    return [{
      name: 'var1',
      data: data['var1']
    }, {
      name: 'var2',
      data: data['var2']
    }, {
      name: 'var3',
      data: data['var3']
    }];

  } else if (data.my_custom_choice == 2) {

    return [{
      name: 'var1',
      data: data['var1_choice_2']
    }, {
      name: 'var2',
      data: data['var2_choice_2']
    }, {
      name: 'var3',
      data: data['var3_choice_2']
    }];

  }

}

//-------------------------------------- setTreeChartTooltip(selector)
function setTreeChartTooltip(selector) {
  selector.qtip({
    content: {
      text: function (event, api) {

        var id = $(this).attr('id');

        /*
        var id_parts = long_id.split('_');
        let ignore = Number(id_parts[0]);
        let ndx = Number(id_parts[1]);

        let row = window.global.gdp_chg[ndx];
        let percentile = row.percentile;
        let value = row.change;
        */
        let name = window.global.regions[id].name;
        let pct = window.global.regions[id].pct;
        return '<div class="tooltip-header">' + name +
          '</div><div class="tooltip-detail">' + pct + '%</div>';
      }
    },
    position: {
      my: 'center',
      at: 'center'
    },
    style: {
      def: false,
      classes: 'qtip-light qtip-shadow qtip-rounded'
    }
  });
}
