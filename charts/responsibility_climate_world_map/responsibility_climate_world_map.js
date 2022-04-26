
// Wait for window to be ready
jQuery(function () {
  prepare_responsibility_climate_world_map();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_responsibility_climate_world_map() {
  loadCsv(`${window.charts_path}/responsibility_climate_world_map/co2_treemap.csv`,
    function (error, treemap_data) {
      if (error === null) {
        window.chart_data['responsibility_climate_world_map'] = [{
          name: "co2",
          data: {}
        }]
        window.chart_data['responsibility_climate_world_map'][0].data = fromCSV(treemap_data, ['string', 'number', 'number']);
        createChartInterface({
          chartID: "responsibility_climate_world_map",
          renderFunc: render_responsibility_climate_world_map,
        })
      } else {
        console.error(error)
      }
    });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_responsibility_climate_world_map(canvasID, modal) {
  let values = {};
  window.chart_data['responsibility_climate_world_map'][0].data.forEach(element => {
    const countryCode = convertCountryAlphas3To2(element.iso)
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
            // thresholdMax: 50000,
            // thresholdMin: 1000
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

    });
    jQuery(canvasID).append('<div id="levels"><table><tbody><tr><td><span class="level_rect" style="background-color: #950000;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">250B+</span></td></tr><tr><td><span class="level_rect" style="background-color: #d30000;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">50B - 250B</span></td></tr><tr><td><span class="level_rect" style="background-color: #ea503b;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">25B - 50B</span></td></tr><tr><td><span class="level_rect" style="background-color: #f68648;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">5B - 25B</span></td></tr><tr><td><span class="level_rect" style="background-color: #f6bc77;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">1B - 5B</span></td></tr><tr><td><span class="level_rect" style="background-color: #f5d993;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">0 - 1B</span></td></tr><tr><td><span class="level_rect" style="background-color: #abdda4;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">No Overshoot</span></td></tr><tr><td><span class="level_rect" style="background-color: #e6e6e6;">&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span class="level_name">No data</span></td></tr></tbody></table></div>')

  }, 400)

}

function convertCountryAlphas3To2($code = '') {
  $countries = JSON.parse('{"AFG":"AF","ALA":"AX","ALB":"AL","DZA":"DZ","ASM":"AS","AND":"AD","AGO":"AO","AIA":"AI","ATA":"AQ","ATG":"AG","ARG":"AR","ARM":"AM","ABW":"AW","AUS":"AU","AUT":"AT","AZE":"AZ","BHS":"BS","BHR":"BH","BGD":"BD","BRB":"BB","BLR":"BY","BEL":"BE","BLZ":"BZ","BEN":"BJ","BMU":"BM","BTN":"BT","BOL":"BO","BIH":"BA","BWA":"BW","BVT":"BV","BRA":"BR","VGB":"VG","IOT":"IO","BRN":"BN","BGR":"BG","BFA":"BF","BDI":"BI","KHM":"KH","CMR":"CM","CAN":"CA","CPV":"CV","CYM":"KY","CAF":"CF","TCD":"TD","CHL":"CL","CHN":"CN","HKG":"HK","MAC":"MO","CXR":"CX","CCK":"CC","COL":"CO","COM":"KM","COG":"CG","COD":"CD","COK":"CK","CRI":"CR","CIV":"CI","HRV":"HR","CUB":"CU","CYP":"CY","CZE":"CZ","DNK":"DK","DKK":"DK","DJI":"DJ","DMA":"DM","DOM":"DO","ECU":"EC","Sal":"El","GNQ":"GQ","SXM":"SX","EGY":"EG","SLV":"SV","ERI":"ER","EST":"EE","ETH":"ET","FLK":"FK","FRO":"FO","FJI":"FJ","FIN":"FI","FRA":"FR","GUF":"GF","PYF":"PF","ATF":"TF","GAB":"GA","GMB":"GM","GEO":"GE","DEU":"DE","GHA":"GH","GIB":"GI","GRC":"GR","GRL":"GL","GRD":"GD","GLP":"GP","GUM":"GU","GTM":"GT","GGY":"GG","GIN":"GN","GNB":"GW","GUY":"GY","HTI":"HT","HMD":"HM","VAT":"VA","HND":"HN","HUN":"HU","ISL":"IS","IND":"IN","IDN":"ID","IRN":"IR","IRQ":"IQ","IRL":"IE","IMN":"IM","ISR":"IL","ITA":"IT","JAM":"JM","JPN":"JP","JEY":"JE","JOR":"JO","KAZ":"KZ","KEN":"KE","KIR":"KI","PRK":"KP","KOR":"KR","KWT":"KW","KGZ":"KG","LAO":"LA","LVA":"LV","LBN":"LB","LSO":"LS","LBR":"LR","LBY":"LY","LIE":"LI","LTU":"LT","LUX":"LU","MKD":"MK","MDG":"MG","MWI":"MW","MYS":"MY","MDV":"MV","MLI":"ML","MLT":"MT","MHL":"MH","MTQ":"MQ","MRT":"MR","MUS":"MU","MYT":"YT","MEX":"MX","FSM":"FM","MDA":"MD","MCO":"MC","MNG":"MN","MNE":"ME","MSR":"MS","MAR":"MA","MOZ":"MZ","MMR":"MM","NAM":"NA","NRU":"NR","NPL":"NP","NLD":"NL","ANT":"AN","NCL":"NC","NZL":"NZ","NIC":"NI","NER":"NE","NGA":"NG","NIU":"NU","NFK":"NF","MNP":"MP","NOR":"NO","OMN":"OM","PAK":"PK","PLW":"PW","PSE":"PS","PAN":"PA","PNG":"PG","PRY":"PY","PER":"PE","PHL":"PH","PCN":"PN","POL":"PL","PRT":"PT","PRI":"PR","QAT":"QA","REU":"RE","ROU":"RO","RUS":"RU","RWA":"RW","BLM":"BL","SHN":"SH","KNA":"KN","LCA":"LC","MAF":"MF","SPM":"PM","VCT":"VC","WSM":"WS","SMR":"SM","STP":"ST","SAU":"SA","SEN":"SN","SRB":"RS","SYC":"SC","SLE":"SL","SGP":"SG","SVK":"SK","SVN":"SI","SLB":"SB","SOM":"SO","ZAF":"ZA","SGS":"GS","SSD":"SS","ESP":"ES","LKA":"LK","SDN":"SD","SUR":"SR","SJM":"SJ","SWZ":"SZ","SWE":"SE","CHE":"CH","SYR":"SY","TWN":"TW","TJK":"TJ","TZA":"TZ","THA":"TH","TLS":"TL","TGO":"TG","TKL":"TK","TON":"TO","TTO":"TT","TUN":"TN","TUR":"TR","TKM":"TM","TCA":"TC","TUV":"TV","UGA":"UG","UKR":"UA","ARE":"AE","GBR":"GB","USA":"US","UMI":"UM","URY":"UY","UZB":"UZ","VUT":"VU","VEN":"VE","VNM":"VN","VIR":"VI","WLF":"WF","ESH":"EH","YEM":"YE","ZMB":"ZM","ZWE":"ZW","GBP":"GB","RUB":"RU","NOK":"NO"}', true);
  $out = $countries[$code];
  return $out;
}