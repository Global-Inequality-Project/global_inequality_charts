//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["poverty_average_income"] = {
    regions: {
      EAP: "East Asia and Pacific",
      SAS: "South Asia",
      SSF: "Sub-Saharan Africa",
      LCN: "Latin America and the Caribbean",
      MEA: "Middle East and North Africa",
      WOR: "World",
    },
    years: { start: 1981, end: 2017 },
  };

  importFilesAndShow_poverty_average_income();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_average_income() {
  var chartID = "poverty_average_income";

  jQuery.get(`${window.charts_path}/${chartID}/${chartID}.csv`, function(
    poverty_average_income
  ) {
    window.chart_data[chartID].data = fromCSV(poverty_average_income, [
      "string",
      "number",
      "number",
      "number",
    ]);

    // Create custom tools for the sidebar (optional)
    //data.my_custom_choice = 1;
    var customTools = `
         <button onclick="toggleChartArea(this, 'choice', 'poverty_average_income')" value="OFF" class="chart-btn">
           <i class="fa-solid fa-sliders"></i>Scale to
         </button>

         <div class="chart-btn-area" id="chart-poverty_average_income-choice-btns">

           <button class="chart-btn" id="poverty_average_income-choice-1" onclick="setChoice_poverty_average_income(1)">
             <i class="fa-solid fa-square-check"></i>Global average income
           </button>

           <button class="chart-btn" id="poverty_average_income-choice-2" onclick="setChoice_poverty_average_income(2)">
             <i class="fa-solid fa-square"></i></i>US poverty line
           </button>

         </div>
         `;

    // Render Chart Interface
    createChartInterface({
      chartID: "poverty_average_income",
      renderFunc: render_poverty_average_income,
      customTools: customTools,
    });
  });
}

//--------------------------------------- showChart
function render_poverty_average_income(canvasID) {
  var options = {
    chart: {
      type: "line",
      height: "100%",
      fontFamily: "Open Sans",
      toolbar: {
        show: false,
        tools: { zoom: false },
      },
    },
    theme: {
      palette: "palette7",
    },
    responsive: [
      {
        breakpoint: 961,
        options: {
          xaxis: { tickAmount: 10 },
        },
      },
      {
        breakpoint: 401,
        options: {
          yaxis: {
            tickAmount: 5,
            labels: {
              formatter: (val, index) => "$"+formatYAxisLabel(val, index, 0, true),
            },
          },
        },
      },
    ],
    colors: ["#775DD0", "#FF4560", "#FEB019", "#00E396", "#008FFB", "#A5978B"],
    grid: {
      padding: {
        top: 0,
      },
    },
    legend: {
      fontSize: "12px",
      markers: { width: 10, height: 10, radius: 10, offsetY: "-2px" },
    },
    tooltip: {
      y: { formatter: (val, index) => "$"+formatTooltipVal(val, index) },
    },
  };

  let chart_data = window.chart_data["poverty_average_income"];

  let data = chart_data.data;
  let data_hash = makeHash(data, "category");
  let years = [];
  for (
    let year = window.chart_data["poverty_average_income"].years.start,
      end = window.chart_data["poverty_average_income"].years.end;
    year <= end;
    ++year
  )
    years.push(year);
  let series = [];
  let shortcut = [];
  Object.entries(chart_data.regions).forEach(([key, value]) => {
    series.push({ name: value, data: [] });
  });

  years.forEach((year) => {
    let data_row = data_hash[year];
    if (data_row) {
      for (let index = 0; index < series.length; index++) {
        series[index].data.push(data_row[series[index].name]);
      }
    } else {
      console.log("Error");
    }
  });

  options["xaxis"] = {
    categories: years,
    tickAmount: 30,
    tooltip: { enabled: false },
  };
  options[
    "chart"
  ].id = "Number of people in poverty in the world, minus China".replace(
    / /g,
    ""
  );
  options.series = series;
  options = generateOptions_poverty_average_income(1,options)

  return createApexChart(canvasID, options);
}

