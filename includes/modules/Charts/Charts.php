<?php

static $debug = false;

class GLICH_Charts extends ET_Builder_Module
{

	public $slug       = 'glich_charts';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://globalinequality.org/ ',
		'author'     => 'Aaron Kimmig and Leon Beccard from convive.io',
		'author_uri' => 'https://www.convive.io/',
	);

	// initialise the module
	public function init()
	{
		$this->name = esc_html__('Global Inequality Charts', 'glich-global_inequalitiy_charts');
	}

	private function console_log($output, $with_script_tags = true)
	{
		global $debug;
		if ($debug) {
			$js_code = 'console.log("[global inequality charts]",' . json_encode($output, JSON_HEX_TAG) .
				');';
			if ($with_script_tags) {
				$js_code = '<script>' . $js_code . '</script>';
			}
			echo $js_code;
		}
	}

	// get the fields for the module in the builder
	public function get_fields()
	{
		$directory = plugin_dir_path(__FILE__) . "../../../charts";
		$paths = list_files($directory, 1);
		$options = array();

		foreach ($paths as $path) {
			$chart_id = basename($path);
			if (is_file($path . "/" . $chart_id . ".json")) {
				$chart_config_file = file_get_contents($path . "/" . $chart_id . ".json");
				$chart_json = json_decode($chart_config_file, true);
				if ($chart_json === null) {
					// deal with error...
					$this->console_log("failed to parse json for chart " . $path . $chart_id . ".json");
				} else {
					$category = esc_html__($chart_json["category"], 'dvmm-divi-mad-menu');
					$options[$category][$chart_id] =  esc_html__($chart_json["title"], 'dvmm-divi-mad-menu');
				}
			}
			
		}
		// sort charts by category and Name
		foreach ($options as $option =>$value){
			asort($value);
			$options[$option] = $value; 
		}
		ksort($options);
		$fields = array(
			'charttype' => array(
				'label'           => esc_html__('Charttype', 'glich-global_inequalitiy_charts'),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => $options,
				'description'     => esc_html__('the charttype entered here will appear inside the module.', 'glich-global_inequalitiy_charts'),
				'toggle_slug'     => 'main_content'
			),
		);

		return $fields;
	}
	
	public function get_advanced_fields_config() {
		return array(
			'background'     => false,
			'borders'        => false,
			'box_shadow'     => false,
			'button'         => false,
			'filters'        => false,
			'fonts'          => false,
			'margin_padding' => false,
			'max_width'      => false,
			'transform'		 => false,
			'animation'		 => false,
		);
	}

	public function render($attrs, $content = null, $render_slug)
	{
		$ctype = $this->props['charttype'];
		$charttype_js_path = '../../../charts/' . $ctype . '/' . $ctype . '.js';
		if (file_exists(plugin_dir_path(__FILE__) . $charttype_js_path)) {
			$this->load_libraries($ctype);
			// load chart js

			$charttype_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $charttype_js_path));

			wp_enqueue_script('chartinterface_js_' . $ctype, plugins_url($charttype_js_path, __FILE__), array(), $charttype_js_ver);
			$this->console_log("render " . $ctype);

			// render chart
			return sprintf('<br/><div id="chart-%1$s"></div>', $ctype);
		} else {
			return sprintf('<br/><div id="error-chart-%1$s" style="border:3px solid black; padding: 30px;">Global Inequality Chart: Chart type is not supported: %1$s</div>', $ctype);
		}
	}

	// load the libraries for the chart depending on the libraries section of the config
	private function load_libraries($id)
	{
		$path = plugin_dir_path(__FILE__) . "../../../charts/" . $id . "/" . $id . ".json";

		$chart_config_file = file_get_contents($path);
		$chart_json = json_decode($chart_config_file, true);
		if ($chart_json === null) {
			// deal with error...
			$this->console_log("failed to parse json for chart " . $path);
		} else {
			if (isset($chart_json["libraries"]["apexcharts"]) && $chart_json["libraries"]["apexcharts"]) {
				$this->console_log("loading apexcharts");
				$apexcharts_js_path = '../../../node_modules/apexcharts/dist/apexcharts.min.js';
				$apexcharts_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $apexcharts_js_path));
				wp_enqueue_script('apexcharts_js', plugins_url($apexcharts_js_path, __FILE__), array(), $apexcharts_js_ver);
			}
			if (isset($chart_json["libraries"]["d3js"]) && $chart_json["libraries"]["d3js"]) {
				$d3_path = '../../../node_modules/d3/dist/d3.js';
				wp_enqueue_script('d3_js',  plugins_url($d3_path, __FILE__));
			}
			if (isset($chart_json["libraries"]["chartjs"]) && $chart_json["libraries"]["chartjs"]) {
				$chartjs_path = '../../../node_modules/chart.js/dist/chart.min.js';
				wp_enqueue_script('chartjs',  plugins_url($chartjs_path, __FILE__));
			}
			if (isset($chart_json["libraries"]["chartjs-sankey"]) && $chart_json["libraries"]["chartjs-sankey"]) {
				$chartjs_sankey_path = '../../../node_modules/chartjs-chart-sankey/dist/chartjs-chart-sankey.min.js';
				wp_enqueue_script('chartjs-sankey',  plugins_url($chartjs_sankey_path, __FILE__));
			}
			if (isset($chart_json["libraries"]["svgmap"]) && $chart_json["libraries"]["svgmap"]) {
				$svgmap_path = '../../../node_modules/svgmap/dist/svgMap.min.js';
				$svgmap_css_path = '../../../node_modules/svgmap/dist/svgMap.min.css';
				$svg_pan_zoom_path = '../../../node_modules/svg-pan-zoom/dist/svg-pan-zoom.min.js';
				wp_enqueue_script('svg-pan-zoom_js',  plugins_url($svg_pan_zoom_path, __FILE__));
				wp_enqueue_script('svgmap_js',  plugins_url($svgmap_path, __FILE__));
				wp_enqueue_style('svgmap_css',  plugins_url($svgmap_css_path, __FILE__));
			}
			// load the chart utils js, always required for schema version < 2
			if (
				isset($chart_json["libraries"]["chartutils"])
				&& $chart_json["libraries"]["chartutils"]
			) {
				$chartutils_js_path = '../../../assets/js/chartutils.js';
				$chartutils_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $chartutils_js_path));
				wp_enqueue_script('chartutils_js', plugins_url($chartutils_js_path, __FILE__), array(), $chartutils_js_ver);
			}
			$template = "main";
			if (isset($chart_json["template"]) &&  $chart_json["template"] != "") {
				$template = $chart_json["template"];
			}
			$template_js_path = '../../../assets/js/templates/' . $template . '.js';
			$template_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $template_js_path));
			wp_enqueue_script('template' . $template . '_js', plugins_url($template_js_path, __FILE__), array(), $template_js_ver);
		}
		// load the chart styles
		$chart_css_path = '/../../../charts/' . $id . '/' . $id . '.css';
		if (is_file(plugin_dir_path(__FILE__) . $chart_css_path)) {
			$chart_css_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $chart_css_path));
			wp_enqueue_style('chart_css_' . $id, plugins_url($chart_css_path, __FILE__), array(), $chart_css_ver);
		}
	}
}

