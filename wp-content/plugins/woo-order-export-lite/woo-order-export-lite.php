<?php
/**
 * Plugin Name: Advanced Order Export For WooCommerce
 * Plugin URI:
 * Description: Export WooCommerce orders to Excel/CSV/XML/JSON/PDF/TSV
 * Author: AlgolPlus
 * Author URI: https://algolplus.com/
 * Version: 4.0.3
 * Text Domain: woo-order-export-lite
 * Domain Path: /i18n/languages/
 * WC requires at least: 4.0.0
 * WC tested up to: 9.9
 *
 * Copyright: (c) 2015 AlgolPlus LLC. (algol.plus@gmail.com)
 *
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package     woo-order-export-lite
 * @author      AlgolPlus LLC
 * @Category    Plugin
 * @copyright   Copyright (c) 2015 AlgolPlus LLC
 * @license     https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
} // Exit if accessed directly

// declare compatibility on startup
use Automattic\WooCommerce\Utilities\FeaturesUtil;
add_action( 'before_woocommerce_init', function() {
	if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
		FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );

//Stop if another version is active!
if ( class_exists( 'WC_Order_Export_Admin' ) ) {
	add_action( 'admin_notices', function () {
			?>
            <div class="notice notice-warning is-dismissible">
                <p><?php
                    echo sprintf(
					/* translators: href link to Plugins page */
                    esc_html__( 'Please, %1$s deactivate %2$s Free version of Advanced Order Export For WooCommerce!','woo-order-export-lite' ),
					 '<a href="plugins.php">', '</a>' );
					?>
				</p>
            </div>
			<?php
	});
	return;
}

if ( ! defined( 'WOE_VERSION' ) ) {
	define( 'WOE_VERSION', '4.0.3' );
	define( 'WOE_MIN_PHP_VERSION', '8.1' );
	define( 'WOE_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
	define( 'WOE_PLUGIN_BASEPATH', dirname( __FILE__ ) );
    define( 'WOE_PLUGIN_PATH', __FILE__  );
}

$extension_file = WOE_PLUGIN_BASEPATH.'/pro_version/pre-loader.php';
if ( file_exists( $extension_file ) ) {
    include_once $extension_file;
}

// a small function to check startup conditions
if ( ! function_exists( "woe_check_running_options" ) ) {
    function woe_check_running_options() {
		$is_backend = is_admin();
		return apply_filters('woe_check_running_options', $is_backend);
    }
}

if ( ! woe_check_running_options() ) {
    return;
} //don't load for frontend !

include 'classes/admin/tabs/ajax/trait-wc-order-export-ajax-helpers.php';
include 'classes/admin/tabs/ajax/trait-wc-order-export-admin-tab-abstract-ajax-filters.php';
include 'classes/admin/tabs/ajax/trait-wc-order-export-admin-tab-abstract-ajax-export.php';
include 'classes/admin/tabs/ajax/trait-wc-order-export-admin-tab-abstract-ajax.php';
include 'classes/admin/tabs/ajax/class-wc-order-export-ajax.php';
include 'classes/admin/tabs/class-wc-order-export-admin-tab-abstract.php';
include 'classes/admin/tabs/class-wc-order-export-admin-tab-export-now.php';
include 'classes/admin/tabs/class-wc-order-export-admin-tab-help.php';
include 'classes/admin/tabs/class-wc-order-export-admin-tab-profiles.php';
include 'classes/admin/tabs/class-wc-order-export-admin-tab-schedule-jobs.php';
include 'classes/admin/tabs/class-wc-order-export-admin-tab-status-change-jobs.php';
include 'classes/admin/tabs/class-wc-order-export-admin-tab-tools.php';
include 'classes/admin/class-wc-order-export-settings.php';
include 'classes/admin/class-wc-order-export-manage.php';
include 'classes/admin/class-wc-order-export-labels.php';
include 'classes/core/class-wc-order-export-engine.php';
include 'classes/core/trait-woe-core-extractor.php';
include 'classes/core/trait-woe-core-extractor-ui.php';
if ( get_option("woocommerce_custom_orders_table_enabled") == 'yes') {
    include 'classes/core-hpos/class-wc-order-export-data-extractor.php';
    include 'classes/core-hpos/class-wc-order-export-data-extractor-ui.php';
} else {
    include 'classes/core/class-wc-order-export-data-extractor.php';
    include 'classes/core/class-wc-order-export-data-extractor-ui.php';
}
include 'classes/class-wc-order-export-admin.php';
$extension_file = WOE_PLUGIN_BASEPATH.'/pro_version/loader.php';
if ( file_exists( $extension_file ) ) {
    include_once $extension_file;
}

$wc_order_export = new WC_Order_Export_Admin();
register_deactivation_hook( __FILE__, array( $wc_order_export, 'deactivate' ) );

// fight with ugly themes which add empty lines
if ( $wc_order_export->must_run_ajax_methods() AND ! ob_get_level() ) {
    ob_start();
}

//Done