//--------------------------------------- abbreviatedTooltip
function abbreviatedTooltip(dataPointIndex, w) {
  let config_series = w.config.series;
  let year = w.globals.categoryLabels[dataPointIndex];
  let color1 = w.config.colors[0];
  let marker1 =
    '<div class="custom-tooltip-marker" style="background-color:' +
    color1 +
    '"></div>';
  let val1 = formatYAxisLabel(
    config_series[0].data[dataPointIndex],
    null,
    0,
    true
  );

  let color2 = w.config.colors[1];
  let marker2 =
    '<div class="custom-tooltip-marker" style="background-color:' +
    color2 +
    '"></div>';
  let val2 = formatYAxisLabel(
    config_series[1].data[dataPointIndex],
    null,
    0,
    true
  );

  let color3 = w.config.colors[2];
  let marker3 =
    '<div class="custom-tooltip-marker" style="background-color:' +
    color3 +
    '"></div>';
  let val3 = formatYAxisLabel(
    config_series[2].data[dataPointIndex],
    null,
    0,
    true
  );

  return (
    '<div class="custom-tooltip-box">' +
    '<div class="custom-tooltip-title">' +
    year +
    "</div>" +
    '<div class="custom-tooltip-line">' +
    marker1 +
    "<div>Poverty Line 7.5$/day: <b>" +
    val1 +
    "</b></div></div>" +
    '<div class="custom-tooltip-line">' +
    marker2 +
    "<div>Poverty Line 10$/day: <b>" +
    val2 +
    "</b></div></div>" +
    '<div class="custom-tooltip-line">' +
    marker3 +
    "<div>Poverty Line 15$/day: <b>" +
    val3 +
    "</b></div></div>" +
    "</div>"
  );
}

// Function to change options
function setChoice_poverty_average_income(choice) {
  var chart = window.charts["poverty_average_income"];
  var options = window.charts["poverty_average_income"].opts;

  var btn1 = document.getElementById(`poverty_average_income-choice-1`);
  var btn2 = document.getElementById(`poverty_average_income-choice-2`);

  if (choice == 1) {
    btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>Global average income`;
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>US poverty line`;
    chart.updateOptions(generateOptions_poverty_average_income(choice, options),true);
  } else if (choice == 2) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>Global average income`;
    btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>US poverty line`;
    chart.updateOptions(generateOptions_poverty_average_income(choice, options),true);
  }
}

// Generate data series based on custom choice
function generateOptions_poverty_average_income(choice, options) {
  if (choice == 1) {
    options["yaxis"] = {
      max: 50,
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (val, index) => "$" +formatYAxisLabel(val, index, 0, true) ,
      },
    };
    options["annotations"] = {
        yaxis: [
            {
                y: 45,
                borderColor: "#9A0000",
                borderWidth: 5,
                strokeDashArray: 5,
                offsetY: 2.5,
                label: {
                  text: "$45",
                  position: "left",
                  textAnchor: "start",
                  borderColor: "#9A0000",
                  offsetY: 1,
                  offsetX: 5,
                  style: {
                    color: "#fff",
                    fontSize: "14px",
                    background: "#9A0000",
                  },
                },
              },
            {
                y: 35,
                borderColor: "#9A0000",
                borderWidth: 5,
                strokeDashArray: 5,
                offsetY: 2.5,
                label: {
                  text: "$35",
                  position: "left",
                  textAnchor: "start",
                  borderColor: "#9A0000",
                  offsetY: 1,
                  offsetX: 5,
                  style: {
                    color: "#fff",
                    fontSize: "14px",
                    background: "#9A0000",
                  },
                },
              },
          {
            y: 15,
            borderColor: "#9A0000",
            borderWidth: 5,
            strokeDashArray: 5,
            offsetY: 2.5,
            label: {
              text: "$15",
              position: "left",
              textAnchor: "start",
              borderColor: "#9A0000",
              offsetY: 1,
              offsetX: 5,
              style: {
                color: "#fff",
                fontSize: "14px",
                background: "#9A0000",
              },
            },
          },
          {
              y: 7.5,
              borderColor: "#9A0000",
              borderWidth: 5,
              strokeDashArray: 5,
              offsetY: 2.5,
              label: {
                text: "$7.5",
                position: "left",
                textAnchor: "start",
                borderColor: "#9A0000",
                offsetY: 1,
                offsetX: 5,
                style: {
                  color: "#fff",
                  fontSize: "14px",
                  background: "#9A0000",
                },
              },
            },
        ],
      };

    return options;
  } else if (choice == 2) {
    options["yaxis"] = {
      max: 20,
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (val, index) => "$" +formatYAxisLabel(val, index, 0, true) ,
      },
    };
    options["annotations"] = {
      yaxis: [
        {
          y: 15,
          borderColor: "#9A0000",
          borderWidth: 5,
          strokeDashArray: 5,
          offsetY: 2.5,
          label: {
            text: "$15",
            position: "left",
            textAnchor: "start",
            borderColor: "#9A0000",
            offsetY: 1,
            offsetX: 5,
            style: {
              color: "#fff",
              fontSize: "14px",
              background: "#9A0000",
            },
          },
        },
        {
            y: 7.5,
            borderColor: "#9A0000",
            borderWidth: 5,
            strokeDashArray: 5,
            offsetY: 2.5,
            label: {
              text: "$7.5",
              position: "left",
              textAnchor: "start",
              borderColor: "#9A0000",
              offsetY: 1,
              offsetX: 5,
              style: {
                color: "#fff",
                fontSize: "14px",
                background: "#9A0000",
              },
            },
          },
      ],
    };

    return options;
  }
}
