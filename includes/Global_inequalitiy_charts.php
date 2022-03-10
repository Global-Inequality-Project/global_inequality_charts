<?php

class GLICH_Global_inequality_charts extends DiviExtension
{

	/**
	 * The gettext domain for the extension's translations.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $gettext_domain = 'glich-global_inequalitiy_charts';

	/**
	 * The extension's WP Plugin name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $name = 'global_inequalitiy_charts';

	/**
	 * The extension's version
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $version = '1.0.0';

	/**
	 * GLICH_Global_inequality_charts constructor.
	 *
	 * @param string $name
	 * @param array  $args
	 */
	public function __construct($name = 'global_inequalitiy_charts', $args = array())
	{
		$this->plugin_dir     = plugin_dir_path(__FILE__);
		$this->plugin_dir_url = plugin_dir_url($this->plugin_dir);

		parent::__construct($name, $args);
		// create my own version codes
		$fontawesome_path = '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

		// enqueue scripts
		wp_enqueue_style('fontawesome', plugins_url($fontawesome_path, __FILE__), array());
	}
}

new GLICH_Global_inequality_charts;
