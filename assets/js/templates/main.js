function createTemplate_main({ chartID, chartTitle, chartDescription, chartSources, topMargin, pathToData }) {

    var tmpl =`
    <div class="chart-interface template-main">
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

            <div class="downloadImage" id="downloadImage-${chartID}"></div>

        </div>

        <button class="chart-btn" onclick="togglePopover('${chartTitle}')">
                <i class="fas fa-info"></i>Sources
        </button>

        <div class="popover" role="tooltip" id="Popover-${chartTitle}">
            <section class="popover-title">${chartSources}</section>
            <button class="chart-btn" onclick="togglePopover('${chartTitle}', '${chartSources}')">
                <i class="fas fa-link"></i>Copy source
            </button>
        </div>



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
    return tmpl;
}