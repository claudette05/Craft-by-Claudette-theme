<?php
/**
 * Template part for displaying the deals section.
 */
?>

<section class="py-12 md:py-16 bg-orange-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-amber-800 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> Deals of the Day
            </h2>
            <p class="mt-2 mb-8 text-zinc-600">Hurry, these deals won't last long!</p>
            <div class="flex space-x-2 md:space-x-4 justify-center">
                <div class="text-center">
                    <div class="text-2xl md:text-4xl font-bold text-white bg-amber-500/80 rounded-lg px-2 sm:px-3 py-2">00</div>
                    <div class="text-xs uppercase mt-1 text-zinc-600">days</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl md:text-4xl font-bold text-white bg-amber-500/80 rounded-lg px-2 sm:px-3 py-2">00</div>
                    <div class="text-xs uppercase mt-1 text-zinc-600">hours</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl md:text-4xl font-bold text-white bg-amber-500/80 rounded-lg px-2 sm:px-3 py-2">00</div>
                    <div class="text-xs uppercase mt-1 text-zinc-600">minutes</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl md:text-4xl font-bold text-white bg-amber-500/80 rounded-lg px-2 sm:px-3 py-2">00</div>
                    <div class="text-xs uppercase mt-1 text-zinc-600">seconds</div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-12">
        <div class="relative group">
            <button class="prev-btn absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <div class="overflow-x-auto hide-scrollbar scroll-smooth">
                <div class="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4">
                    <?php echo do_shortcode( '[products limit="8" columns="4" on_sale="true"]' ); ?>
                </div>
            </div>

            <button class="next-btn absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</section>