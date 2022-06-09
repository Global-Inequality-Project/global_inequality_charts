//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["poverty_people_world_china"] = {
    years: { start: 1981, end: 2015 },
    data: { "7_5": null, "10": null, "15": null },
    poverty_lines: ["7_5", "10", "15"],
  };

  importFilesAndShow_poverty_people_world_china();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_poverty_people_world_china() {
  const baseUrl = `${
    window.charts_path
  }/${"poverty_people_world_china"}/${"poverty_people_world_china"}`;
  jQuery.get(baseUrl + "_7.5.csv", function(povcal_7_5) {
    window.chart_data["poverty_people_world_china"].data["7_5"] = fromCSV(
      povcal_7_5,
      ["string"].concat(Array(5).fill("number"))
    );
    jQuery.get(baseUrl + "_10.csv", function(povcal_10) {
      window.chart_data["poverty_people_world_china"].data["10"] = fromCSV(
        povcal_10,
        ["string"].concat(Array(5).fill("number"))
      );
      jQuery.get(baseUrl + "_15.csv", function(povcal_15) {
        window.chart_data["poverty_people_world_china"].data["15"] = fromCSV(
          povcal_15,
          ["string"].concat(Array(5).fill("number"))
        );

        // Create custom tools for the sidebar (optional)
        let customTools = `
    <button onclick="toggleChartArea(this, 'choice', 'poverty_people_world_china')" value="OFF" class="chart-btn">
      <i class="fa-solid fa-sliders"></i>Scale to
    </button>

    <div class="chart-btn-area" id="chart-poverty_people_world_china-choice-btns">

      <button class="chart-btn" id="poverty_people_world_china-choice-1" onclick="setChoice_poverty_people_world_china(0)">
        <i class="fa-solid fa-square-check"></i>7.5$/day
      </button>

      <button class="chart-btn" id="poverty_people_world_china-choice-2" onclick="setChoice_poverty_people_world_china(1)">
        <i class="fa-solid fa-square"></i></i>10$/day
      </button>

      <button class="chart-btn" id="poverty_people_world_china-choice-3" onclick="setChoice_poverty_people_world_china(2)">
        <i class="fa-solid fa-square"></i></i>15$/day
      </button>

    </div>
    `;

        // Render Chart Interface
        var chart = createChartInterface({
          chartID: "poverty_people_world_china",
          renderFunc: render_poverty_people_world_china,
          customTools: customTools,
        });
      });
    });
  });
}

//--------------------------------------- showChart
function render_poverty_people_world_china(canvasID) {
  var chartID = "poverty_people_world_china";
  var options = {
    chart: {
      type: "line",
      height: "100%",
      fontFamily: "Open Sans",
      toolbar: {
        show: false,
        tools: { zoom: false },
      },
      selection: { enable: false },
    },
    theme: {
      palette: "palette6",
    },
    responsive: [
      {
        breakpoint: 960,
        options: {
          xaxis: { tickAmount: 10 },
        },
      },
      {
        breakpoint: 401,
      },
    ],
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: { formatter: (val, index) => formatYAxisLabel(val, index) + "%" },
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

  axes = [];
  axes = createAxes_pov(chartID, 0);

  options["chart"].id = chartID;
  options["xaxis"] = { categories: axes[1], tooltip: { enabled: false } };
  options.series = axes[0];

  return createApexChart(canvasID, options);
}

function createAxes_pov(chartID, poverty_line_choice) {
  let data = window.chart_data[chartID].data;
  let data_hash = {};
  window.chart_data[chartID].poverty_lines.forEach((pLine, i) => {
    data_hash[pLine] = makeHash(data[pLine], "year");
  });

  let years = [];
  for (
    let year = window.chart_data[chartID].years.start,
      end = window.chart_data[chartID].years.end;
    year <= end;
    ++year
  )
    years.push(year);

  let series = [
    { name: "World", data: [] },
    { name: "World minus China", data: [] },
  ];
  years.forEach((year) => {
    window.chart_data[chartID].poverty_lines.forEach((pLine, i) => {
      let data_row = data_hash[pLine][year];
      if (i === poverty_line_choice) {
        if (data_row && i === poverty_line_choice) {
          series[0].data.push(data_row["pct_poor"]);
          series[1].data.push(data_row["pct_poor_minus_china"]);
        } else {
          series[0].data.push(null);
          series[1].data.push(null);
        }
      }
    });
  });

  return [series, years];
}

// Function to change poverty line
function setChoice_poverty_people_world_china(choice) {
  const chartID = "poverty_people_world_china";
  let chart = window.charts[chartID];
  let data = window.chart_data[chartID];
  data.poverty_line = choice;

  let btn1 = document.getElementById(`poverty_people_world_china-choice-1`);
  let btn2 = document.getElementById(`poverty_people_world_china-choice-2`);
  let btn3 = document.getElementById(`poverty_people_world_china-choice-3`);

  if (choice == 0) {
    btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>7.5$/day`;
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>10$/day`;
    btn3.innerHTML = `<i class="fa-solid fa-square"></i>15$/day`;
    chart.updateSeries(createAxes_pov(chartID, choice)[0]);
  } else if (choice == 1) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>7.5$/day`;
    btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>10$/day`;
    btn3.innerHTML = `<i class="fa-solid fa-square"></i>15$/day`;
    chart.updateSeries(createAxes_pov(chartID, choice)[0]);
  } else if (choice == 2) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>7.5$/day`;
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>10$/day`;
    btn3.innerHTML = `<i class="fa-solid fa-square-check"></i>15$/day`;
    chart.updateSeries(createAxes_pov(chartID, choice)[0]);
  }
}
