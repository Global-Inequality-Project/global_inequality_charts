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

	public function init()
	{
		$this->name = esc_html__('Global Inequality Charts', 'glich-globalinequalities-charts');
	}

	public function get_fields()
	{
		return array(
			'charttype' => array(
				'label'           => esc_html__('Charttype', 'glich-globalinequalities-charts'),
				'type'            => 'select',
				'option_category' => 'basic_option',
				// todo: load the charts and chart-names dynamically from a folder 
				'options'         => array(
					'inequality_gdp_chg'  => esc_html__('inequality_gdp_chg', 'dvmm-divi-mad-menu'),
					'inequality_gdp_nrt_sth' => esc_html__('inequality_gdp_nrt_sth', 'dvmm-divi-mad-menu'),
					'inequality_gdp_region' => esc_html__('inequality_gdp_region', 'dvmm-divi-mad-menu'),
					'demo1' => esc_html__('demo1', 'dvmm-divi-mad-menu'),
					'demo2' => esc_html__('demo2', 'dvmm-divi-mad-menu'),
				),
				'description'     => esc_html__('the charttype entered here will appear inside the module.', 'glich-globalinequalities-charts'),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render($attrs, $content = null, $render_slug)
	{
		$ctype = $this->props['charttype'];
		// load chart js
		$charttype_js_path = '/gip_chart_interface-main/' . $ctype . '/' . $ctype . '.js';
		$charttype_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $charttype_js_path));
		wp_enqueue_script('chartinterface_js_' . $ctype, plugins_url($charttype_js_path, __FILE__), array(), $charttype_js_ver);
		// render chart
		return sprintf('<h1>%1$s</h1><br/><div id="chart-%1$s"></div>', $ctype, $ctype);
	}
}

new GLICH_Charts;

/**
 * Never worry about cache again!
 */
function load_charts_scripts($hook)
{

	// create my own version codes
	$chartinterface_js_path = '/gip_chart_interface-main/chartinterface.js';
	$chartinterface_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $chartinterface_js_path));
	$chartutils_js_path = '/gip_chart_interface-main/chartutils.js';
	$chartutils_js_ver  = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . $chartinterface_js_path));

	// enqueue scripts
	wp_enqueue_script('d3_js', "https://d3js.org/d3.v4.min.js");
	wp_enqueue_script('apexcharts_js', "https://cdn.jsdelivr.net/npm/apexcharts");
	wp_enqueue_script('chartinterface_js', plugins_url($chartinterface_js_path, __FILE__), array(), $chartinterface_js_ver);
	wp_enqueue_script('chartutils_js', plugins_url($chartutils_js_path, __FILE__), array(), $chartutils_js_ver);
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
