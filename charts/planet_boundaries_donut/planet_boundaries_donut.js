// Wait for window to be ready
jQuery(function () {
  prepare_planet_boundaries_donut();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_planet_boundaries_donut() {
  window.chart_data.planet_boundaries_donut = {
    modal: false,
    canvasID: "",
    country: null,
    rawData: { NRT: null, STH: null, STH_wo_CHN: null, CHN: null },
    data: null,
    yearData: null,
    maxSequence: 23,
    sequence: -1,
    enabledCharts: {
      north: true,
      south: true,
      south_wo_chn: false,
      china: false
    },
    doughnutSVG: null,
    biophysicalSVG: null,
    socialSVG: null,

    socialIndexes: [
      "LSval", "LEval", "NUval", "SAval", "INval", "ENval", "EDval", "SSval", "DQval", "EQval", "EMval"
    ],
    socialLabelsShort: [
      'LS', 'LE', 'NU', 'SA', 'IN', 'EN', 'ED', 'SS', 'DQ', 'EQ', 'EM'
    ],
    socialLabels: [
      'Life Satisfaction', 'Life Expectancy', 'Nutrition', 'Sanitation', 'Income Poverty', 'Access to Energy',
      'Education', 'Social Support', 'Democratic Quality', 'Equality', 'Employment'
    ],
    socialUnits: {
      'LSval': '[0-10] Cantril scale',
      'LEval': 'years of life',
      'NUval': 'kilocalories per capita per day',
      'SAval': '% with access to improved sanitation',
      'INval': '% who earn above $5.50 per day (2011 PPP)',
      'ENval': '% with access to electricity',
      'EDval': '% gross enrolment in secondary school',
      'SSval': '% with friends of family they can depend upon',
      'DQval': '[0-10 scale]',
      'EQval': '[0-100] scale (Gini index of 0.3)',
      'EMval': '% of labour force employed'
    },
    socialEnabled: {
      "LSval": false,
      "LEval": false,
      "NUval": false,
      "SAval": false,
      "INval": false,
      "ENval": false,
      "EDval": false,
      "SSval": false,
      "DQval": false,
      "EQval": false,
      "EMval": false
    },
    socialRadius: 63,
    socialScale: null,

    bioIndexes: [
      "CO2footCum", "PfootPerCap", "NfootPerCap", "H2OfootPerCap", "ehanppPerCap", "EFfootPerCap",
      "MFfootPerCap"
    ],
    bioLabels: [
      'CO2 Emissions', 'Phosphorus', 'Nitrogen', 'Blue Water', 'Land-Use Change', 'Ecological Footprint',
      'Material Footprint'
    ],
    bioUnits: {
      'CO2footCum': 'cumulative megatonnes CO2',
      'PfootPerCap': 'kilograms P per capita',
      'NfootPerCap': 'kilograms N per capita',
      'ehanppPerCap': 'tonnes C per capita',
      'EFfootPerCap': 'global hectares per capita',
      'MFfootPerCap': 'tonnes per capita'
    },
    bioEnabled: {
      "CO2footCum": false,
      "PfootPerCap": false,
      "NfootPerCap": false,
      "H2OfootPerCap": false,
      "ehanppPerCap": false,
      "EFfootPerCap": false,
      "MFfootPerCap": false
    },
    bioRadius: 132,
    ceilingScale: null,

    bioColors: {
      CO2footCum: "red",
      PfootPerCap: "blue",
      NfootPerCap: "cyan",
      H2OfootPerCap: "orange",
      ehanppPerCap: "deepskyblue",
      EFfootPerCap: "pink",
      MFfootPerCap: "purple"
    },

    socialColors: {
      LSval: "red",
      LEval: "blue",
      NUval: "steelblue",
      SAval: "orange",
      INval: "deepskyblue",
      ENval: "burlywood",
      EDval: "purple",
      SSval: "blueviolet",
      DQval: "violet",
      EQval: "brown",
      EMval: "cyan"
    },

    lineUnityLabels: {
      'biophysical': 'Biophysical Boundary',
      'social': 'Social Threshold'
    },

    setData: function (data) {
      this.data = data;
      this.getDataAndScales();
      this.setCountry();
    },

    setCountry: function () {
      this.country = this.data.iso3c;
      this.socialEnabled = this.calculateEnabledIndicators(this.data.social.series, this.socialIndexes);
      this.bioEnabled = this.calculateEnabledIndicators(this.data.biophysical.series, this.bioIndexes);
      this.plotDoughnut();
    },

    calculateEnabledIndicators: function (series, indexes) {
      let result = {};

      for (const i in indexes) {
        const key = indexes[i];
        for (const j in series[key]) {
          result[key] |= series[key][j] !== 1.00001;
        }
      }

      return result;
    },

    setSvg: function (svg) {
      this.doughnutSVG = svg;
    },

    setYear: function (year) {
      this.sequence = year - 1992;
      this.plotDoughnut();
    },

    getDataAndScales: function () {
      this.yearData = {
        biophysical: [],
        social: []
      };

      for (let i in this.bioIndexes) {
        let index = this.bioIndexes[i];
        this.yearData.biophysical.push(this.data.biophysical.series[index][this.sequence]);
      }

      for (let i in this.socialIndexes) {
        let index = this.socialIndexes[i];
        this.yearData.social.push(this.data.social.series[index][this.sequence]);
      }

      this.socialScale = d3.scaleLinear();
      this.socialScale.range([0, this.socialRadius]);
      this.socialScale.domain([0, 1]);

      this.ceilingScale = d3.scaleLinear();
      this.ceilingScale.range([this.socialRadius + 16, this.bioRadius]);
      this.ceilingScale.domain([0, 1]);
    },

    plotDoughnut: function () {
      let svg = this.doughnutSVG;
      svg.selectAll("*").remove();

      let parent = svg.node().parentElement;//.parentElement;
      let bounds = parent.getBoundingClientRect();

      const csrad = this.bioRadius * 1.75;
      const cbrad = this.ceilingScale(3.2);

      let topHeight = d3.max([
        csrad,
        this.ceilingScale(this.data.biophysical.range.MFfootPerCap[1]) + 36,
        this.ceilingScale(this.data.biophysical.range.CO2footCum[1]) + 36
      ]);

      let bottomHeight = d3.max([
        cbrad,
        this.ceilingScale(this.data.biophysical.range.H2OfootPerCap[1]) + 36,
        (this.ceilingScale(this.data.biophysical.range.ehanppPerCap[1]) + 36)
      ]);

      let leftWidth = d3.max([
        csrad,
        this.ceilingScale(this.data.biophysical.range.EFfootPerCap[1]) + 36,
        this.ceilingScale(this.data.biophysical.range.MFfootPerCap[1]) + 36
      ]);

      let rightWidth = d3.max([
        csrad,
        this.ceilingScale(this.data.biophysical.range.NfootPerCap[1]) + 36
      ]);

      const width = bounds.width;
      const boxWidth = Math.max(leftWidth, rightWidth, width / 2);
      const height = (topHeight + bottomHeight) * bounds.width / (boxWidth * 2);

      svg
        .attr("width", bounds.width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", [-boxWidth, -topHeight, boxWidth * 2, topHeight + bottomHeight])
        .append("g")
        .append("path")
        .attr("d", function () {
          let path = d3.path();
          path.moveTo(-30, 0);
          path.lineTo(30, 0);
          path.moveTo(0, -30);
          path.lineTo(0, 30);

          return path;
        })
        .style('stroke', 'red')
        .style('fill', 'none')
        .style('stroke-width', 2)
        ;

      this.drawSocialDoughnut(svg);
      this.drawBiophysicalDoughnut(svg);
      this.drawBoundaries(svg);
    },

    drawSocialDoughnut: function (svg) {
      let Self = this;

      let pie = d3.pie()
        .startAngle(-Math.PI * 6 / this.yearData.social.length)
        .sort(null)
        .value(Math.PI * 2 / this.yearData.social.length)
        ;
      let arcs = pie(this.yearData.social);
      let arc_blue = d3.arc()
        .innerRadius(
          function () {
            return 0;
          }
        )
        .outerRadius(
          function () {
            return Self.socialRadius;
          }
        )
        ;
      let arc_red = d3.arc()
        .innerRadius(
          function (d) {
            return Self.socialScale(d.data > 1 ? 1 : d.data);
          }
        )
        .outerRadius(
          function () {
            return Self.socialRadius;
          }
        )
        ;

      svg
        .append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", function (d) {
          if (d.data === 1.00001) {
            return "#E5E5E5";
          } else {
            return "#9ecae1";
          }
        })
        .attr("d", arc_blue)
        ;

      svg
        .append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", function (d) {
          if (d.data === 1.00001) {
            return "#E5E5E5";
          } else {
            return "#d73027";
          }
        })
        .attr("d", arc_red)
        ;

      const radius = Self.socialRadius * 0.78;
      let arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

      svg
        .append("g")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("display", "none")
        .attr("fill", "#333")
        .attr("stroke", "#000")
        .attr("d", arcLabel)
        .attr("id", (d, i) => `arc_soc_${i}`)
        ;

      svg
        .append("g")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("dx", function (d, i) {
          return i < 6 ? -14 : 14;
        })
        .attr("dy", function (d, i) {
          return i < 6 ? 0 : 10;
        })
        .attr("font-size", "14px")
        .attr("fill", function (d, i) {
          let r = Self.socialScale(d.data);
          return r < 48 ? "#fff" : "#000";
        })
        .append("textPath")
        .style("text-anchor", "middle")
        .attr("startOffset", "50%")
        .attr("xlink:href", (d, i) => `#arc_soc_${i}`)
        .text((d, i) => Self.socialLabelsShort[i])
        ;

      svg
        .append("g")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("dx", function (d, i) {
          return i < 6 ? -14 : 14;
        })
        .attr("dy", function (d, i) {
          return i < 6 ? 20 : -10;
        })
        .attr("font-size", "14px")
        .attr("fill", "#000")
        .append("textPath")
        .style("text-anchor", "middle")
        .attr("startOffset", "50%")
        .attr("xlink:href", (d, i) => `#arc_soc_${i}`)
        .text(d => (d.data === 1.00001 ? ' ?' : ''))
        ;
    },

    drawBiophysicalDoughnut: function (svg) {
      let Self = this;

      let pie = d3.pie()
        .startAngle(-Math.PI * 2 / (this.bioLabels.length * 2))
        .endAngle((-Math.PI * 2 / (this.bioLabels.length * 2)) + 2 * Math.PI)
        .sort(null)
        .value(Math.PI * 2 / this.yearData.biophysical.length)
        ;
      let arcs = pie(this.yearData.biophysical);
      let arc_green = d3.arc()
        .innerRadius(
          function (d) {
            return Self.socialRadius + 16; // Self.socialScale(d.data);
          }
        )
        .outerRadius(
          function (d) {
            return Self.ceilingScale(d.data > 1 ? 1 : d.data);
          }
        )
        ;

      let arc_red = d3.arc()
        .innerRadius(
          function (d) {
            return Self.bioRadius + 16;
          }
        )
        .outerRadius(
          function (d) {
            if (d.data === 1.00001) {
              return Self.ceilingScale(3.2);
            } else {
              return Self.ceilingScale(d.data > 1 ? d.data : 1) + 16;
            }
          }
        )
        ;

      svg
        .append("g")
        .attr("stroke", "white")
        .attr("stroke-width", "1.2")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", function (d) {
          if (d.data === 1.00001) {
            return "#E5E5E5";
          } else {
            return "#a1d99b";
          }
        })
        .attr("d", arc_green)
        ;

      svg
        .append("g")
        .attr("stroke", "white")
        .attr("stroke-width", "1.2")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", function (d) {
          return d.data === 1.00001 ? '#E5E5E5' : "#d73027";
        })
        .attr("d", arc_red)
        ;

      const radius = Self.bioRadius * 1.5;
      let arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

      svg
        .append("g")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("display", "none")
        .attr("fill", "#333")
        .attr("stroke", "#000")
        .attr("d", arcLabel)
        .attr("id", (d, i) => `arc_bio_${i}`)
        ;

      svg
        .append("g")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("dx", function (d, i) {
          return i < 2 || i > 4 ? -90 : 90;
        })
        .attr("dy", function (d, i) {
          return i < 2 || i > 4 ? 100 : -90;
        })
        .attr("font-size", "14px")
        .attr("fill", "#000")
        .append("textPath")
        .style("text-anchor", "middle")
        .attr("startOffset", "50%")
        .attr("xlink:href", (d, i) => `#arc_bio_${i}`)
        .text(d => (d.data === 1.00001 ? ' ?' : ''))
        ;

      svg
        .append("g")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("dy", function (d, i) {
          return i < 2 || i > 4 ? 7 : 0;
        })
        .attr("dx", function (d, i) {
          return i < 2 || i > 4 ? -90 : 90;
        })
        .attr("font-size", "14px")
        .attr("fill", function (d, i) {
          let r = Self.ceilingScale(d.data);
          return r > 187 ? "#fff" : "#000";
        })
        .append("textPath")
        .style("text-anchor", "middle")
        .attr("startOffset", "50%")
        .attr("xlink:href", (d, i) => `#arc_bio_${i}`)
        .text((d, i) => Self.bioLabels[i])
        ;
    },

    drawBoundaries: function (svg) {
      const Self = this;

      let pie_soc = d3.pie()
        .startAngle(-98 * Math.PI / 180)
        .endAngle(-98 * Math.PI / 180 + 2 * Math.PI)
        .value(
          function (d) {
            return d;
          })
        .sort(null);

      const arcsoc = d3.arc().innerRadius(Self.socialRadius).outerRadius(Self.socialRadius + 16);

      svg
        .selectAll("#socialboundaryarc")
        .data(function (d) {
          return pie_soc([Self.socialLabelsShort.length]);
        })
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("id", "socialboundaryarc")
        .attr("d", arcsoc)// was 1.2 in natSus
        .attr('fill', '#31a354')  //#3182bd in NatSus
        .style("stroke-width", 1.5)
        .style("stroke", "#252525")
        ;

      svg
        .selectAll("#socarctext")
        .data(["Social Foundation"])
        .enter()
        .append("text")
        .attr("dx", 83)
        .attr("dy", 12)
        .attr("font-size", '14px')
        .attr("fill", "#fff")
        .append("textPath")
        .attr("xlink:href", "#socialboundaryarc")
        .text(function (d) {
          return d;
        })
        ;

      let pie_bio = d3.pie()
        .startAngle(-98 * Math.PI / 180)
        .endAngle(-98 * Math.PI / 180 + 2 * Math.PI)
        .value(
          function (d) {
            return d;
          })
        .sort(null);

      const arcbio = d3.arc().innerRadius(Self.bioRadius).outerRadius(Self.bioRadius + 16);

      svg
        .selectAll("#bioboundaryarc")
        .data(function (d) {
          return pie_bio([Self.bioLabels.length]);
        })
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("id", "bioboundaryarc")
        .attr("d", arcbio)
        .attr("fill", "#31a354")
        .style("stroke-width", 1.5)
        .style("stroke", "#252525")
        ;

      svg
        .selectAll("#bioarctext")
        .data(["Ecological Ceiling"])
        .enter()
        .append("text")
        .attr("dx", 200)
        .attr("dy", 12)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .append("textPath")
        .attr("xlink:href", "#bioboundaryarc")
        .text(function (d) {
          return d;
        })
        ;
    },
    showChart(year_seq) {
      let chart = window.chart_data.planet_boundaries_donut;
      let north_id = "doughnut_north";
      let south_id = "doughnut_south";
      let south_wo_chn_id = "doughnut_south_wo_chn";
      let chn_id = "doughnut_chn";
      let slider_id = "doughnut_slider";
      let year_id = "doughnut_year";

      let charts_wrapper_id = this.canvasID.replace("#", '') + "-charts"
      if (window.chart_data['planet_boundaries_donut'].modal) {
        north_id += "-modal"
        south_id += "-modal"
        south_wo_chn_id += "-modal"
        chn_id += "-modal"
        charts_wrapper_id += "-modal"
        year_id += "-modal"
        slider_id += "-modal"
      }


      let charts = document.getElementById(charts_wrapper_id);
      if (charts == null) {
        window.chart_data['planet_boundaries_donut'].modal = false;
        window.chart_data['planet_boundaries_donut'].canvasID = window.chart_data['planet_boundaries_donut'].canvasID.replace("-modal", "").replace("-content", "-canvas")
        window.chart_data['planet_boundaries_donut'].showChart(year_seq);
      } else {
        charts.innerHTML = "";

        if (window.chart_data['planet_boundaries_donut'].enabledCharts.north) {
          let north_wrapper = document.createElement("div");
          north_wrapper.setAttribute("class", "vertical-doughnut");
          north_wrapper.setAttribute("id", "vertical-doughnut-north");
          let north_title = document.createElement("div");
          north_title.setAttribute("class", "region_label");
          north_title.innerHTML = "Global North";
          let north = document.createElement("div");
          north.setAttribute("id", north_id);
          north.setAttribute("class", "donut");
          north_wrapper.appendChild(north_title);
          north_wrapper.appendChild(north);
          charts.appendChild(north_wrapper);
          window.chart_data['planet_boundaries_donut'].svg_north = d3.select("#" + north_id).append("svg");
        }
        if (window.chart_data['planet_boundaries_donut'].enabledCharts.south) {
          let south_wrapper = document.createElement("div");
          south_wrapper.setAttribute("class", "vertical-doughnut");
          south_wrapper.setAttribute("id", "vertical-doughnut-south");
          let south_title = document.createElement("div");
          south_title.setAttribute("class", "region_label");
          south_title.innerHTML = "Global South";
          let south = document.createElement("div");
          south.setAttribute("id", south_id);
          south.setAttribute("class", "donut");
          south_wrapper.appendChild(south_title);
          south_wrapper.appendChild(south);
          charts.appendChild(south_wrapper);
          window.chart_data['planet_boundaries_donut'].svg_south = d3.select("#" + south_id).append("svg");
        }
        if (window.chart_data['planet_boundaries_donut'].enabledCharts.south_wo_chn) {
          let south_wo_chn_wrapper = document.createElement("div");
          south_wo_chn_wrapper.setAttribute("id", "vertical-doughnut-south-wo-chn");
          let south_wo_chn_title = document.createElement("div");
          south_wo_chn_title.setAttribute("class", "region_label");
          south_wo_chn_title.innerHTML = "Global South w/o China";
          let south_wo_chn = document.createElement("div");
          south_wo_chn.setAttribute("id", south_wo_chn_id);
          south_wo_chn.setAttribute("class", "donut");
          south_wo_chn_wrapper.appendChild(south_wo_chn_title);
          south_wo_chn_wrapper.appendChild(south_wo_chn);
          charts.appendChild(south_wo_chn_wrapper);
          window.chart_data['planet_boundaries_donut'].svg_south_wo_chn = d3.select("#" + south_wo_chn_id).append("svg");

        }
        if (window.chart_data['planet_boundaries_donut'].enabledCharts.china) {
          let chn_wrapper = document.createElement("div");
          chn_wrapper.setAttribute("class", "vertical-doughnut");
          chn_wrapper.setAttribute("id", "vertical-doughnut-china");
          let chn_title = document.createElement("div");
          chn_title.setAttribute("class", "region_label");
          chn_title.innerHTML = "China";
          let chn = document.createElement("div");
          chn.setAttribute("id", chn_id);
          chn.setAttribute("class", "donut");
          chn_wrapper.appendChild(chn_title);
          chn_wrapper.appendChild(chn);
          charts.appendChild(chn_wrapper);
          window.chart_data['planet_boundaries_donut'].svg_chn = d3.select("#" + chn_id).append("svg");
        }

        chart.sequence = year_seq;
        if (window.chart_data['planet_boundaries_donut'].enabledCharts.north) {
          chart.setSvg(window.chart_data.planet_boundaries_donut.svg_north);
          chart.setData(window.chart_data.planet_boundaries_donut.rawData.NRT);
        }
        if (window.chart_data['planet_boundaries_donut'].enabledCharts.south) {
          chart.setSvg(window.chart_data.planet_boundaries_donut.svg_south);
          chart.setData(window.chart_data.planet_boundaries_donut.rawData.STH);
        }
        if (window.chart_data['planet_boundaries_donut'].enabledCharts.south_wo_chn) {
          chart.setSvg(window.chart_data.planet_boundaries_donut.svg_south_wo_chn);
          chart.setData(window.chart_data.planet_boundaries_donut.rawData.STH_wo_CHN);
        }
        if (window.chart_data['planet_boundaries_donut'].enabledCharts.china) {
          chart.setSvg(window.chart_data.planet_boundaries_donut.svg_chn);
          chart.setData(window.chart_data.planet_boundaries_donut.rawData.CHN);
        }
        jQuery("#" + slider_id).on("input", function () {
          let year_seq = +this.value;
          let year = year_seq + 1992;
          jQuery("#" + year_id).text(year);
          if (window.chart_data.planet_boundaries_donut.sequence !== year_seq)
            window.chart_data['planet_boundaries_donut'].showChart(year_seq);
        });
      }

    },


  }

  loadJson(`${window.charts_path}/planet_boundaries_donut/NRT.json`, function (error, NRT) {
    if (error === null) {
      window.chart_data.planet_boundaries_donut.rawData.NRT = NRT;
      loadJson(`${window.charts_path}/planet_boundaries_donut/STH.json`, function (error, STH) {
        if (error === null) {
          window.chart_data.planet_boundaries_donut.rawData.STH = STH;
          loadJson(`${window.charts_path}/planet_boundaries_donut/STH_wo_CHN.json`, function (error, STH_wo_CHN) {
            if (error === null) {
              window.chart_data.planet_boundaries_donut.rawData.STH_wo_CHN = STH_wo_CHN;
              loadJson(`${window.charts_path}/planet_boundaries_donut/CHN.json`, function (error, CHN) {
                if (error === null) {
                  window.chart_data.planet_boundaries_donut.rawData.CHN = CHN;

                  // Create custom tools for the sidebar (optional)
                  let customTools = "";
                      // `
                    //   <button class="chart-btn" id="planet_boundaries_donut-choice-1" onclick="setChoice_planet_boundaries_donut(1)">
                    //     <i id="planet_boundaries_donut-choice-1-icon" class="fa-solid fa-square-check"></i>Global North
                    //   </button> 

                    //   <button class="chart-btn" id="planet_boundaries_donut-choice-2" onclick="setChoice_planet_boundaries_donut(2)">
                    //     <i id="planet_boundaries_donut-choice-2-icon" class="fa-solid fa-square-check"></i></i>Global South
                    //   </button>

                    //   <button class="chart-btn" id="planet_boundaries_donut-choice-3" onclick="setChoice_planet_boundaries_donut(3)">
                    //     <i id="planet_boundaries_donut-choice-3-icon" class="fa-solid fa-square"></i></i>Global South w/o China
                    //   </button>

                    //   <button class="chart-btn" id="planet_boundaries_donut-choice-4" onclick="setChoice_planet_boundaries_donut(4)">
                    //     <i id="planet_boundaries_donut-choice-4-icon" class="fa-solid fa-square"></i></i>China
                    //   </button>
                    // `
                  // Render Chart Interface
                  createChartInterface({
                    chartID: "planet_boundaries_donut",
                    renderFunc: render_planet_boundaries_donut,
                    customTools: customTools,
                  })
                } else {
                  console.log(error)
                }
              });
            } else {
              console.log(error)
            }
          });
        } else {
          console.log(error)
        }
      });
    } else {
      console.log(error)
    }
  });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_planet_boundaries_donut(canvasID, modal) {
  window.chart_data['planet_boundaries_donut'].modal = modal;
  window.chart_data['planet_boundaries_donut'].canvasID = canvasID;

  let canvas = document.getElementById(canvasID.replace("#", ''));
  let charts_wrapper_id = canvasID.replace("#", '') + "-charts"
  let slider_id = "doughnut_slider";
  let year_id = "doughnut_year";
  if (modal) {
    charts_wrapper_id += "-modal"
    year_id += "-modal"
    slider_id += "-modal"
  }
  canvas.innerHTML = `
    <div id="${charts_wrapper_id}"></div>
    <div class="vertical-control">
        <div><input id="${slider_id}" type="range" min="0" max="23" value="23"></div>
        <div id="${year_id}">2015</div>
    </div>
    `;
  window.chart_data.planet_boundaries_donut.showChart(23);

}


