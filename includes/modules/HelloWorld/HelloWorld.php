<?php

class GLICH_HelloWorld extends ET_Builder_Module {

	public $slug       = 'glich_hello_world';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://globalinequality.org/ ',
		'author'     => 'Aaron Kimmig and Leon Beccard from convive.io',
		'author_uri' => 'https://www.convive.io/',
	);

	public function init() {
		$this->name = esc_html__( 'Hello World', 'glich-globalinequalities-charts' );
	}

	public function get_fields() {
		return array(
			'content' => array(
				'label'           => esc_html__( 'Content', 'glich-globalinequalities-charts' ),
				'type'            => 'tiny_mce',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Content entered here will appear inside the module.', 'glich-globalinequalities-charts' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		return sprintf( '<h1>%1$s</h1>', $this->props['content'] );
	}
}

new GLICH_HelloWorld;
