// Global objects
window.charts = {}
window.chart_data = {}
window.charts_path = window.wp_url + "/wp-content/plugins/global_inequality_charts/charts"


// Chart Interface
// ---------------
function createChartInterface({ chartID, renderFunc, customTools }) {
    // TODO - Create Chart Interace if loading of chartSources fails
    loadJson(`${window.charts_path}/${chartID}/${chartID}.json`, function (error, data) {
        if (error === null) {
            if (data.schema_version >= 4) {
                loadTxt(`${window.charts_path}/${chartID}/${chartID}_sources.txt`, function (error, chartSources) {
                    if (error !== null) {

                        chartSources = null;
                    }
                    createChart({
                        chartID: chartID,
                        chartTitle: data.title,
                        chartDescription: data.description,
                        chartSources: chartSources,
                        renderFunc: renderFunc,
                        template: data.template ? data.template : "main",
                        customTools: customTools ? customTools : "",
                    })
                });
            } else {
                console.log("Chart settings 'schema_version < 4' is depreciated. Please update schema.")
            }
        } else {
            console.log("Chart settings ([chartID].json) could not be loaded.")
        }
    });
};



function createChart({ chartID, chartTitle, chartDescription, renderFunc, template, customTools, chartSources }) {

    let createTemplate = window["createTemplate_" + template]({
        chartID: chartID,
        chartTitle: chartTitle,
        chartDescription: chartDescription,
        customTools: customTools,
        chartSources: chartSources
    });
    document.getElementById(`chart-${chartID}`).innerHTML = createTemplate;

    // Render chart in main area
    window.charts[chartID] = renderFunc(`#chart-canvas-${chartID}`, false);

    if (chartSources === null){
        document.getElementById(`chart-btn-sources-${chartID}`).style.display = 'none';
        document.getElementById(`chart-${chartID}-sources-btns`).style.display = 'none';
    }

    // If chart is specified in url, scroll to it
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chart = urlParams.get('chart')

    if (chart === chartID) {
        // Scroll to chart after chart is ready
        setTimeout(function () {
            document.getElementById(`chart-${chartID}`).scrollIntoView();
        }, 600);
    }

    // Expand function
    var expandButton = document.getElementById(`chart-expand-btn-${chartID}`);
    expandButton.onclick = function () {

        // Prepare modal content
        var modalBox = document.getElementById("chart-modal-box");
        var modelContent = document.createElement("div");
        modelContent.id = `chart-modal-content-${chartID}`;
        modalBox.appendChild(modelContent);

        // Make modal wrapper visible
        var modal = document.getElementById("chart-modal-wrapper")
        modal.style.display = "block"

        // Disable scrolling
        document.body.style.overflow = "hidden";

        // Render chart in modal content
        window.charts["modal"] = renderFunc(`#chart-modal-content-${chartID}`, true)

    };
}

// Button areas
// ------------

function toggleChartArea(button, areaID, chartID) {
    var shareArea = document.getElementById(`chart-${chartID}-${areaID}-btns`)
    if (button.value == "OFF") {
        button.value = "ON";
        shareArea.style.display = "block";
        shareArea.style.visibility = "visible";
    } else {
        button.value = "OFF";
        shareArea.style.display = "none";
        shareArea.style.visibility = "hidden";
    }
}

function copySources(chartID, chartSources) {
    var btn = document.getElementById(`chart-btn-sources-${chartID}`)
    toggleChartArea(btn, 'sources', chartID)
    copyToClipboard(chartSources)
}


// Share functions
// ---------------

function shareChartFacebook(chartID) {
    var url = window.location.href.split('?')[0];
    var title = `Global Inequality Chart`;
    window.open(`https://www.facebook.com/sharer/sharer.php%3Fu=${url}%3Fchart=${chartID}&t=${title}`, "_blank" );
}


function shareChartTwitter(chartID) {
    var url = window.location.href.split('?')[0];
    var text = `Check out this chart on Global Inequality:`;
    var hashtags = "globalinequality,inequality,global,globalinequalitycharts";
    window.open(`https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}&url=${url}?chart=${chartID}`, "_blank");
}

function copyChartURL(chartID) {
    var url = window.location.href.split('?')[0] + `?chart=${chartID}`;
    copyToClipboard(url)
}

function copyToClipboard(url) {
    //console.log(url)
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
    } else {
        // fallback: manually copy the text for older browsers
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }
}

// todo fb share button

// Download image functions
// ------------------------

function createImage(chartID, chartTitle, chartDescription) {

    var chart = document.getElementById(`chart-canvas-${chartID}`);
    const chart_clone = chart.cloneNode(true);

    var img = new Image();
    img.src = '/wp-content/plugins/global_inequality_charts/assets/img/global_inequality_logo.png';
    img.className = "global_inequality_logo";

    document.getElementById(`downloadImage-${chartID}`).appendChild(img);

    document.getElementById(`downloadImage-${chartID}`).innerHTML +=
        `<h2>${chartTitle}</h2>`;

    document.getElementById(`downloadImage-${chartID}`).innerHTML +=
        `<h4>${chartDescription}</h4>`;

    document.getElementById(`downloadImage-${chartID}`).appendChild(chart_clone);

    document.getElementById(`downloadImage-${chartID}`).innerHTML +=
        `URL: ${window.location.href}#chart-${chartID}`;

}

function downloadImage(chartID, chartTitle, chartDescription) {

    createImage(chartID, chartTitle, chartDescription)

    var container = document.getElementById(`downloadImage-${chartID}`);

    html2canvas(container, { allowTaint: true }).then(function (canvas) {

        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = `${chartTitle}.png`;
        link.href = canvas.toDataURL();
        link.target = '_blank';
        link.click();
        document.body.removeChild(link);

    });

    container.innerHTML = "";
}

// load Json data
function loadJson(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

function loadTxt(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'txt';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

// Modal wrapper
// -------------

// Create modal elements
document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("chart-modal-wrapper")
    modal.className = "modal-wrapper"
    modal.innerHTML += `
    <span class="modal-close" id="chart-modal-close">&times;</span>
    <div class="modal-box" id="chart-modal-box"></div>
    `

    // Close modal by clicking on the close button
    var modalClose = document.getElementById("chart-modal-close");
    modalClose.onclick = function () {
        modal.style.display = "none";
        document.getElementById("chart-modal-box").innerHTML = "";
        document.body.style.overflow = "auto"; // Enable scrolling
    };

    // Close modal by clicking on grey area
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.getElementById("chart-modal-box").innerHTML = "";
            document.body.style.overflow = "auto"; // Enable scrolling
            var chart = window.charts["modal"]
            if (typeof chart.destroy == 'function') {
                chart.destroy();
            }
            window.charts["modal"] = null
        }
    };
}, false);
