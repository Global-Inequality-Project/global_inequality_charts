
// Wait for window to be ready
jQuery(function () {
  prepare_drain_map();
});


// Import data and render chart interface
// Make sure to use the chart ID to creat unique function names
function prepare_drain_map() {
  loadCsv(`${window.charts_path}/drain_map/drain_loss.csv`,
    function (error, drain_data) {
      if (error === null) {
        loadCsv(`${window.charts_path}/drain_map/drain_gain.csv`,
          function (error, gain_data) {
            if (error === null) {
              window.chart_data['drain_map'] = {
                data: [{
                  name: "drain",
                  data: {}
                },
                {
                  name: "gain",
                  data: {}
                }],
                countries: JSON.parse('{"AFG":"AF","ALA":"AX","ALB":"AL","DZA":"DZ","ASM":"AS","AND":"AD","AGO":"AO","AIA":"AI","ATA":"AQ","ATG":"AG","ARG":"AR","ARM":"AM","ABW":"AW","AUS":"AU","AUT":"AT","AZE":"AZ","BHS":"BS","BHR":"BH","BGD":"BD","BRB":"BB","BLR":"BY","BEL":"BE","BLZ":"BZ","BEN":"BJ","BMU":"BM","BTN":"BT","BOL":"BO","BIH":"BA","BWA":"BW","BVT":"BV","BRA":"BR","VGB":"VG","IOT":"IO","BRN":"BN","BGR":"BG","BFA":"BF","BDI":"BI","KHM":"KH","CMR":"CM","CAN":"CA","CPV":"CV","CYM":"KY","CAF":"CF","TCD":"TD","CHL":"CL","CHN":"CN","HKG":"HK","MAC":"MO","CXR":"CX","CCK":"CC","COL":"CO","COM":"KM","COG":"CG","COD":"CD","COK":"CK","CRI":"CR","CIV":"CI","HRV":"HR","CUB":"CU","CYP":"CY","CZE":"CZ","DNK":"DK","DKK":"DK","DJI":"DJ","DMA":"DM","DOM":"DO","ECU":"EC","Sal":"El","GNQ":"GQ","SXM":"SX","EGY":"EG","SLV":"SV","ERI":"ER","EST":"EE","ETH":"ET","FLK":"FK","FRO":"FO","FJI":"FJ","FIN":"FI","FRA":"FR","GUF":"GF","PYF":"PF","ATF":"TF","GAB":"GA","GMB":"GM","GEO":"GE","DEU":"DE","GHA":"GH","GIB":"GI","GRC":"GR","GRL":"GL","GRD":"GD","GLP":"GP","GUM":"GU","GTM":"GT","GGY":"GG","GIN":"GN","GNB":"GW","GUY":"GY","HTI":"HT","HMD":"HM","VAT":"VA","HND":"HN","HUN":"HU","ISL":"IS","IND":"IN","IDN":"ID","IRN":"IR","IRQ":"IQ","IRL":"IE","IMN":"IM","ISR":"IL","ITA":"IT","JAM":"JM","JPN":"JP","JEY":"JE","JOR":"JO","KAZ":"KZ","KEN":"KE","KIR":"KI","PRK":"KP","KOR":"KR","KWT":"KW","KGZ":"KG","LAO":"LA","LVA":"LV","LBN":"LB","LSO":"LS","LBR":"LR","LBY":"LY","LIE":"LI","LTU":"LT","LUX":"LU","MKD":"MK","MDG":"MG","MWI":"MW","MYS":"MY","MDV":"MV","MLI":"ML","MLT":"MT","MHL":"MH","MTQ":"MQ","MRT":"MR","MUS":"MU","MYT":"YT","MEX":"MX","FSM":"FM","MDA":"MD","MCO":"MC","MNG":"MN","MNE":"ME","MSR":"MS","MAR":"MA","MOZ":"MZ","MMR":"MM","NAM":"NA","NRU":"NR","NPL":"NP","NLD":"NL","ANT":"AN","NCL":"NC","NZL":"NZ","NIC":"NI","NER":"NE","NGA":"NG","NIU":"NU","NFK":"NF","MNP":"MP","NOR":"NO","OMN":"OM","PAK":"PK","PLW":"PW","PSE":"PS","PAN":"PA","PNG":"PG","PRY":"PY","PER":"PE","PHL":"PH","PCN":"PN","POL":"PL","PRT":"PT","PRI":"PR","QAT":"QA","REU":"RE","ROU":"RO","RUS":"RU","RWA":"RW","BLM":"BL","SHN":"SH","KNA":"KN","LCA":"LC","MAF":"MF","SPM":"PM","VCT":"VC","WSM":"WS","SMR":"SM","STP":"ST","SAU":"SA","SEN":"SN","SRB":"RS","SYC":"SC","SLE":"SL","SGP":"SG","SVK":"SK","SVN":"SI","SLB":"SB","SOM":"SO","ZAF":"ZA","SGS":"GS","SSD":"SS","ESP":"ES","LKA":"LK","SDN":"SD","SUR":"SR","SJM":"SJ","SWZ":"SZ","SWE":"SE","CHE":"CH","SYR":"SY","TWN":"TW","TJK":"TJ","TZA":"TZ","THA":"TH","TLS":"TL","TGO":"TG","TKL":"TK","TON":"TO","TTO":"TT","TUN":"TN","TUR":"TR","TKM":"TM","TCA":"TC","TUV":"TV","UGA":"UG","UKR":"UA","ARE":"AE","GBR":"GB","USA":"US","UMI":"UM","URY":"UY","UZB":"UZ","VUT":"VU","VEN":"VE","VNM":"VN","VIR":"VI","WLF":"WF","ESH":"EH","YEM":"YE","ZMB":"ZM","ZWE":"ZW","GBP":"GB","RUB":"RU","NOK":"NO"}', true),

              }
              window.chart_data['drain_map'].data[0].data = fromCSV(drain_data, ['string', 'number', 'number']);
              window.chart_data['drain_map'].data[1].data = fromCSV(gain_data, ['string', 'number', 'number']);
              createChartInterface({
                chartID: "drain_map",
                renderFunc: render_drain_map,
              })
            } else {
              console.error(error)
            }
          });
      } else {
        console.error(error)
      }
    });

}