new GLICH_Charts;

/**
 * Never worry about cache again!
 */
function load_charts_scripts($hook)
{
	set_url();

	// create my own version codes
	$chartinterface_js_path = '../../../assets/js/chartinterface.js';
	$chartinterface_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $chartinterface_js_path));
	$chartutils_js_path = '../../../assets/js/chartutils.js';
	$chartutils_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $chartinterface_js_path));
	$html2canvas_js_path = '../../../node_modules/html2canvas/dist/html2canvas.min.js';
	$html2canvas_js_ver = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $html2canvas_js_path));

	// enqueue scripts
	wp_enqueue_script('chartinterface_js', plugins_url($chartinterface_js_path, __FILE__), array(), $chartinterface_js_ver);
	wp_enqueue_script('chartutils_js', plugins_url($chartutils_js_path, __FILE__), array(), $chartutils_js_ver);
	// load html2canvas for screenshot
	wp_enqueue_script('html2canvas_js_path', plugins_url($html2canvas_js_path, __FILE__), array(), $html2canvas_js_ver);
}
add_action('wp_enqueue_scripts', 'load_charts_scripts');

// set the url for the charts
function set_url()
{
	$js_code = '<script>window.wp_url="' . get_home_url() . '";</script>';
	echo $js_code;
}
// add chart-modal-wrapper div to footer
if (!function_exists('add_chart_modal_wrapper')) {
	function add_chart_modal_wrapper()
	{

		echo '<div id="chart-modal-wrapper"></div>';
	}
	add_action('wp_footer', 'add_chart_modal_wrapper', 10);
}
// remove yoast seo open tags for shared charts
if (!function_exists('filter_presenters')) {
	add_filter('wpseo_frontend_presenter_classes', 'filter_presenters');

	function filter_presenters($filter)

	{
		if (!is_singular() || !array_key_exists("chart", $_GET)){
			return $filter;

		} //if it is not a post or a page and if it is not a chart

		$id = $_GET["chart"];
		$id = htmlspecialchars($id, ENT_QUOTES, 'UTF-8');
		$id = str_replace("/", "", $id);
		$id = str_replace(".", "", $id);
		$id = str_replace("chart-", "", $id);
		if ($id == "") {
			// if no chart id is set, return the original filter
			return $filter;
		}
		if (($key = array_search('Yoast\WP\SEO\Presenters\Twitter\Image_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}
		if (($key = array_search('Yoast\WP\SEO\Presenters\Open_Graph\Image_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}
		if (($key = array_search('Yoast\WP\SEO\Presenters\Open_Graph\Url_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}
		if (($key = array_search('Yoast\WP\SEO\Presenters\Open_Graph\Description_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}
		if (($key = array_search('Yoast\WP\SEO\Presenters\Twitter\Description_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}

		if (($key = array_search('Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}

		if (($key = array_search('Yoast\WP\SEO\Presenters\Twitter\Card_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}

		if (($key = array_search('Yoast\WP\SEO\Presenters\Twitter\Label_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}

		if (($key = array_search('Yoast\WP\SEO\Presenters\Slack\Enhanced_Data_Presenter', $filter)) !== false) {
			unset($filter[$key]);
		}
		return $filter;
	}
}
/**
 * Add open graph tags to the header but only once!
 */
if (!function_exists('add_open_graph_tags')) {
	function add_open_graph_tags($id)
	{
		global $debug;
		static $already_run = false;
		if (!$already_run) {

			// PLACE YOUR CODE BELOW THIS LINE
			if (!is_singular() || !array_key_exists("chart", $_GET)) //if it is not a post or a page
				return;
			$id = $_GET["chart"];
			$id = htmlspecialchars($id, ENT_QUOTES, 'UTF-8');
			$id = str_replace("/", "", $id);
			$id = str_replace(".", "", $id);
			$id = str_replace("chart-", "", $id);
			if ($id == "") {
				if ($debug)	echo '<script>console.log("add open graph for ' . $id . ' not found");</script>';

				return;
			}
			if ($debug) echo '<script>console.log("add open graph for ' . $id . '");</script>';

			// load chart config for open graph tags
			$charttype_json_path = plugin_dir_path(__FILE__) . '../../../charts/' . $id . '/' . $id . '.json';
			if (!file_exists($charttype_json_path)) {
				echo '<script>console.log("add open graph for ' . $charttype_json_path . ' not found");</script>';
				return;
			}
			$chart_json = file_get_contents($charttype_json_path);

			// parse json
			$chart_json = json_decode($chart_json, true);

			// add open graph tags
			if ($debug) echo '<script>console.log("add open graph ' . $id . '");</script>';

			echo '<meta name="twitter:card" content="summary_large_image" />' . PHP_EOL; // twitter card

			if (isset($chart_json['title']) && $chart_json['title'] != "") {
				echo '<meta property="og:title" content="' . $chart_json['title'] . '" />' . PHP_EOL;
			} else {
				echo '<meta property="og:title" content="' . $id . '"/>';
			}
			echo '<meta property="og:type" content="article" />' . PHP_EOL;
			$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
			$url = $protocol . $_SERVER['HTTP_HOST'];
			echo '<meta property="og:url" content="' . $url .  $_SERVER['REQUEST_URI'] . '" />' . PHP_EOL;
			$chart_img_path = plugin_dir_path(__FILE__) . '../../../charts/' . $id . '/' . $id . '.png';

			$image_url = "";
			// try to find the image in the chart folder
			if (file_exists($chart_img_path)) {
				$image_url = plugins_url("", __FILE__) . '/../../../charts/' . $id . '/' . $id . '.png';
			} else {
				$image_url = plugins_url("", __FILE__) . '/../../../assets/img/global_inequality_share.png';
			}
			echo '<meta property="og:image" content="' . $image_url . '" />' . PHP_EOL;
			echo '<meta name="twitter:image" content="' . $image_url . '" />' . PHP_EOL;

			// description was added in schema version 2
			if (isset($chart_json['description'])  && $chart_json['description'] != "") {
				echo '<meta property="og:description" content="' . $chart_json['description'] . '" />' . PHP_EOL;
				echo '<meta property="twitter:description" content="' . $chart_json['description'] . '" />' . PHP_EOL;
			}


			$already_run = true;
		}
	}
	add_action('wp_head', 'add_open_graph_tags', 5);
}
