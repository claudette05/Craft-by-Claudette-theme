<?php
/**
 * Template part for displaying bestsellers.
 */
?>

<section class="py-12 md:py-16 bg-pink-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12 text-zinc-800">
          Our Bestsellers
        </h2>
    </div>
    <div class="relative group">
        <button class="prev-btn absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div class="overflow-x-auto hide-scrollbar scroll-smooth">
            <div class="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4">
                <?php echo do_shortcode( '[products limit="8" columns="4" best_selling="true"]' ); ?>
            </div>
        </div>

        <button class="next-btn absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</section>