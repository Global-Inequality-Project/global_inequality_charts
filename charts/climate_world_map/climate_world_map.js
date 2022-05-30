
// Wait for window to be ready
jQuery(function () {
  prepare_climate_world_map();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_climate_world_map() {
  loadCsv(`${window.charts_path}/climate_world_map/co2_treemap.csv`,
    function (error, treemap_data) {
      if (error === null) {
        window.chart_data['climate_world_map'] = [{
          name: "co2",
          data: {}
        }]
        window.chart_data['climate_world_map'][0].data = fromCSV(treemap_data, ['string', 'number', 'number']);
        createChartInterface({
          chartID: "climate_world_map",
          renderFunc: render_climate_world_map,
        })
      } else {
        console.error(error)
      }
    });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_climate_world_map(canvasID, modal) {
  let values = {};
  window.chart_data['climate_world_map'][0].data.forEach(element => {
    const countryCode = map_convertCountryAlphas3To2(element.iso)
    values[countryCode] = {
      co2: (element.co2 / 1000000000).toFixed(2),
      overshoot: (element.overshoot / 1000000000).toFixed(2),
      global_overshoot: element.global_overshoot,
      quantile: element.quantile
    }
    if (element.overshoot == 0) {
      values[countryCode]["color"] = "#abdda4";
    } else if (element.quantile == 5) {
      values[countryCode]["color"] = "#950000";
    } else if (element.quantile == 4) {
      values[countryCode]["color"] = "#d30000";
    } else if (element.quantile == 3) {
      values[countryCode]["color"] = "#ea503b";
    } else if (element.quantile == 2) {
      values[countryCode]["color"] = "#f68648";
    } else if (element.quantile == 1) {
      values[countryCode]["color"] = "#f6bc77";
    } else if (element.quantile == 0) {
      values[countryCode]["color"] = "#f5d993";
    }
  });
  setTimeout(function () {
    new svgMap({
      targetElementID: canvasID.replace("#", ""),
      colorMin: "#f5d993",
      data: {
        thousandSeparator: ".",
        data: {
          co2: {
            name: 'CO2',
            format: '{0} B tonnes',
            thousandSeparator: ',',
          },
          overshoot: {
            name: 'Overshoot',
            format: '{0} B tonnes'
          },
          global_overshoot: {
            name: 'Share of global overshoot',
            format: '{0} %'
          },
          quantile: {
            name: 'quantile',
            format: ''
          }
        },
        applyData: 'quantile',
        values: values
      },
      initialZoom: 1.13,
      initialPan: { x: 520, y: 200 },
      showZoomReset: true,
      showContinentSelector: true,
    });
    map_createLegend([
      {
        color: "#950000",
        name: "250B+"
      },
      {
        color: "#d30000",
        name: "50B - 250B"
      },
      {
        color: "#ea503b",
        name: "25B - 50B"
      },
      {
        color: "#f68648",
        name: "5B - 25B"
      },
      {
        color: "#f6bc77",
        name: "1B - 5B"
      },
      {
        color: "#f5d993",
        name: "0 - 1B"
      },
      {
        color: "#abdda4",
        name: "No Overshoot"
      },
      {
        color: "#e6e6e6",
        name: "No data"
      }
    ].reverse(), canvasID);

  }, 400)

}