<?php
/**
 * Plugin Name: Checkout Plugins - Stripe for WooCommerce
 * Plugin URI: https://www.checkoutplugins.com/
 * Description: Stripe for WooCommerce delivers a simple, secure way to accept credit card payments in your WooCommerce store. Reduce payment friction and boost conversions using this free plugin!
 * Version: 1.11.2
 * Author: Checkout Plugins
 * Author URI: https://checkoutplugins.com/
 * License: GPLv2 or later
 * Text Domain: checkout-plugins-stripe-woo
 * WC requires at least: 3.0
 * WC tested up to: 9.1.4
 *
 * @package checkout-plugins-stripe-woo
 * Woo: 18734005366527:0adf7f596de77d3ec21b1b64076fb6f4
 */

/**
 * Set constants
 */

define( 'CPSW_FILE', __FILE__ );
define( 'CPSW_BASE', plugin_basename( CPSW_FILE ) );
define( 'CPSW_DIR', plugin_dir_path( CPSW_FILE ) );
define( 'CPSW_URL', plugins_url( '/', CPSW_FILE ) );
define( 'CPSW_VERSION', '1.11.2' );

require_once 'autoloader.php';
