<?php
/*
Plugin Name: Globalinequalities Charts
Plugin URI:  https://globalinequality.org/ 
Description: A wp plugin to add a divi/gutenberg block for showing global inequality charts
Version:     1.0.0
Author:      Aaron Kimmig and Leon Beccard from convive.io
Author URI:  https://www.convive.io/
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: glich-globalinequalities-charts
Domain Path: /languages

Globalinequalities Charts is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

Globalinequalities Charts is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Globalinequalities Charts. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
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
