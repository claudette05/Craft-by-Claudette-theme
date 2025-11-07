<?php
/**
 * The template for displaying all WooCommerce pages.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce.php.
 *
 * @package WooCommerce/Templates
 * @version 3.6.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_header(); ?>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <?php woocommerce_content(); ?>
</div>

<?php get_footer(); ?>