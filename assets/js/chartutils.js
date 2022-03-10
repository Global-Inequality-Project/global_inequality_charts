//--------------------------------------- createApexCharts
function createApexChart(canvasID, chartID, options, callback) {
    options.chart.height = '100%';
    options.chart.fontFamily = 'Open Sans, sans-serif';
    var chart = new ApexCharts(document.querySelector(canvasID), options);
    function renderChart() {
        chart.render()
        if (callback !== undefined) {
            callback(chart)
        }
    }
    setTimeout(renderChart, 500);
    return chart
}


//--------------------------------------- formatTooltipVal
function formatTooltipVal(val, index, round_to){
    round_to = (round_to == undefined ? 2 : round_to);
    if (Math.abs(val) >= 1000){
        let formatted = formatLarge(val, 1, true);
        let pos_neg =  val < 0 ? "-" : "";
        return pos_neg+formatted;
    }else
        if (val !== undefined)
            return val.toFixed(round_to);
        else
            return null;
}

//--------------------------------------- formatYAxisLabel
function formatYAxisLabel(val, index, precision, short){
    if (precision == undefined)
        precision = 1;

    short = short || false;
    if (Math.abs(val) >= 1000){
        let formatted = formatLarge(val, precision, short);
        let pos_neg =  val < 0 ? "-" : "";
        return pos_neg+formatted;
    }else
        return val;
}

//--------------------------------------- formatBillionsLabel
function formatBillionsLabel(val, index, precision, short){
    if (precision == undefined)
        precision = 1;
    short = short || false;
    let billions_str = formatYAxisLabel(val, index, precision, short);
    let isNumber = (typeof billions_str == 'number');
    if (!isNumber && billions_str && billions_str.endsWith('M')){
        let millions =  parseFloat(billions_str.substring(0,billions_str.length-2));
        let billions = millions/1000;
        billions_str = billions.toFixed(precision) + " " + (short ? "B" : "billion");
    }
    return billions_str;
}

//--------------------------------------- formatPercentileLabel
function formatPercentileLabel(percentile){
    percentile = Math.floor(percentile);
    if (percentile == 1)
        return 'Poorest 1%';
    else
        if (percentile == 100)
            return 'Richest 1%';
        else
            return percentile;
}

//--------------------------------------- basicTooltip
function basicTooltip(dataPointIndex, w, format, prefix, order, show_name){
    format = format || '';
    prefix = prefix || '';
    order = order || '';
    show_name = show_name || false;

    let config_series = w.config.series;
    let year = w.globals.categoryLabels[dataPointIndex];

    let lines = '';
    let color, marker, val, line, name;
    let colors = w.config.colors ? w.config.colors : w.globals.colors;
    let series = w.config.series;
    let sorted = []
    series.forEach((item, index) => {
        sorted.push({
            val: item.data[dataPointIndex],
            color: colors[index],
            name: item.name
        });
    });
    switch (order){
        case 'reverse': sorted.reverse(); break;
        case 'asc': sorted.sort((a, b) => a.val-b.val); break;
        case 'desc': sorted.sort((a, b) => b.val-a.val); break;
    }

    sorted.forEach((item, index) => {
        color = item.color; //colors[index];
        marker = '<div class="custom-tooltip-marker" style="background-color:'+color+'"></div>';
        name = show_name ? item.name+': ' : '';

        val = item.val; // item.data[dataPointIndex];
        if (val){
            switch (format){
                case 'billions': val = formatBillionsLabel(val, null, 1, false);
                    break;
                case 'thousands_short': val = formatTooltipVal(val, null, 1);
                    break;
                case 'percent_0': val = formatTooltipVal(val, null, 0)+'%';
                    break;
                default: val = formatTooltipVal(val, null);
            }
            val = prefix+val;

            line = '<div class="custom-tooltip-line">'+ marker + '<div>'+name+'<b>' + val +'</b></div></div>';
            lines += line;
        }
    });
    return '<div class="custom-tooltip-box">' +
        '<div class="custom-tooltip-title">' + year+ '</div>' +
        lines+
        '</div>';
}

