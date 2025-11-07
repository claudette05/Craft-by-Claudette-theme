<?php
/**
 * Custom Navigation Walker for Craft by Claudette theme (Mobile).
 *
 * @package Craft_By_Claudette
 */

if ( ! class_exists( 'Craft_By_Claudette_Nav_Walker_Mobile' ) ) {
    class Craft_By_Claudette_Nav_Walker_Mobile extends Walker_Nav_Menu {

        /**
         * Starts the list before the elements are added.
         *
         * @see Walker_Nav_Menu::start_lvl()
         *
         * @param string $output Used to append additional content (passed by reference).
         * @param int    $depth  Depth of menu item. Used for padding.
         * @param array  $args   An array of arguments. @see wp_nav_menu()
         */
        public function start_lvl( &$output, $depth = 0, $args = null ) {
            $indent = str_repeat( "\t", $depth );
            $output .= "\n$indent<ul class=\"sub-menu pl-4\">\n"; // Added padding for sub-menus
        }

        /**
         * Starts the element output.
         *
         * @see Walker_Nav_Menu::start_el()
         *
         * @param string $output Used to append additional content (passed by reference).
         * @param WP_Post $item   Menu item data object.
         * @param int    $depth  Depth of menu item. Used for padding.
         * @param array  $args   An array of arguments. @see wp_nav_menu()
         * @param int    $id     Current item ID.
         */
        public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
            $indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

            $classes = empty( $item->classes ) ? array() : (array) $item->classes;
            $classes[] = 'menu-item-' . $item->ID;

            $class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
            $class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

            $id = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );
            $id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

            $output .= $indent . '<li' . $id . $class_names . '>';

            $atts = array();
            $atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
            $atts['target'] = ! empty( $item->target )     ? $item->target     : '';
            if ( '_blank' === $item->target && empty( $item->xfn ) ) {
                $atts['rel'] = 'noopener noreferrer';
            } else {
                $atts['rel'] = ! empty( $item->xfn )        ? $item->xfn        : '';
            }
            $atts['href']   = ! empty( $item->url )        ? $item->url        : '';
            $atts['aria-current'] = $item->current ? 'page' : '';

            $atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

            $attributes = '';
            foreach ( $atts as $attr => $value ) {
                if ( is_scalar( $value ) && '' !== $value && false !== $value ) {
                    $value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
                    $attributes .= ' ' . $attr . '="' . $value . '"';
                }
            }

            $item_output = $args->before;
            $item_output .= '<a' . $attributes . ' class="text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">';
            $item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
            $item_output .= '</a>';
            $item_output .= $args->after;

            $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
        }
    }
}