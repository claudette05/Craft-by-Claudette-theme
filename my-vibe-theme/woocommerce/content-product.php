<?php
/**
 * The template for displaying product content within loops
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We recommend you read the documentation on setting up
 * and using an override template for more information.
 *
 * @link     https://docs.woocommerce.com/document/template-structure/
 * @package  WooCommerce/Templates
 * @version  3.6.0
 */

defined( 'ABSPATH' ) || exit;

global $product;

// Ensure visibility.
if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}
?>
<li <?php wc_product_class( 'group relative bg-white/40 backdrop-blur-lg border border-white/50 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/40 hover:border-amber-300', $product ); ?>>
    <div class="relative overflow-hidden cursor-pointer" onclick="window.location.href='<?php echo esc_url( $product->get_permalink() ); ?>'">
        <?php
        /**
         * Hook: woocommerce_before_shop_loop_item_title.
         *
         * @hooked woocommerce_show_product_loop_sale_flash - 10
         * @hooked woocommerce_template_loop_product_thumbnail - 10
         */
        do_action( 'woocommerce_before_shop_loop_item_title' );

        if ( $product->is_on_sale() ) : ?>
            <div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                SALE
            </div>
        <?php endif; ?>
    </div>
    <div class="p-3 sm:p-4 text-center flex-grow flex flex-col justify-between">
        <div>
            <h3 class="text-sm sm:text-lg font-semibold text-zinc-800 truncate transition-colors duration-300 group-hover:text-amber-700">
                <a href="<?php echo esc_url( $product->get_permalink() ); ?>" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
                    <?php echo esc_html( $product->get_name() ); ?>
                </a>
            </h3>
            <div class="mt-2">
                <?php if ( $product->is_on_sale() ) : ?>
                    <div class="flex flex-col sm:flex-row justify-center items-baseline sm:space-x-2">
                        <p class="text-red-600 font-bold text-base sm:text-xl"><?php echo $product->get_sale_price() ? wc_price( $product->get_sale_price() ) : ''; ?></p>
                        <p class="text-gray-500 font-medium line-through text-sm"><?php echo wc_price( $product->get_regular_price() ); ?></p>
                    </div>
                <?php else : ?>
                    <p class="text-amber-600 font-bold text-base sm:text-lg"><?php echo wc_price( $product->get_price() ); ?></p>
                <?php endif; ?>
            </div>
        </div>
        <div class="mt-4 flex items-center gap-2 sm:gap-3">
            <button
                class="w-full bg-white text-amber-600 border border-amber-500 hover:bg-amber-50 font-bold py-2 px-2 sm:px-4 rounded-full transition-colors text-sm quick-view-btn"
                data-product-id="<?php echo esc_attr( $product->get_id() ); ?>"
            >
                Quick View
            </button>
            <?php
            echo apply_filters(
                'woocommerce_loop_add_to_cart_link', // WPCS: XSS ok.
                sprintf(
                    '<a href="%s" data-quantity="%s" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-2 sm:px-4 rounded-full transition-colors text-sm %s" %s>%s</a>',
                    esc_url( $product->add_to_cart_url() ),
                    esc_attr( isset( $args['quantity'] ) ? $args['quantity'] : 1 ),
                    esc_attr( $product->is_purchasable() && $product->is_in_stock() ? 'add_to_cart_button' : '' ),
                    esc_attr( $product->is_purchasable() && $product->is_in_stock() ? 'data-product_id="' . $product->get_id() . '" data-product_sku="' . $product->get_sku() . '"' : '' ),
                    esc_html( $product->add_to_cart_text() )
                ),
                $product,
                $args
            );
            ?>
        </div>
    </div>
</li>