//-------------------------------------- pre_populate
function pre_populate(json, style_file, lang){
    window.global = json;

    if (!lang){ // added this condition and lang parameter on May 1, 2018 to allow a window.location.search used by a calling
                // script (cgi-bin/switch.py) that cannot be subsequently changed before calling pre_populate without the script failing
        if (window.location.search){
            window.global.lang = window.location.search.substr(1); // remove leading '?'
            // Removed comments and added window.global.rtl_switch condition July 14, 2019
            if (window. global.rtl_switch && (window.global.lang == 'ur' || window.global.lang == 'ar'))
                $('html').attr("dir", "rtl");
        }else
            window.global.lang = 'en';
    }else
        window.global.lang = lang;

    var lang_css_file = style_file;
    if (window.global.lang != 'en')
        lang_css_file += '_'+window.global.lang;

    lang_css_file += '.css';
    $('head').append('<link rel="stylesheet" href="'+lang_css_file+'" type="text/css" />');

    $.holdReady(false);
}

//-------------------------------------- localizedTitles
function localizedTitles(lang_id){

    var suffix = '';
    var lang = 'English';
    // insert language link
    switch (window.global.lang){
        case 'en':
            if (window.global.other_lang){ // June 8, 2018: Add check for window.global.other_lang; earlier other language defaulted to Urdu
                suffix = '?'+window.global.other_lang['suffix'];
                lang = window.global.other_lang['lang'];
            }else{
                suffix = '?ur';
                lang = 'اردو';
            }
            break;
        default: break;
    }
    $('#'+lang_id).html('<a href="'+window.location.pathname+suffix+'">'+lang+'</a>');

    // insert titles based on language
    for (var i=0, len =  window.global.titles.length; i < len; ++i){
        switch (window.global.titles[i].type){
            case 'link':
                $('#'+window.global.titles[i].key+' a').html(window.global.titles[i][window.global.lang]);
                break;
            case 'class':
                $('.'+window.global.titles[i].key).html(window.global.titles[i][window.global.lang]);
                break;
            case 'option':
                $('option[value="'+window.global.titles[i].key+'"]').html(window.global.titles[i][window.global.lang]);
                break;
            default: // id
                $('#'+window.global.titles[i].key).html(window.global.titles[i][window.global.lang]);
        }
    }
}

//-------------------------------------- getGlobalArrHashAttrib
function getGlobalArrHashAttrib(arrhash, key, attrib){

    for (var i=0, len=window.global[arrhash].length; i < len; ++i)
        if (window.global[arrhash][i].key == key)
            return window.global[arrhash][i][attrib];

    return 'Key '+key+' not found in '+arrhash;
}

//-------------------------------------- makeId
function makeId(tag){
    var id = tag.replace("+","");
    return "X"+id;
}

//-------------------------------------- addCommas
// source: http://www.mredkj.com/javascript/numberFormat.html
function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//------------------------------ searchLookup
function searchLookup(value, array) {
/* Each element of array is an array of the form [index, lookup_value] */
    var high = array.length - 1;
    var low = 0;

    while (low <= high) {
        var mid = parseInt((low + high) / 2);
        element = array[mid][0]; // first element of each array element is the key to search on
        if (element > value) {
            high = mid - 1;
        } else if (element < value) {
            low = mid + 1;
        } else {
            return mid;
        }
    }

    return -1;
};

//------------------------------ searchLookupTree
function searchLookupTree(value, array){
/* Each element of array is either an array of the form [index, lookup_value] or [index, lookup_value, array_of_the_same_form]*/

    for (var i=0, len=array.length; i<len; ++i)
        if (value == array[i][0])
            return array[i][1];
        else
            if (array[i].length == 3){ // i.e. third element indicates recursive lookup array
                var check = searchLookupTree(value, array[i][2]); // assume third element is array
                if (check != null)
                    return check;
            }

    return null;
}

//------------------------------- properCase
function properCase(string) {
    return string.charAt(0).toUpperCase()+string.substr(1);
}

//------------------------------- repeat
function repeat(char, times) {
    var repeat = "";
    for (var i=0; i < times; ++i)
        repeat += char;
    return repeat;
}

//------------------------------- updateObject
/* Added: May 2, 2018
**********************************************/
function updateObject(target, source) {
   for(var key in source) {
     if (source.hasOwnProperty(key)) {
        target[key] = source[key];
     }
   }
}

