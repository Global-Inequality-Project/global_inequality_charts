<?php
/*
Plugin Name: Globalinequalities Charts
Plugin URI:  https://globalinequality.org/ 
Description: A wp plugin to add a divi/gutenberg block for showing global inequality charts
Version:     1.0.0
Author:      Aaron Kimmig and Leon Beccard from convive.io
Author URI:  https://www.convive.io/
License:     MIT
License URI: https://opensource.org/licenses/MIT
Text Domain: glich-globalinequalities-charts
Domain Path: /languages

Copyright (c) 2022 Joël Foramitti, Aaron Kimmig, Leon Beccard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


if ( ! function_exists( 'glich_initialize_extension' ) ):
/**
 * Creates the extension's main class instance.
 *
 * @since 1.0.0
 */
function glich_initialize_extension() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/GlobalinequalitiesCharts.php';
}
add_action( 'divi_extensions_init', 'glich_initialize_extension' );
endif;
