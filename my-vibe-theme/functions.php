<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Include custom navigation walkers
require_once get_template_directory() . '/class-my-vibe-theme-nav-walker.php';
require_once get_template_directory() . '/class-my-vibe-theme-nav-walker-mobile.php';

/**
 * My Vibe Theme setup.
 */
function myvibe_theme_setup() {
    // Add default posts and comments RSS feed links to head.
    add_theme_support( 'automatic-feed-links' );

    // Let WordPress manage the document title.
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support( 'post-thumbnails' );

    // Switch default core markup for search form, comment form, and comments
    // to output valid HTML5.
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Add theme support for selective refresh for widgets.
    add_theme_support( 'customize-selective-refresh-widgets' );

    // Register navigation menus.
    register_nav_menus( array(
        'primary' => esc_html__( 'Primary Menu', 'myvibe-theme' ),
    ) );

    // Add support for WooCommerce.
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'myvibe_theme_setup' );

/**
 * Enqueue scripts and styles.
 */
function myvibe_enqueue_assets() {
    // Google Fonts - Poppins
    wp_enqueue_style( 'google-fonts-poppins', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', array(), null );

    // Compiled Tailwind CSS (replaces CDN and custom styles)
    wp_enqueue_style( 'myvibe-tailwind-styles', get_template_directory_uri() . '/assets/css/tailwind.css', array( 'google-fonts-poppins' ), '1.0.0' );

    // Main JavaScript file
    wp_enqueue_script( 'myvibe-main-script', get_template_directory_uri() . '/assets/js/main.js', array( 'jquery' ), '1.0.0', true );

    // Localize script for AJAX
    wp_localize_script( 'myvibe-main-script', 'myvibeAjax', array(
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'myvibe_enqueue_assets' );

/**
 * WooCommerce specific functions.
 */
// Remove default WooCommerce wrappers
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );

// Add custom WooCommerce wrappers
add_action( 'woocommerce_before_main_content', 'myvibe_woocommerce_wrapper_start', 10 );
add_action( 'woocommerce_after_main_content', 'myvibe_woocommerce_wrapper_end', 10 );

function myvibe_woocommerce_wrapper_start() {
    echo '<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">';
}

function myvibe_woocommerce_wrapper_end() {
    echo '</div>';
}

/**
 * AJAX handler for product quick view.
 */
function myvibe_load_product_quick_view_callback() {
    if ( ! isset( $_POST['product_id'] ) ) {
        wp_send_json_error( 'Product ID missing.' );
    }

    $product_id = intval( $_POST['product_id'] );
    if ( ! $product_id ) {
        wp_send_json_error( 'Invalid Product ID.' );
    }

    ob_start();
    set_query_var( 'product_id', $product_id );
    get_template_part( 'template-parts/product-modal-content' );
    $modal_content = ob_get_clean();

    wp_send_json_success( $modal_content );
}
add_action( 'wp_ajax_load_product_quick_view', 'myvibe_load_product_quick_view_callback' );
add_action( 'wp_ajax_nopriv_load_product_quick_view', 'myvibe_load_product_quick_view_callback' );