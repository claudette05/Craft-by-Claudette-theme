<?php
/**
 * The template for displaying the front page.
 */

get_header(); ?>

<div class="bg-pink-50 text-zinc-800">
    <?php get_template_part( 'template-parts/hero-carousel' ); ?>
    <?php get_template_part( 'template-parts/features' ); ?>
    <?php get_template_part( 'template-parts/deals-section' ); ?>
    <?php get_template_part( 'template-parts/category-carousel' ); ?>
    
    <section class="py-12 md:py-16 bg-pink-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12 text-zinc-800">New Arrivals</h2>
            <?php echo do_shortcode( '[products limit="8" columns="4" orderby="date" order="DESC"]' ); ?>
        </div>
    </section>

    <section class="py-12 md:py-16 bg-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12 text-zinc-800">Trending Now</h2>
            <?php echo do_shortcode( '[products limit="4" columns="4" visibility="featured"]' ); ?>
        </div>
    </section>

    <?php get_template_part( 'template-parts/bestsellers' ); ?>
    <?php get_template_part( 'template-parts/cta' ); ?>
    <?php get_template_part( 'template-parts/newsletter' ); ?>
    <?php get_template_part( 'template-parts/about-snippet' ); ?>
    <?php get_template_part( 'template-parts/lookbook' ); ?>
    <?php get_template_part( 'template-parts/testimonials' ); ?>
</div>

<?php get_footer(); ?>