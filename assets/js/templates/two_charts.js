function createTemplate_two_charts({ chartID, chartTitle, chartDescription, chartSources, customTools }) {
    var tmpl =`
    <div class="chart-interface chart-template-two_charts" id="chart-wrapper-${chartID}">

      <div class="chart-col-above">

        <div class="chart-title">
          <div class="chart-title-two_charts">
            <h1>${chartTitle}</h1>
            <p class="chart-description-two_charts" id="two-charts-description-${chartID}">${chartDescription}</p>
          </div>
          <div class="chart-title-bars">
            <button class="chart-title-btn" onclick="toggleChartArea(this, 'all', '${chartID}', true)" value="OFF">
              <i class="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>

        <div class="chart-all-btns" id="chart-${chartID}-all-btns">

            ${customTools}

            <button class="chart-btn chart-expand-btn" id="chart-expand-btn-${chartID}-2">
              <i class="fas fa-expand-alt"></i>Expand
            </button>

            <button onclick="toggleChartArea(this, 'share', '${chartID}')" value="OFF" class="chart-btn">
              <i class="fas fa-share"></i>Share
            </button>

            <div class="chart-btn-area" id="chart-${chartID}-share-btns">

              <button class="chart-btn" onclick="shareChartTwitter('${chartID}')">
                <i class="fa-brands fa-twitter"></i>Twitter
              </button>

              <button class="chart-btn" onclick="shareChartFacebook('${chartID}')">
                <i class="fa-brands fa-facebook"></i>Facebook
              </button>

              <button class="chart-btn" onclick="copyChartURL('${chartID}')">
                <i class="fas fa-link"></i>Copy link
              </button>

            </div>

            <button onclick="toggleChartArea(this, 'save', '${chartID}')" value="OFF" class="chart-btn">
              <i class="fas fa-arrow-alt-circle-down"></i>Download
            </button>

            <div class="chart-btn-area" id="chart-${chartID}-save-btns">

                <button onclick="downloadImage('${chartID}', '${chartTitle}', '${chartDescription}', true)" class="chart-btn">
                    <i class="fas fa-image"></i>Image
                </button>

                <a href="https://github.com/Global-Inequality-Project/global_inequality_charts/tree/main/charts/${chartID}" target="_blank">
                <button class="chart-btn">
                    <i class="fa-brands fa-github"></i>Data
                </button>
                </a>

                <div class="downloadImage" id="downloadImage-${chartID}"></div>

            </div>

            <button class="chart-btn" id="chart-btn-sources-${chartID}" onclick="toggleChartArea(this, 'sources', '${chartID}')" value="OFF">
                    <i class="fa-solid fa-file-lines"></i>Sources
            </button>

            <div class="chart-sources-popover" role="tooltip" id="chart-${chartID}-sources-btns">
                <section class="chart-sources-popover-title">${chartSources}</section>
                <button class="chart-btn" onclick="copySources('${chartID}', '${chartSources}')">
                    <i class="fas fa-link"></i>Copy sources
                </button>
            </div>



        </div>
      </div>
    <div class="chart-col-below">
        <div class="chart-col-two_charts">
          <div class="chart-box-outer">
            <div class="chart-box-inner">
              <div id="chart-canvas-${chartID}">
              </div>
            </div>
          </div>
        </div>

      <div class="chart-col-two_charts">
        <div class="chart-box-outer">
          <div class="chart-box-inner">
            <div id="chart-canvas-${chartID}-2">
            </div>
          </div>
        </div>
      </div>
    </div>




</div>`
return tmpl;
}