<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'bg-pink-50 text-zinc-800 min-h-screen selection:bg-amber-200' ); ?>>
    <nav id="main-nav" class="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-pink-50/0 backdrop-blur-0 shadow-none">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <div class="flex-shrink-0">
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="text-2xl font-bold text-amber-600 transition-colors hover:text-amber-700">
                        Craft by Claudette
                    </a>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <?php
                        wp_nav_menu( array(
                            'theme_location' => 'primary',
                            'container'      => false,
                            'menu_class'     => 'flex items-baseline space-x-4',
                            'items_wrap'     => '%3$s',
                            'fallback_cb'    => false,
                            'walker'         => new Craft_By_Claudette_Nav_Walker(), // Custom walker for styling
                        ) );
                        ?>
                    </div>
                </div>
                <div class="flex items-center">
                    <button class="relative p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button class="relative p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors ml-2">
                        <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <?php if ( WC()->cart && WC()->cart->get_cart_contents_count() > 0 ) : ?>
                                <span class="absolute top-0 right-0 block h-5 w-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                                    <?php echo WC()->cart->get_cart_contents_count(); ?>
                                </span>
                            <?php endif; ?>
                        </a>
                    </button>
                    <div class="md:hidden ml-2">
                        <button id="mobile-menu-toggle" class="p-1 rounded-md text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors">
                            <svg id="hamburger-icon" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg id="x-icon" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    
    <div id="mobile-menu-container" class="fixed inset-0 z-40 bg-pink-100/80 backdrop-blur-sm md:hidden hidden">
        <div id="mobile-menu-backdrop" class="absolute inset-0"></div>
        <div id="mobile-menu-panel" class="pt-20 bg-white transform -translate-y-full transition-transform duration-300 ease-out">
            <div class="flex flex-col items-center space-y-4 pt-8 pb-12">
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'flex flex-col items-center space-y-4',
                    'items_wrap'     => '%3$s',
                    'fallback_cb'    => false,
                    'walker'         => new Craft_By_Claudette_Nav_Walker_Mobile(), // Custom walker for mobile styling
                ) );
                ?>
            </div>
        </div>
    </div>
    <main class="pt-20">