<?php
/**
 * Template part for displaying the hero carousel.
 */

// Hardcoded slides (replace with dynamic data from custom fields or a custom post type)
$slides = array(
    array(
        'id' => 1,
        'title' => 'New Resin Earrings',
        'subtitle' => 'Handcrafted with love and vibrant colors.',
        'imageUrl' => 'https://images.unsplash.com/photo-1611151923205-3333575303a1?q=80&w=2670&auto=format&fit=crop',
        'buttonText' => 'Shop Now',
        'buttonLink' => esc_url( wc_get_page_permalink( 'shop' ) ) . '?product_cat=earrings',
    ),
    array(
        'id' => 2,
        'title' => 'Beaded Bracelets',
        'subtitle' => 'Unique designs for every style.',
        'imageUrl' => 'https://images.unsplash.com/photo-1589309797086-628867a1956f?q=80&w=2670&auto=format&fit=crop',
        'buttonText' => 'Explore Collection',
        'buttonLink' => esc_url( wc_get_page_permalink( 'shop' ) ) . '?product_cat=bracelets',
    ),
    array(
        'id' => 3,
        'title' => 'Lipgloss Keychains',
        'subtitle' => 'Beauty on the go, stylish and practical.',
        'imageUrl' => 'https://images.unsplash.com/photo-1620920494901-de1a63c8a98a?q=80&w=2670&auto=format&fit=crop',
        'buttonText' => 'Discover More',
        'buttonLink' => esc_url( wc_get_page_permalink( 'shop' ) ) . '?product_cat=keychains',
    ),
);
?>

<div class="hero-carousel relative w-full h-[80vh] sm:h-[70vh] overflow-hidden bg-orange-100">
    <?php foreach ( $slides as $index => $slide ) : ?>
        <div class="hero-slide absolute w-full h-full transition-all duration-500 ease-in-out <?php echo $index === 0 ? '' : 'hidden'; ?>" style="opacity: <?php echo $index === 0 ? 1 : 0; ?>; z-index: <?php echo $index === 0 ? 2 : 1; ?>;">
            <img
                src="<?php echo esc_url( $slide['imageUrl'] ); ?>"
                alt="<?php echo esc_attr( $slide['title'] ); ?>"
                class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div class="text-center text-white p-4">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        <?php echo esc_html( $slide['title'] ); ?>
                    </h1>
                    <p class="text-base sm:text-lg md:text-xl mb-8">
                        <?php echo esc_html( $slide['subtitle'] ); ?>
                    </p>
                    <a href="<?php echo esc_url( $slide['buttonLink'] ); ?>" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
                        <?php echo esc_html( $slide['buttonText'] ); ?>
                    </a>
                </div>
            </div>
        </div>
    <?php endforeach; ?>

    <div class="absolute z-10 top-1/2 -translate-y-1/2 left-4">
        <button class="prev-btn bg-white/50 hover:bg-white/80 rounded-full p-2 text-zinc-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    </div>
    <div class="absolute z-10 top-1/2 -translate-y-1/2 right-4">
        <button class="next-btn bg-white/50 hover:bg-white/80 rounded-full p-2 text-zinc-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</div>