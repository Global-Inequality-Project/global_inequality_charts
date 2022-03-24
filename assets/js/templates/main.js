function createTemplate_main({ chartID, chartTitle, chartDescription, customTools }) {

var tmpl =`
<div class="chart-interface chart-template-main">

  <div class="chart-col-left">

    <div class="chart-title">
      <div class="chart-title-main">
        <h1>${chartTitle}</h1>
        ${chartDescription}
      </div>
      <div class="chart-title-bars">
        <button class="chart-title-btn" onclick="toggleChartArea(this, 'all', '${chartID}')" value="OFF">
          <i class="fa-solid fa-bars"></i>
        </button> 
      </div>
    </div>
    
    <div class="chart-all-btns" id="chart-${chartID}-all-btns">
        
        ${customTools}

        <button class="chart-btn chart-expand-btn" id="chart-expand-btn-${chartID}">
          <i class="fas fa-expand-alt"></i>Expand
        </button>

        <button onclick="toggleChartArea(this, 'share', '${chartID}')" value="OFF" class="chart-btn">
          <i class="fas fa-share"></i>Share
        </button>

        <div class="chart-share-btns" id="chart-${chartID}-share-btns">

          <button class="chart-btn" onclick="shareChartTwitter('${chartID}')">
            <i class="fa fa-twitter"></i>Twitter
          </button> 

          <button class="chart-btn">
            <i class="fas fa-facebook"></i>Facebook
          </button>

          <button class="chart-btn" onclick="copyChartURL('${chartID}')">
            <i class="fas fa-link"></i>Copy link
          </button> 

        </div> 

        <button onclick="toggleChartArea(this, 'save', '${chartID}')" value="OFF"  class="chart-btn">
          <i class="fas fa-arrow-alt-circle-down"></i>Download
        </button>

        <div class="chart-share-btns" id="chart-${chartID}-save-btns">

            <button class="chart-btn">
                <i class="fas fa-image"></i>Image
            </button>

            <a href="https://github.com/Global-Inequality-Project/global_inequality_charts/tree/main/charts/${chartID}" target="_blank">
            <button class="chart-btn">
                <i class="fa-brands fa-github"></i>Data
            </button>
            </a>

        </div> 

        <button value="OFF"  class="chart-btn">
                <i class="fa-solid fa-file-lines"></i>Sources
        </button>
    </div>
  </div>

  <div class="chart-col-right">
    <div class="chart-box-outer">
      <div class="chart-box-inner">
        <div id="chart-canvas-${chartID}">
        </div>
      </div>
    </div>
  </div>

</div>`
return tmpl;
}