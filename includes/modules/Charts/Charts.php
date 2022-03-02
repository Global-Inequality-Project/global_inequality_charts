<?php

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
		$this->set_url();
		$this->name = esc_html__('Global Inequality Charts', 'glich-global_inequalitiy_charts');
	}

	private function console_log($output, $with_script_tags = true)
	{
		$js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) .
			');';
		if ($with_script_tags) {
			$js_code = '<script>' . $js_code . '</script>';
		}
		echo $js_code;
	}
	private function set_url()
	{
		$js_code = '<script>window.wp_url="'.get_home_url().'";</script>';
		echo $js_code;
	}


	// get the fields for the module in the builder
	public function get_fields()
	{
		$directory = plugin_dir_path(__FILE__) . "../../../charts";
		$paths = list_files($directory, 1);
		$options = array();
		foreach ($paths as $path) {
			$chart_id = basename($path);
			if(is_file($path . "/" . $chart_id . ".json")){
				$chart_config_file = file_get_contents($path . "/" . $chart_id . ".json");
				$chart_json = json_decode($chart_config_file, true);
				if ($chart_json === null) {
					// deal with error...
					$this->console_log("failed to parse json for chart " . $path . $chart_id . ".json");
				} else {
					$options[$chart_id] =  esc_html__($chart_json["name"], 'dvmm-divi-mad-menu');
				}
			}

		}

		return array(
			'charttype' => array(
				'label'           => esc_html__('Charttype', 'glich-global_inequalitiy_charts'),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => $options,
				'description'     => esc_html__('the charttype entered here will appear inside the module.', 'glich-global_inequalitiy_charts'),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render($attrs, $content = null, $render_slug)
	{
		$ctype = $this->props['charttype'];
		$this->load_libraries($ctype);
		// load chart js
		$charttype_js_path = '../../../charts/' . $ctype . '/' . $ctype . '.js';
		$charttype_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $charttype_js_path));

		wp_enqueue_script('chartinterface_js_' . $ctype, plugins_url($charttype_js_path, __FILE__), array(), $charttype_js_ver);
		// render chart
		return sprintf('<br/><div id="chart-%1$s"></div>', $ctype, $ctype);
	}

	// load the libraries for the chart depending on the libraries section of the config
	private function load_libraries($id){
		$path = plugin_dir_path(__FILE__) . "../../../charts/".$id. "/" . $id . ".json";
		$chart_config_file = file_get_contents($path);
		$chart_json = json_decode($chart_config_file, true);
		if ($chart_json === null) {
			// deal with error...
			$this->console_log("failed to parse json for chart " . $path);
		} else {
			if($chart_json["libraries"]["apexcharts"]){
				$this->console_log("loading apexcharts");
				$apexcharts_js_path = '../../../node_modules/apexcharts/dist/apexcharts.min.js';
				$apexcharts_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $apexcharts_js_path));
				wp_enqueue_script('apexcharts_js', plugins_url($apexcharts_js_path, __FILE__), array(), $apexcharts_js_ver);
				$this->console_log("loading apexcharts2");

			}
			if($chart_json["libraries"]["d3js"]){
				wp_enqueue_script('d3_js', "https://d3js.org/d3.v4.min.js");
			}
		}
	}
}

new GLICH_Charts;

/**
 * Never worry about cache again!
 */
function load_charts_scripts($hook)
{

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
	wp_enqueue_script('html2canvas_js_path', plugins_url($html2canvas_js_path, __FILE__), array(), $html2canvas_js_ver);
}
add_action('wp_enqueue_scripts', 'load_charts_scripts');

// add chart-modal-wrapper div to footer
if (!function_exists('add_chart_modal_wrapper')) {
	function add_chart_modal_wrapper()
	{
		echo '<div id="chart-modal-wrapper"></div>';
	}
	add_action('wp_footer', 'add_chart_modal_wrapper', 100);
}
