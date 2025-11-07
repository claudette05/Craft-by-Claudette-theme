<?php
/**
 * The template for displaying all single posts.
 */

get_header(); ?>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <?php
    while ( have_posts() ) : the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'bg-white rounded-lg shadow-sm p-6 md:p-8' ); ?>>
            <h1 class="text-3xl md:text-4xl font-bold text-zinc-800 mb-4"><?php the_title(); ?></h1>
            <div class="text-sm text-zinc-600 mb-6">
                Posted on <?php the_date(); ?> by <?php the_author(); ?>
            </div>
            <?php if ( has_post_thumbnail() ) : ?>
                <div class="mb-6 rounded-lg overflow-hidden">
                    <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-auto object-cover' ) ); ?>
                </div>
            <?php endif; ?>
            <div class="prose max-w-none text-zinc-700">
                <?php the_content(); ?>
            </div>
            <?php
            // If comments are open or we have at least one comment, load up the comment template.
            if ( comments_open() || get_comments_number() ) :
                comments_template();
            endif;
            ?>
        </article>
        <?php
    endwhile; // End of the loop.
    ?>
</div>

<?php get_footer(); ?>