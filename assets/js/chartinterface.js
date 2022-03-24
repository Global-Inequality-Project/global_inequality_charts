// Global objects
window.chart_data = {}
window.charts_path = window.wp_url + "/wp-content/plugins/global_inequality_charts/charts"


// Chart Interface
// ---------------
function createChartInterface({ chartID, renderFunc, pathToData, topMargin }) {
    loadJson(`${window.charts_path}/${chartID}/${chartID}.json`, function (error, data) {
        if (error === null) {
            if (data.schema_version >= 2) {
                createChart({
                    chartID: chartID,
                    chartTitle: data.title,
                    chartDescription: data.description,
                    chartSources: data.sources,
                    template: data.template ? data.template : "main",
                    renderFunc: renderFunc,
                    pathToData: pathToData,
                    topMargin: topMargin
                })
            } else {
                createChart({
                    chartID: chartID,
                    chartTitle: data.name,
                    chartDescription: "no description",
                    chartSources: "no sources",
                    template: "main",
                    renderFunc: renderFunc,
                    pathToData: pathToData,
                    topMargin: topMargin
                })
            }
        } else {
            // todo - error handling
        }
    });


}
function createChart({ chartID, chartTitle, chartDescription, chartSources, template, renderFunc, pathToData, topMargin }) {


    if (pathToData == null) { pathToData = `${window.charts_path}/${chartID}/${chartID}.csv` }
    if (topMargin == null) { topMargin = 0 }
    let createTemplate = window["createTemplate_" + template]({
        chartID: chartID, chartTitle: chartTitle, chartDescription: chartDescription,
        chartSources: chartSources, topMargin: topMargin, pathToData: pathToData
    });
    document.getElementById(`chart-${chartID}`).innerHTML = createTemplate;

    // Render chart in main area
    renderFunc(`#chart-canvas-${chartID}`)

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

        // Render chart in modal content
        renderFunc(`#chart-modal-content-${chartID}`)

    };
}
// Button areas
// ------------

function toggleArea(button, areaID, chartID) {
    var shareArea = document.getElementById(`chart-${chartID}-${areaID}-btns`)
    if (button.value == "OFF") {
        button.value = "ON";
        shareArea.style.display = "block";
    } else {
        button.value = "OFF";
        shareArea.style.display = "none";
    }
}

function togglePopover(chartTitle,chartSources) {
    popover = document.getElementById(`Popover-${chartTitle}`);

    if (chartSources != null) {
        copyChartURL(chartSources, true)
    }
    if (popover.style.display == "none" || popover.style.display == "") {
        popover.style.display = "block";
        popover.style.visibility = "visible";
    } else {
        popover.style.display = "none";
        popover.style.visibility = "hidden";
    }

}


// Share functions
// ---------------


function shareChartTwitter(chartID) {
    var url = window.location.href.split('?')[0];
    var text = `Check out this chart on Global Inequality:`;
    var hashtags = "globalinequality,inequality,global,globalinequalitycharts";
    window.open(`https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}&url=${url}?chart=${chartID}`, "_blank");
}

function copyChartURL(chartID, boolean) {
    if (boolean == true){
        var url = chartID
    } else {
        var url = window.location.href.split('?')[0] + `?chart=${chartID}`;
    }
    console.log(url)
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

// todo fb share button + other social media

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
    };

    // Close modal by clicking on grey area
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.getElementById("chart-modal-box").innerHTML = "";
        }
    };
}, false);
