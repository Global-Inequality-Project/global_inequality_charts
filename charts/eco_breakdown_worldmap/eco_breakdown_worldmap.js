
// Wait for window to be ready
jQuery(function () {
  prepare_eco_breakdown_worldmap();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_eco_breakdown_worldmap() {
  loadCsv(`${window.charts_path}/eco_breakdown_worldmap/eco_breakdown_worldmap.csv`,
    function (error, treemap_data) {
      if (error === null) {
        window.chart_data['eco_breakdown_worldmap'] = [{
          name: "mf_cmltv",
          data: {}
        }]
        window.chart_data['eco_breakdown_worldmap'][0].data = fromCSV(treemap_data, ['string', 'number', 'number']);
        createChartInterface({
          chartID: "eco_breakdown_worldmap",
          renderFunc: render_eco_breakdown_worldmap,
        })
      } else {
        console.error(error)
      }
    });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_eco_breakdown_worldmap(canvasID, modal) {
  let values = {};
  window.chart_data['eco_breakdown_worldmap'][0].data.forEach(element => {
    const countryCode = map_convertCountryAlphas3To2(element.iso)
    values[countryCode] = {
      mf_cmltv: (element.mf_cmltv / 1000000000).toFixed(2),
      overshoot: (element.overshoot / 1000000000).toFixed(2),
      pct_overshoot: element.pct_overshoot,
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
          mf_cmltv: {
            name: 'Cumulative material footprint',
            format: '{0} B tonnes',
            thousandSeparator: ',',
          },
          overshoot: {
            name: 'Overshoot',
            format: '{0} B tonnes'
          },
          pct_overshoot: {
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

    });
    map_createLegend([
      {
        color: "#950000",
        name: "20B+"
      },
      {
        color: "#d30000",
        name: "10B - 20B"
      },
      {
        color: "#ea503b",
        name: "5B - 10B"
      },
      {
        color: "#f68648",
        name: "2B - 5B"
      },
      {
        color: "#f6bc77",
        name: "1B - 2B"
      },
      {
        color: "#f5d993",
        name: "0B - 1B"
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