// Function to change custom choice
function setChoice_planet_boundaries_donut(choice) {

  switch (choice) {
    case 1:
      window.chart_data['planet_boundaries_donut'].enabledCharts.north = !window.chart_data['planet_boundaries_donut'].enabledCharts.north;
      var btn = document.getElementById(`planet_boundaries_donut-choice-1-icon`);
      btn.classList.toggle("fa-square");
      btn.classList.toggle("fa-square-check");
      break;
    case 2:
      window.chart_data['planet_boundaries_donut'].enabledCharts.south = !window.chart_data['planet_boundaries_donut'].enabledCharts.south;
      var btn = document.getElementById(`planet_boundaries_donut-choice-2-icon`);
      btn.classList.toggle("fa-square");
      btn.classList.toggle("fa-square-check");
      break;
    case 3:
      window.chart_data['planet_boundaries_donut'].enabledCharts.south_wo_chn = !window.chart_data['planet_boundaries_donut'].enabledCharts.south_wo_chn;
      var btn = document.getElementById(`planet_boundaries_donut-choice-3-icon`);
      btn.classList.toggle("fa-square");
      btn.classList.toggle("fa-square-check");
      break;
    case 4:
      window.chart_data['planet_boundaries_donut'].enabledCharts.china = !window.chart_data['planet_boundaries_donut'].enabledCharts.china;
      var btn = document.getElementById(`planet_boundaries_donut-choice-4-icon`);
      btn.classList.toggle("fa-square");
      btn.classList.toggle("fa-square-check");
      break;

    default:
      break;
  }
  window.chart_data.planet_boundaries_donut.showChart(23);


};


// Generate data series based on custom choice
function generateSeries_planet_boundaries_donut() {

  let data = window.chart_data['planet_boundaries_donut']
  if (data.my_custom_choice == 1) {

    return [{
      name: 'let1',
      data: data['let1']
    }, {
      name: 'let2',
      data: data['let2']
    }, {
      name: 'let3',
      data: data['let3']
    }];

  } else if (data.my_custom_choice == 2) {

    return [{
      name: 'let1',
      data: data['let1_choice_2']
    }, {
      name: 'let2',
      data: data['let2_choice_2']
    }, {
      name: 'let3',
      data: data['let3_choice_2']
    }];

  }

}