//--------------------------------------- percentile(arr, percent)
/* Added: June 14, 2018
   Adapted from Python: https://code.activestate.com/recipes/511478-finding-the-percentile-of-the-values/
*****************************************/
function percentile(arr, percent){
    if (!arr)
        return null;

    var k = (arr.length-1) * percent
    var f = Math.floor(k)
    var c = Math.ceil(k)
    if (f == c)
        return arr[Math.floor(k)]

    var d0 = arr[f] * (c-k)
    var d1 = arr[c] * (k-f)
    return d0+d1;
}

//--------------------------------------- fromCSV(data, types, as_arr, separator, handle_null)
/* Added: November 25, 2018
*  Change - June 6, 2019: handle_null as parameter, default = false
*****************************************/
function fromCSV(data, types, as_arr, separator, handle_null){
    as_arr = as_arr || false;
    separator = separator || ',';
    handle_null = handle_null || false;

    var data_arr = [];

    var lines = data.split("\n");
    var cols = lines[0].split(separator);
    if (!types){
        types = []
        for (var i = 0; i < cols.length; i++) types[i] = "number";
    }

    if (as_arr)
        data_arr.push(cols);

    var line, line_obj;

    var value;
    for (var i=1, len=lines.length; i<len; ++i){
        line = lines[i].split(separator);
        line_obj = as_arr ? [] : {};
        if (line[0]){ // check for empty line (February 3, 2019)
            for (var j=0, col_length=cols.length; j < col_length; ++j){
                value = types[j] == 'string' ? line[j] : (handle_null && line[j].trim()=="" ? null: +line[j])
                if (as_arr)
                    line_obj.push(value);
                else
                    line_obj[cols[j]] = value;
            }

            data_arr.push(line_obj);
        }
    }

    return data_arr;
}

//-------------------------------------- makeHash
/* Added: March 3, 2019
   Takes an array of objects and returns a hash with the key either being 'code' or specified in the 'hashcode' parameter
**************************************************/
function makeHash(dataList, hashcode){
    hashcode = hashcode || 'code';
    var hash = {};
    for (var i=0, len=dataList.length; i<len; ++i){
        var code = dataList[i][hashcode];
        hash[code] = {};
        for (key in dataList[i])
            hash[code][key] =  dataList[i][key];
    }
    return hash;
}

//--------------------------------------- CSVLookup(data, separator)
/* Added: January 3, 2019
   Modified: March 19, 2019 to incorporate col parameter
*****************************************/
function CSVLookup(data, separator, col){
    separator = separator || ',';
    col = col || 1;
    var lookup = {};
    var lines = data.split("\n");
    for (var i=0, len=lines.length; i<len; ++i){
        line = lines[i].split(separator);
        if (line[0]) // check for empty line (February 3, 2019)
            lookup[line[0]] = line[col];
    }
    return lookup;
}

//-------------------------------------- groupSum
/* Added: December 27, 2019
   Last Modified: March 1, 2019
   Takes an array of objects and returns a hash grouped on 'keys' which sums all elements except those in exclude
**************************************************/
function groupSum(dataList, keys, exclude){
    exclude = exclude || [];
    let hash = {};
    for (var i=0, len=dataList.length; i<len; ++i){
        let row = dataList[i];
        let code_values = keys.map(function(elem){ return row[elem];});
        let code = code_values.join('_');

        if (!hash[code])
            hash[code]= {};

        for (key in row)
            if ((keys.indexOf(key) == -1) && (exclude.indexOf(key) == -1)){ // i.e. sum only non-key values and those not in exclude
                if (!hash[code][key])
                    hash[code][key] = null; //0;
                if (row[key] != null)
                    hash[code][key] += row[key];
            }
    }
    return hash;
}

//------------------------------ checkObjectKeysFunc
/* https://stackoverflow.com/questions/18912932/object-keys-not-working-in-internet-explorer */
function checkObjectKeysFunc(){
    if (!Object.keys) {
        Object.keys = function(obj) {
            var keys = [];

            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }
            return keys;
        };
    }
}

