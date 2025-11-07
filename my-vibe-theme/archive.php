<?php
/**
 * The template for displaying archive pages.
 */

get_header(); ?>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <header class="page-header mb-8">
        <?php
        the_archive_title( '<h1 class="page-title text-3xl font-bold text-zinc-800">', '</h1>' );
        the_archive_description( '<div class="archive-description text-zinc-600 mt-2">', '</div>' );
        ?>
    </header><!-- .page-header -->

    <?php
    if ( have_posts() ) :
        /* Start the Loop */
        while ( have_posts() ) : the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'mb-8 p-6 bg-white rounded-lg shadow-sm' ); ?>>
                <h2 class="text-2xl font-semibold text-amber-700 mb-2">
                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                </h2>
                <div class="text-sm text-zinc-600 mb-4">
                    <?php the_date(); ?> by <?php the_author(); ?>
                </div>
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="mb-4 rounded-lg overflow-hidden">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail( 'medium', array( 'class' => 'w-full h-auto object-cover' ) ); ?>
                        </a>
                    </div>
                <?php endif; ?>
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
        <p>No content found.</p>
        <?php
    endif;
    ?>
</div>

<?php get_footer(); ?>