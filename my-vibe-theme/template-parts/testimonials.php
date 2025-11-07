<?php
/**
 * Template part for displaying testimonials.
 */

// Hardcoded testimonials (replace with dynamic data from custom fields or a custom post type)
$testimonials = array(
    array(
        'id' => 1,
        'name' => 'Sarah L.',
        'quote' => 'Absolutely love my new resin earrings! The colors are so vibrant and they are surprisingly lightweight. I get compliments every time I wear them.',
        'rating' => 5,
    ),
    array(
        'id' => 2,
        'name' => 'Jessica M.',
        'quote' => 'The beaded bracelet is even more beautiful in person. You can really tell the care and craftsmanship that went into making it. Highly recommend!',
        'rating' => 4,
    ),
    array(
        'id' => 3,
        'name' => 'Emily R.',
        'quote' => 'My custom keychain is perfect! Claudette was so easy to work with and brought my vision to life. It\'s truly one-of-a-kind.',
        'rating' => 5,
    ),
);
?>

<section class="py-12 md:py-16 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-12 text-zinc-800">
            From Our Customers
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <?php foreach ( $testimonials as $testimonial ) : ?>
                <div class="bg-pink-50/50 p-6 md:p-8 rounded-lg shadow-sm">
                    <div class="flex mb-4">
                        <?php for ( $i = 0; $i < 5; $i++ ) : ?>
                            <svg
                                class="w-5 h-5 <?php echo ( $i < $testimonial['rating'] ) ? 'text-amber-500' : 'text-gray-300'; ?>"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        <?php endfor; ?>
                    </div>
                    <p class="text-zinc-600 italic mb-6">"<?php echo esc_html( $testimonial['quote'] ); ?>"</p>
                    <p class="font-bold text-amber-700"><?php echo esc_html( $testimonial['name'] ); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>