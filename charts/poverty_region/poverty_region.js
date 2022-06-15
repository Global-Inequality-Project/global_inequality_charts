//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["poverty_region"] = {
    regions: {
      EAP: "East Asia and Pacific",
      SAS: "South Asia",
      SSF: "Sub-Saharan Africa",
      LCN: "Latin America and the Caribbean",
      MEA: "Middle East and North Africa",
    },
    years: { start: 1981, end: 2018 },
    poverty_lines: ["7_5", "10", "15"],
    customChoice: 0,
  };

  importFilesAndShow_poverty_region();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_region() {
  const baseUrl = `${
    window.charts_path
  }/${"poverty_region"}/${"poverty_region"}`;
  jQuery.get(baseUrl + ".csv", function(povcal) {
    window.chart_data["poverty_region"].data = fromCSV(
      povcal,
      ["string", "string", "number", "number"],
      false,
      ",",
      true
    );

    // Create custom tools for the sidebar (optional)
    let customTools = `
        <button onclick="toggleChartArea(this, 'choice', 'poverty_region')" value="OFF" class="chart-btn">
          <i class="fa-solid fa-sliders"></i>Scale to
        </button>

        <div class="chart-btn-area" id="chart-poverty_region-choice-btns">

          <button class="chart-btn" id="poverty_region-choice-1" onclick="setChoice_poverty_region(0)">
            <i class="fa-solid fa-square-check"></i>7.5$/day
          </button>

          <button class="chart-btn" id="poverty_region-choice-2" onclick="setChoice_poverty_region(1)">
            <i class="fa-solid fa-square"></i></i>10$/day
          </button>

          <button class="chart-btn" id="poverty_region-choice-3" onclick="setChoice_poverty_region(2)">
            <i class="fa-solid fa-square"></i></i>15$/day
          </button>

        </div>
        `;

    // Render Chart Interface
    let chart = createChartInterface({
      chartID: "poverty_region",
      renderFunc: render_poverty_region,
      customTools: customTools,
    });
  });
}

//--------------------------------------- showChart
function render_poverty_region(canvasID) {
  let chartID = "poverty_region";
  let options = {
    chart: {
      type: "area",
      stacked: true,
      height: "100%",
      fontFamily: "Open Sans",
      toolbar: {
        show: false,
        tools: { zoom: false },
      },
      selection: { enable: false },
    },
    theme: {
      palette: "palette1",
    },
    fill: { type: "solid", opacity: 0.7 },
    responsive: [
      {
        breakpoint: 960,
        options: {
          xaxis: { tickAmount: 10 },
        },
      },
      {
        breakpoint: 401,
        options: {
          //chart: {height: 300},
        },
      },
    ],
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      min: 0,
      max: 6e9,
      tickAmount: 13,
      forceNiceScale: true,
      labels: {
        formatter: (val, index) => formatBillionsLabel(val, index, 1, true),
      },
    },
    tooltip: {
      y: {
        formatter: (val, index) => "$" + formatTooltipVal(val, index),
      },
      followCursor: true,
      shared: false,
    },
    legend: {
      show: true,
    },
  };
  let axes = [];
  let customChoice = window.chart_data["poverty_region"].customChoice;
  axes = createAxes(chartID, window.chart_data["poverty_region"].poverty_lines[customChoice]);
  options["chart"].id = "Number of people in poverty world".replace(/ /g, "");
  options["xaxis"] = {
    categories: axes[1],
    tickAmount: 30,
    tooltip: { enabled: false },
  };
  options.series = axes[0];
  return createApexChart(canvasID, options);
}

function createAxes(chartID, povnum) {
  let data_hash = {};
  window.chart_data[chartID].poverty_lines.forEach((pLine, i) => {
    let data_filtered = window.chart_data[chartID].data.filter(
      (row) => row.povline == pLine.replace("_", ".")
    );
    let data_poor = groupSum(data_filtered, ["year", "region"], "povline");
    data_hash[pLine] = data_poor;
  });

  let years = [];
  for (
    let year = window.chart_data[chartID].years.start,
      end = window.chart_data[chartID].years.end;
    year <= end;
    ++year
  )
    years.push(year);

  let series = [];

  Object.keys(window.chart_data[chartID].regions).forEach((region, i) => {
    series[i] = {
      name: window.chart_data[chartID].regions[region],
      data: [],
    };

    years.forEach((year) => {
      let data_row = data_hash[povnum][year + "_" + region];
      if (data_row) series[i].data.push(data_row["poor_pop"] * 1e6);
      else series[i].data.push(null);
    });
  });
  return [series, years];
}

// Function to change poverty line
function setChoice_poverty_region(choice) {
  let chart = window.charts["poverty_region"];
  let data = window.chart_data["poverty_region"];
  window.chart_data["poverty_region"].customChoice = choice;

  let btn1 = document.getElementById(`poverty_region-choice-1`);
  let btn2 = document.getElementById(`poverty_region-choice-2`);
  let btn3 = document.getElementById(`poverty_region-choice-3`);

  if (choice == 0) {
    btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>7.5$/day`;
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>10$/day`;
    btn3.innerHTML = `<i class="fa-solid fa-square"></i>15$/day`;
    chart.updateSeries(generateSeries_poverty_region(data));
  } else if (choice == 1) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>7.5$/day`;
    btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>10$/day`;
    btn3.innerHTML = `<i class="fa-solid fa-square"></i>15$/day`;
    chart.updateSeries(generateSeries_poverty_region(data));
  } else if (choice == 2) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>7.5$/day`;
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>10$/day`;
    btn3.innerHTML = `<i class="fa-solid fa-square-check"></i>15$/day`;
    chart.updateSeries(generateSeries_poverty_region(data));
  }
}

// Generate data series based on poverty line
function generateSeries_poverty_region(data) {
  const chartID = "poverty_region";
  let axes = [];

  if (data.customChoice == 0) {
    axes = createAxes(chartID, "7_5");
    return axes[0];
  } else if (data.customChoice == 1) {
    axes = createAxes(chartID, "10");
    return axes[0];
  } else if (data.customChoice == 2) {
    axes = createAxes(chartID, "15");
    return axes[0];
  }
}
