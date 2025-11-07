<?php
/**
 * Template part for displaying the category carousel.
 */

$categories = get_terms( array(
    'taxonomy'   => 'product_cat',
    'hide_empty' => true,
    'orderby'    => 'name',
    'order'      => 'ASC',
) );

// Prepend 'All' category
$all_category = (object) array(
    'term_id' => 0,
    'name'    => 'All',
    'slug'    => 'all',
    'image'   => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200&h=200&auto=format&fit=crop', // Placeholder image
);

$all_categories = array_merge( array( $all_category ), $categories );

// Get current active category from URL if any
$current_category_slug = isset( $_GET['product_cat'] ) ? sanitize_title( $_GET['product_cat'] ) : 'all';
?>

<section class="py-10 md:py-12 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8 text-zinc-800">Shop by Category</h2>
        <div class="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 sm:justify-center hide-scrollbar">
            <?php foreach ( $all_categories as $category ) :
                $is_active = ( $current_category_slug === $category->slug );
                $category_link = ( $category->slug === 'all' ) ? esc_url( wc_get_page_permalink( 'shop' ) ) : esc_url( get_term_link( $category->term_id, 'product_cat' ) );
                $thumbnail_id = get_term_meta( $category->term_id, 'thumbnail_id', true );
                $image_url = $thumbnail_id ? wp_get_attachment_url( $thumbnail_id ) : $category->image; // Use placeholder if no image
            ?>
                <a href="<?php echo $category_link; ?>" class="flex-shrink-0 flex flex-col items-center gap-2 w-24 focus:outline-none transition-transform" aria-label="Shop <?php echo esc_attr( $category->name ); ?>">
                    <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md transition-all duration-300 <?php echo $is_active ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white' : 'ring-2 ring-transparent'; ?>">
                        <img
                            src="<?php echo esc_url( $image_url ); ?>"
                            alt="A sample of <?php echo esc_attr( $category->name ); ?> products"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <span class="text-xs sm:text-sm font-medium transition-colors duration-300 mt-1 <?php echo $is_active ? 'text-amber-700 font-bold' : 'text-zinc-600'; ?>">
                        <?php echo esc_html( $category->name ); ?>
                    </span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>