// Render chart onto canvas
// Make sure to use the chart ID to creat unique function names
function render_drain_map(canvasID, modal) {
  let values = {};
  window.chart_data['drain_map'].data[0].data.forEach(element => {
    const countryCode = map_convertCountryAlphas3To2(element.iso)
    if (countryCode) {
      if (!values[countryCode]) values[countryCode] = {}
      values[countryCode].loss = element.loss
      values[countryCode].loss_pcap = element.loss_pcap
      values[countryCode].color = "#ee4466"
    }
    else {
      console.error(element.iso, "not found", countryCode)
    }

  });
  window.chart_data['drain_map'].data[1].data.forEach(element => {
    const countryCode = map_convertCountryAlphas3To2(element.iso)
    if (countryCode) {
      if (!values[countryCode]) values[countryCode] = {}
      values[countryCode].gain = element.gain
      values[countryCode].gain_pcap = element.gain_pcap
      values[countryCode].color = "#abdda4"
    }

  });
  setTimeout(function () {
    var map = new svgMap({
      targetElementID: canvasID.replace("#", ""),
      colorMin: "#f5d993",
      data: {
        // thousandSeparator: ".",
        data: {

          loss: {
            name: 'Loss to the Global North',
            format: '${0} trillion',
            thousandSeparator: ',',
          },
          loss_pcap: {
            name: 'Per Capita Loss',
            format: '${0}'
          },
          gain: {
            name: 'Gain to the Global North',
            format: '${0} trillion',
            thousandSeparator: ',',
          },
          gain_pcap: {
            name: 'Per Capita Gain',
            format: '${0}'
          },
        },
        applyData: 'loss',
        values: values,

      },
      initialZoom: 1.13,
      showZoomReset: true,
      showContinentSelector: true,
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
          if (countryValues.loss) {
            let loss = countryValues.loss / 1000000 * -1;
            let unit = " trillion";
            if (loss < 1) {
              loss = countryValues.loss / 1000 * -1;
              unit = " billion"
            }
            loss = loss.toFixed(2);
            innerHTML += '<div style="padding:10px;" >Loss to the Global North: <b>$ ' + loss + unit + '</b></div>'
            innerHTML += '<div style="padding:10px;">Per Capita Loss: <b>$ ' + (countryValues.loss_pcap * -1).toLocaleString() + '</b></div>'
          } else if (countryValues.gain) {
            let gain = countryValues.gain / 1000000;
            let unit = " trillion";
            if (gain < 1) {
              gain = countryValues.gain / 1000;
              unit = " billion"
            }
            gain = gain.toFixed(2);
            innerHTML += '<div style="padding:10px;">Gain from the Global South: <b>$ ' + gain + unit + ' </b></div>'
            innerHTML += '<div style="padding:10px;">Per Capita Gain: <b>$ ' + countryValues.gain_pcap.toLocaleString() + '</b></div>'
          } else {
            innerHTML += 'no data avaiable'
          }
        }

        innerHTML += '</div>'
        // Return element with custom content
        tooltipContentElement.innerHTML = innerHTML;
        return tooltipContentElement;
      }

    });

  }, 400)

}
