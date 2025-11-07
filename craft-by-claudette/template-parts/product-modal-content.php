<?php
/**
 * Template part for displaying product quick view modal content.
 *
 * This template is loaded via AJAX.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$product_id = get_query_var( 'product_id' );
$product = wc_get_product( $product_id );

if ( ! $product ) {
    echo '<p class="text-white">Product not found.</p>';
    return;
}

$image_id = $product->get_image_id();
$image_url = $image_id ? wp_get_attachment_url( $image_id ) : wc_placeholder_img_url();
$category_terms = get_the_terms( $product_id, 'product_cat' );
$category_name = $category_terms && ! is_wp_error( $category_terms ) ? $category_terms[0]->name : '';
?>

<div class="relative bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto">
    <button class="modal-close-btn absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
    <div class="md:flex">
        <div class="md:w-1/2">
            <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?>" class="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" />
        </div>
        <div class="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
            <span class="text-sm text-gray-500 uppercase tracking-wider"><?php echo esc_html( $category_name ); ?></span>
            <h2 class="text-2xl md:text-3xl font-bold my-2 text-zinc-800"><?php echo esc_html( $product->get_name() ); ?></h2>

            <?php if ( $product->is_on_sale() ) : ?>
                <div class="flex items-baseline space-x-3 mb-4">
                    <p class="text-2xl md:text-3xl font-light text-red-600"><?php echo wc_price( $product->get_sale_price() ); ?></p>
                    <p class="text-lg md:text-xl font-light text-gray-500 line-through"><?php echo wc_price( $product->get_regular_price() ); ?></p>
                </div>
            <?php else : ?>
                <p class="text-2xl md:text-3xl font-light text-amber-600 mb-4"><?php echo wc_price( $product->get_price() ); ?></p>
            <?php endif; ?>

            <p class="text-gray-600 mb-6"><?php echo wp_kses_post( $product->get_description() ? $product->get_description() : $product->get_short_description() ); ?></p>

            <?php if ( $product->is_type( 'simple' ) && $product->is_purchasable() && $product->is_in_stock() ) : ?>
                <form class="cart" action="<?php echo esc_url( apply_filters( 'woocommerce_add_to_cart_form_action', $product->get_permalink() ) ); ?>" method="post" enctype='multipart/form-data'>
                    <div class="flex items-center gap-4 mb-6">
                        <span class="font-semibold text-zinc-700">Quantity:</span>
                        <div class="flex items-center border border-gray-300 rounded-full">
                            <button
                                type="button"
                                class="qty-minus p-2 text-zinc-600 hover:text-amber-600 disabled:opacity-50"
                                aria-label="Decrease quantity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                            </button>
                            <input
                                type="number"
                                id="quantity_<?php echo esc_attr( $product->get_id() ); ?>"
                                class="input-text qty text-center w-16 font-semibold text-lg text-zinc-800 tabular-nums border-none focus:ring-0"
                                step="1"
                                min="1"
                                max="<?php echo esc_attr( $product->get_max_purchase_quantity() ); ?>"
                                name="quantity"
                                value="1"
                                title="<?php echo esc_attr_x( 'Qty', 'Product quantity input tooltip', 'woocommerce' ); ?>"
                                size="4"
                                placeholder=""
                                inputmode="numeric"
                            />
                            <button
                                type="button"
                                class="qty-plus p-2 text-zinc-600 hover:text-amber-600"
                                aria-label="Increase quantity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        name="add-to-cart"
                        value="<?php echo esc_attr( $product->get_id() ); ?>"
                        class="single_add_to_cart_button button alt w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-full transition-colors"
                    >
                        <?php echo esc_html( $product->single_add_to_cart_text() ); ?>
                    </button>
                </form>
                <script>
                    jQuery(document).ready(function($) {
                        var $qtyInput = $('#quantity_<?php echo esc_attr( $product->get_id() ); ?>');
                        $('.qty-minus').on('click', function() {
                            var currentVal = parseInt($qtyInput.val());
                            if (!isNaN(currentVal) && currentVal > 1) {
                                $qtyInput.val(currentVal - 1).trigger('change');
                            }
                        });
                        $('.qty-plus').on('click', function() {
                            var currentVal = parseInt($qtyInput.val());
                            var maxVal = parseInt($qtyInput.attr('max'));
                            if (!isNaN(currentVal) && (maxVal === '' || currentVal < maxVal)) {
                                $qtyInput.val(currentVal + 1).trigger('change');
                            }
                        });
                    });
                </script>
            <?php elseif ( $product->is_type( 'variable' ) && $product->is_purchasable() ) : ?>
                <?php woocommerce_template_single_add_to_cart(); ?>
            <?php else : ?>
                <p class="stock out-of-stock"><?php echo esc_html( $product->get_stock_status() === 'outofstock' ? 'Out of stock' : 'Unavailable' ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</div>