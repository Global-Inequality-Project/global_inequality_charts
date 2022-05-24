
// Wait for window to be ready
jQuery(function () {
  prepare_aid_in_reverse_map();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_aid_in_reverse_map() {
  loadCsv(`${window.charts_path}/aid_in_reverse_map/aid_in_reverse_map.csv`,
    function (error, drain_data) {
      if (error === null) {
        window.chart_data['aid_in_reverse_map'] = {
          data: [{
            name: "drain",
            data: {}
          },
          {
            name: "gain",
            data: {}
          }],
          countries: JSON.parse('{"AFG":"AF","ALA":"AX","ALB":"AL","DZA":"DZ","ASM":"AS","AND":"AD","AGO":"AO","AIA":"AI","ATA":"AQ","ATG":"AG","ARG":"AR","ARM":"AM","ABW":"AW","AUS":"AU","AUT":"AT","AZE":"AZ","BHS":"BS","BHR":"BH","BGD":"BD","BRB":"BB","BLR":"BY","BEL":"BE","BLZ":"BZ","BEN":"BJ","BMU":"BM","BTN":"BT","BOL":"BO","BIH":"BA","BWA":"BW","BVT":"BV","BRA":"BR","VGB":"VG","IOT":"IO","BRN":"BN","BGR":"BG","BFA":"BF","BDI":"BI","KHM":"KH","CMR":"CM","CAN":"CA","CPV":"CV","CYM":"KY","CAF":"CF","TCD":"TD","CHL":"CL","CHN":"CN","HKG":"HK","MAC":"MO","CXR":"CX","CCK":"CC","COL":"CO","COM":"KM","COG":"CG","COD":"CD","COK":"CK","CRI":"CR","CIV":"CI","HRV":"HR","CUB":"CU","CYP":"CY","CZE":"CZ","DNK":"DK","DKK":"DK","DJI":"DJ","DMA":"DM","DOM":"DO","ECU":"EC","Sal":"El","GNQ":"GQ","SXM":"SX","EGY":"EG","SLV":"SV","ERI":"ER","EST":"EE","ETH":"ET","FLK":"FK","FRO":"FO","FJI":"FJ","FIN":"FI","FRA":"FR","GUF":"GF","PYF":"PF","ATF":"TF","GAB":"GA","GMB":"GM","GEO":"GE","DEU":"DE","GHA":"GH","GIB":"GI","GRC":"GR","GRL":"GL","GRD":"GD","GLP":"GP","GUM":"GU","GTM":"GT","GGY":"GG","GIN":"GN","GNB":"GW","GUY":"GY","HTI":"HT","HMD":"HM","VAT":"VA","HND":"HN","HUN":"HU","ISL":"IS","IND":"IN","IDN":"ID","IRN":"IR","IRQ":"IQ","IRL":"IE","IMN":"IM","ISR":"IL","ITA":"IT","JAM":"JM","JPN":"JP","JEY":"JE","JOR":"JO","KAZ":"KZ","KEN":"KE","KIR":"KI","PRK":"KP","KOR":"KR","KWT":"KW","KGZ":"KG","LAO":"LA","LVA":"LV","LBN":"LB","LSO":"LS","LBR":"LR","LBY":"LY","LIE":"LI","LTU":"LT","LUX":"LU","MKD":"MK","MDG":"MG","MWI":"MW","MYS":"MY","MDV":"MV","MLI":"ML","MLT":"MT","MHL":"MH","MTQ":"MQ","MRT":"MR","MUS":"MU","MYT":"YT","MEX":"MX","FSM":"FM","MDA":"MD","MCO":"MC","MNG":"MN","MNE":"ME","MSR":"MS","MAR":"MA","MOZ":"MZ","MMR":"MM","NAM":"NA","NRU":"NR","NPL":"NP","NLD":"NL","ANT":"AN","NCL":"NC","NZL":"NZ","NIC":"NI","NER":"NE","NGA":"NG","NIU":"NU","NFK":"NF","MNP":"MP","NOR":"NO","OMN":"OM","PAK":"PK","PLW":"PW","PSE":"PS","PAN":"PA","PNG":"PG","PRY":"PY","PER":"PE","PHL":"PH","PCN":"PN","POL":"PL","PRT":"PT","PRI":"PR","QAT":"QA","REU":"RE","ROU":"RO","RUS":"RU","RWA":"RW","BLM":"BL","SHN":"SH","KNA":"KN","LCA":"LC","MAF":"MF","SPM":"PM","VCT":"VC","WSM":"WS","SMR":"SM","STP":"ST","SAU":"SA","SEN":"SN","SRB":"RS","SYC":"SC","SLE":"SL","SGP":"SG","SVK":"SK","SVN":"SI","SLB":"SB","SOM":"SO","ZAF":"ZA","SGS":"GS","SSD":"SS","ESP":"ES","LKA":"LK","SDN":"SD","SUR":"SR","SJM":"SJ","SWZ":"SZ","SWE":"SE","CHE":"CH","SYR":"SY","TWN":"TW","TJK":"TJ","TZA":"TZ","THA":"TH","TLS":"TL","TGO":"TG","TKL":"TK","TON":"TO","TTO":"TT","TUN":"TN","TUR":"TR","TKM":"TM","TCA":"TC","TUV":"TV","UGA":"UG","UKR":"UA","ARE":"AE","GBR":"GB","USA":"US","UMI":"UM","URY":"UY","UZB":"UZ","VUT":"VU","VEN":"VE","VNM":"VN","VIR":"VI","WLF":"WF","ESH":"EH","YEM":"YE","ZMB":"ZM","ZWE":"ZW","GBP":"GB","RUB":"RU","NOK":"NO","XKX":"XK"}', true),

        }
        window.chart_data['aid_in_reverse_map'].data[0].data = fromCSV(drain_data, ['string', 'number', 'number']);
        createChartInterface({
          chartID: "aid_in_reverse_map",
          renderFunc: render_aid_in_reverse_map,
        })
      } else {
        console.error(error)
      }
    });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_aid_in_reverse_map(canvasID, modal) {
  let values = {};
  const legend = [
    {
      color: "#e6e6e6",
      name: "No data"
    },
    {
      color: "#abdda4",
      name: "IMF Advanced"
    },

    {
      color: "#f68648",
      name: "$0 - 1B"
    },

    {
      color: "#ea503b",
      name: "$1B - 5B",
    },

    {
      color: "#d30000",
      name: "$5B - 20B",
    },

    {
      color: "#950000",
      name: "$20B+"
    },

  ]
  const colors =
    window.chart_data['aid_in_reverse_map'].data[0].data.forEach(element => {
      const countryCode = map_convertCountryAlphas3To2(element.iso)
      if (countryCode) {
        if (!values[countryCode]) values[countryCode] = {
          mean_tmo: 0,
          mean_hmo: 0,
          mean_iff: 0,
          mean_oda: 0,
          quantile: -1,
        }
        values[countryCode].mean_tmo = element.mean_tmo;
        values[countryCode].mean_hmo = element.mean_hmo;
        values[countryCode].mean_iff = element.mean_iff;
        values[countryCode].mean_oda = element.mean_oda;
        values[countryCode].quantile = element.quantile;
        values[countryCode].color = legend[element.quantile + 1].color
      }
      else {
        console.error(element.iso, "not found", countryCode)
      }

    });
  setTimeout(function () {
    var map = new svgMap({
      targetElementID: canvasID.replace("#", ""),
      colorMin: "#f5d993",
      data: {
        // thousandSeparator: ".",
        data: {
          mean_tmo: {
            name: 'Trade related outflow',
            format: '${0} trillion',
            thousandSeparator: ',',
          },
          mean_hmo: {
            name: 'Hot money outflows',
            format: '${0}'
          },
          mean_iff: {
            name: 'Total outflows',
            format: '${0} trillion',
            thousandSeparator: ',',
          },
          mean_oda: {
            name: 'Aid receipts',
            format: '${0}'
          },
          quantile: {
            name: 'Quantile',
            format: '${0}'
          },
        },
        initialZoom: 1.15,
        showZoomReset: true,
        showContinentSelector: true,
        initialPan: { x: 550, y: 160 },
        applyData: 'quantile',
        values: values
      },
      onGetTooltip: function (tooltipDiv, countryID, countryValues) {
        // Create tooltip content element
        var tooltipContentElement = document.createElement('div');
        var innerHTML =
          '<div style="margin: 10px;padding:10px;z-index:100; text-align: center" class="svgMap-tooltip-content-container">'
          + '<img src="https://cdn.jsdelivr.net/gh/hjnilsson/country-flags@latest/svg/{0}.svg" alt="" style="height: 40px; width: auto; border: 2px solid #eee" class="svgMap-tooltip-flag"></div>'.replace(
            '{0}',
            countryID.toLowerCase()
          );
        innerHTML += "<div class='svgMap-tooltip-title'>" + map.getCountryName(countryID) + "</div>"
        if (countryValues) {
          Object.keys(map.options.data.data).forEach(key => {
            if (key !== "quantile" && countryValues[key] !== 0) {
              const prepared = map_getUnitForValue(countryValues[key])
              innerHTML += '<div style="padding:10px;" >' + map.options.data.data[key].name + ': <b>$ ' + prepared.value + prepared.unit + '</b></div>'
            }
          });
        }

        innerHTML += '</div>'
        // Return element with custom content
        tooltipContentElement.innerHTML = innerHTML;
        return tooltipContentElement;
      }

    });
    map_createLegend(legend, canvasID)

  }, 400)
}
