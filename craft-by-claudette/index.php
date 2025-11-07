<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */

get_header(); ?>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <h1 class="text-3xl font-bold text-zinc-800 mb-8">Latest Posts</h1>
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) : the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'mb-8 p-6 bg-white rounded-lg shadow-sm' ); ?>>
                <h2 class="text-2xl font-semibold text-amber-700 mb-2">
                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                </h2>
                <div class="text-sm text-zinc-600 mb-4">
                    <?php the_date(); ?> by <?php the_author(); ?>
                </div>
                <div class="prose max-w-none text-zinc-700">
                    <?php the_excerpt(); ?>
                </div>
                <a href="<?php the_permalink(); ?>" class="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors">Read More</a>
            </article>
            <?php
        endwhile;
        the_posts_navigation();
    else :
        ?>
        <p>No posts found.</p>
        <?php
    endif;
    ?>
</div>

<?php get_footer(); ?>