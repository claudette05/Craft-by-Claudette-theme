<?php
/**
 * Template part for displaying the Call to Action section.
 */
?>

<section
    class="relative py-20 md:py-24 bg-orange-100 bg-cover bg-center"
    style="background-image: url('https://picsum.photos/1200/400?random=42')"
>
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Discover What's New</h2>
        <p class="text-base md:text-lg mb-8 max-w-2xl mx-auto">Freshly crafted pieces have just arrived. Find your next favorite handmade treasure today.</p>
        <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-base md:text-lg">
            Shop New Arrivals
        </a>
    </div>
</section>