<?php

namespace WeDevs\WePOS\Admin;

use WP_Query;

defined( 'ABSPATH' ) || exit;

/**
 * Coupons Class.
 *
 * For managing coupons on admin panel.
 *
 * @since 1.3.0
 *
 * @package wepos
 */
class Discounts {

    /**
     * Discount Type Key.
     *
     * @since 1.3.0
     *
     * @var string
     */
    public $discount_type_key = 'wepos_cart_discount';

    /**
     * Class Constructor.
     *
     * @since 1.3.0
     */
    public function __construct() {
        add_action( 'load-edit.php', [ $this, 'hide_discount_coupons' ] );
        add_action( 'wepos_daily_midnight_cron', [ $this, 'remove_discount_coupons' ] );
        add_filter( 'woocommerce_admin_order_item_coupon_url', [ $this, 'remove_discount_coupon_url' ], 10, 3 );
    }

    /**
     * Hide Discount Coupons from Admin Coupon List Table.
     *
     * @since 1.3.0
     *
     * @return void
     */
    public function hide_discount_coupons() {
        global $typenow;

        if ( 'shop_coupon' !== $typenow ) {
            return;
        }

        if ( ! current_user_can( 'manage_woocommerce' ) ) { // phpcs:ignore
            return;
        }

        add_action(
            'pre_get_posts',
            function ( $query ) {
                if ( ! is_admin() || ! $query->is_main_query() ) {
                    return;
                }

                $meta_query = $query->get( 'meta_query' );
                $meta_query = ! empty( $meta_query ) ? $meta_query : [];

                $meta_query[][] = [
                    'relation' => 'AND',
                    [
                        'key'     => $this->discount_type_key,
                        'compare' => 'NOT EXISTS',
                        'value'   => '',
                    ],
                ];

                $query->set( 'meta_query', $meta_query );
            }
        );

        add_filter(
            'wp_count_posts',
            function ( $counts ) {
                $coupons         = $this->get_discount_coupons();
                $total           = count( $coupons );
                $counts->publish = $counts->publish - $total;

                return $counts;
            }
        );
    }

    /**
     * Get Discount Coupons.
     *
     * @since 1.3.0
     *
     * @return int[]
     */
    private function get_discount_coupons(): array {
        $query = new WP_Query(
            [
                'fields'         => 'ids',
                'post_type'      => 'shop_coupon',
                'post_status'    => 'publish',
                'posts_per_page' => -1,
                'meta_query'     => [ // phpcs:ignore
                    'relation' => 'OR',
                    [
                        'key'     => $this->discount_type_key,
                        'compare' => '=',
                        'value'   => 'yes',
                    ],
                ],
            ]
        );

        return $query->get_posts();
    }

    /**
     * Remove Discount Coupons.
     *
     * @since 1.3.0
     *
     * @return void
     */
    public function remove_discount_coupons() {
        $coupons = $this->get_discount_coupons();

        foreach ( $coupons as $coupon_id ) {
            $coupon = new \WC_Coupon( $coupon_id );
            $coupon->delete( true );
        }
    }

    /**
     * Remove Discount Coupon URL from Order Item.
     *
     * @since 1.3.0
     *
     * @param string                $url   Coupon URL
     * @param \WC_Order_Item_Coupon $item  Order Coupon Item
     * @param \WC_Order             $order Order
     *
     * @return string $url Coupon Url
     */
    public function remove_discount_coupon_url( $url, $item, $order ) {
        if ( ! $order->get_meta( '_wepos_is_pos_order' ) ) {
            return $url;
        }

        $url = '#';

        return $url;
    }
}