//------------------------------ checkObjectValuesFunc
function checkObjectValuesFunc(){
    if (!Object.values) {
        Object.values = function(obj) {
            var values = Object.keys(obj).map(function(key) {
                return obj[key];
            });

            return values;
        };
    }
}

// check for startsWith and if not present (as in IE) add this function
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

// check for Array.fill and if not present (as in IE) add this function - Added March 16, 2019
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}

//-------------------------------------- importNodeIE
/* Added January 21, 2019
 Manually imports node to the provided document; to overcome the IE DOMException encountered upon appending the imported SVG

 - Calling signature:

    var importedNode;
    try{
        importedNode = document.importNode(xml.documentElement, true);
    }catch(e){
        // IE case
        importedNode = importNodeIE(xml.documentElement, document);
    }
----------------------------*/
function importNodeIE(node, allChildren) {
    //
    switch (node.nodeType) {
        case document.ELEMENT_NODE:
            var newNode = document.createElementNS(node.namespaceURI, node.nodeName);
            if(node.attributes && node.attributes.length > 0) {
                for(var i = 0, il = node.attributes.length; i < il; i++) {
                    newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            }
            if(allChildren && node.childNodes && node.childNodes.length > 0) {
                for(var i = 0, il = node.childNodes.length; i < il; i++) {
                    newNode.appendChild(importNode(node.childNodes[i], allChildren));
                }
            }

            return newNode;
            break;

        case document.TEXT_NODE:
        case document.CDATA_SECTION_NODE:
        case document.COMMENT_NODE:
            return document.createTextNode(node.nodeValue);
            break;
    }
}


//-------------------------------------- checkAndSetBrowserZoom
/* Added February 21, 2019 */
function checkAndSetBrowserZoom(default_width){
    default_width = default_width || 1301;

    var zoom = window.screen.availWidth/default_width;
    if (Math.abs(1 - zoom) > 0.0001)
        if ($.browser.mozilla){
            $('body').css('transform-origin','top left');
            $('body').css('MozTransform','scale(' + zoom + ')');
        }else{
            $('body').css('transform-origin','top left');
            $('body').css('zoom', zoom );
        }
}

//-------------------------------------- formatLarge
// Added July 23 2019
// https://stackoverflow.com/questions/36734201/how-to-convert-numbers-to-million-in-javascript
function formatLarge(large, precision, short) {

    precision = precision || (precision == 0 ? 0 : 2); // changed Dec 27, 2019
    short = short || false;

    // Twelve Zeroes for Billions
    var strLarge = Math.abs(large) >= 1.0e+12
        ? (Math.abs(large) / 1.0e+12).toFixed(precision) + " " + (short ? "T" : "trillion")
        : Math.abs(large) >= 1.0e+9

        // Nine Zeroes for Billions
        ? (Math.abs(large) / 1.0e+9).toFixed(precision) + " " + (short ? "B" : "billion")
        // Six Zeroes for Millions
        : Math.abs(large) >= 1.0e+6

        ? (Math.abs(large) / 1.0e+6).toFixed(precision) + " " + (short ? "M" : "million")
        // Three Zeroes for Thousands
        : Math.abs(large) >= 1.0e+3

        ? (Math.abs(large) / 1.0e+3).toFixed(precision) + " " + (short ? "K" : "thousand")

        : Math.abs(large).toFixed(2);

    return strLarge;
}

//------------------------------------- getsSnippet
function getSnippet(url) {
    return new Promise(function(resolve, reject) {
        // Standard XHR to load a file
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'text';
        // When the request loads, check whether it was successful
        request.onload = function() {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                $("body").css("cursor", "default");
                resolve(request.response);
            } else {
                // If it fails, reject the promise with a error message
                $("body").css("cursor", "default");
                reject(Error('Text file didn\'t load successfully; error code: ' + request.statusText+'. Url: '+url));
            }
        };
        request.onerror = function() {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            $("body").css("cursor", "default");
            reject(Error('There was a network error.'+' url: '+url));
        };
        // Send the request
        $("body").css("cursor", "progress");
        request.send();
    });
}

//--------------------------------------- getSVGObject
function getSVGObject(id){
    let svgObject = document.getElementById(id).contentDocument;
    return svgObject.documentElement;
}
