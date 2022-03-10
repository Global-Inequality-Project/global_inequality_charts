// Global objects
window.chart_data = {}
window.charts_path = window.wp_url + "/wp-content/plugins/global_inequality_charts/charts"


// Chart Interface
// ---------------
function createChartInterface({ chartID, chartTitle, chartDescription, chartSources, renderFunc, pathToData, topMargin }) {


    if (pathToData == null) { pathToData = `${window.charts_path}/${chartID}/${chartID}.csv` }
    if (topMargin == null) { topMargin = 0 }

    document.getElementById(`chart-${chartID}`).innerHTML += `
    <div class="chart-interface">
    <div class="et_pb_row et_pb_row_0 et_pb_row_1-4_3-4">

    <div class="et_pb_column et_pb_column_1_4 et_pb_column_0  et_pb_css_mix_blend_mode_passthrough">

        <div class="chart-title">
            <h1>${chartTitle}</h1>
            ${chartDescription}
        </div>

        <button class="chart-btn chart-expand-btn" id="chart-expand-btn-${chartID}">
            <i class="fas fa-expand-alt"></i>Expand
        </button>


        <button onclick="toggleArea(this, 'share', '${chartID}')" value="OFF" class="chart-btn">
        <i class="fas fa-share"></i>Share
        </button>

        <div class="chart-share-btns" id="chart-${chartID}-share-btns">

            <button class="chart-btn" onclick="shareChartTwitter('${chartID}')">
                <i class="fa fa-twitter"></i>Twitter
            </button>

            <button class="chart-btn"><i class="fas fa-facebook"></i>Facebook</button>

            <button class="chart-btn" onclick="copyChartURL('${chartID}')">
                <i class="fas fa-link"></i>Copy link
            </button>

        </div>

        <button onclick="toggleArea(this, 'save', '${chartID}')" value="OFF"  class="chart-btn">
                <i class="fas fa-arrow-alt-circle-down"></i>Download
        </button>

        <div class="chart-share-btns" id="chart-${chartID}-save-btns">

            <a href="${pathToData}">
            <button class="chart-btn">
                <i class="fas fa-arrow-alt-circle-down"></i>Data (csv)
            </button>
            </a>

            <button onclick="downloadImage('${chartID}', '${chartTitle}', '${chartDescription}', '${chartSources}')" class="chart-btn">
            <i class="fas fa-arrow-alt-circle-down"></i>Picture (png)
            </button>

            <div class="downloadImage" id="downloadImage-${chartID}" >

            </div>

        </div>

        <button value="OFF"  class="chart-btn">
                <i class="fas fa-info"></i>Sources
        </button>




    </div>

    <div class="et_pb_column et_pb_column_3_4 et_pb_column_1  et_pb_css_mix_blend_mode_passthrough et-last-child">
    <div class="chart-box-outer" style="margin-top: ${topMargin}">
    <div class="chart-box-inner">
    <div id="chart-canvas-${chartID}">
    </div>
    </div>

    </div>
    </div>
    </div>`

    // Render chart in main area
    renderFunc(`#chart-canvas-${chartID}`)

    // If chart is specified in url, scroll to it
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chart = urlParams.get('chart')

    if ( chart === chartID) {
        // Scroll to chart after chart is ready
        setTimeout(function(){
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


// Share functions
// ---------------


function shareChartTwitter(chartID) {
    var url = window.location.href.split('?')[0];
    var text = `Check out this chart on Global Inequality:`;
    var hashtags = "globalinequality,inequality,global,globalinequalitycharts";
    window.open(`https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}&url=${url}?chart=${chartID}`, "_blank");
}

function copyChartURL(chartID) {
    const url = window.location.href.split('?')[0]+`?chart=${chartID}`;
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

// Download image functions
// ---------------

function createImage(chartID, chartTitle, chartDescription, chartSources) {

    var chart = document.getElementById(`chart-canvas-${chartID}`);
    const chart_clone = chart.cloneNode(true);
    var logo = document.getElementsByClassName('et_pb_menu__logo');
    const logo_clone = logo[0].cloneNode(true);

    document.getElementById(`downloadImage-${chartID}`).appendChild(logo_clone);

    document.getElementById(`downloadImage-${chartID}`).innerHTML +=
              `<h2>${chartTitle}</h2>`;

    document.getElementById(`downloadImage-${chartID}`).innerHTML +=
              `<h4>${chartDescription}</h4>`;

    document.getElementById(`downloadImage-${chartID}`).appendChild(chart_clone);

    document.getElementById(`downloadImage-${chartID}`).innerHTML +=
              `Sources: ${chartSources} <br>`;

    document.getElementById(`downloadImage-${chartID}`).innerHTML +=
              `URL: ${window.location.href}#chart-${chartID}`;

}

function downloadImage(chartID, chartTitle, chartDescription, chartSources) {

    createImage(chartID, chartTitle, chartDescription, chartSources)

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


