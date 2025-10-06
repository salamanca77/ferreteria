<?php
/**
 * Plugins list for integrations.
 *
 * @author  YITH <plugins@yithemes.com>
 * @package YITH\POS\Classes
 */

defined( 'YITH_POS' ) || exit;

return array(
	'customize-my-account-page' => array(
		'show' => false,
	),
	'pdf-invoice'               => array(
		'show'            => false,
		'premium'         => 'YITH_YWPI_PREMIUM',
		'version'         => 'YITH_YWPI_VERSION',
		'min_version'     => '3.7.0',
		'version_compare' => '>=',
	),
	'wpml'                      => array(
		'show' => false,
	),
);
