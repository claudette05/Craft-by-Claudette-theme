<?php
/**
 * Template part for displaying the lookbook/Instagram section.
 */

// Hardcoded lookbook posts (replace with dynamic data from custom fields or a custom post type)
$posts = array(
    array(
        'id' => 1,
        'imageUrl' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2574&auto=format&fit=crop',
        'caption' => 'Pastel Dream Earrings, perfect for spring!',
    ),
    array(
        'id' => 2,
        'imageUrl' => 'https://images.unsplash.com/photo-1611099222359-52a69a083311?q=80&w=2574&auto=format&fit=crop',
        'caption' => 'Oceanic Beaded Bracelet, a touch of the sea.',
    ),
    array(
        'id' => 3,
        'imageUrl' => 'https://images.unsplash.com/photo-1575429391320-42f068771a36?q=80&w=2574&auto=format&fit=crop',
        'caption' => 'Glitter Gloss Keychain, beauty on the go!',
    ),
    array(
        'id' => 4,
        'imageUrl' => 'https://images.unsplash.com/photo-1595932582801-5e544711655b?q=80&w=2574&auto=format&fit=crop',
        'caption' => 'Satin Ribbon Choker, simple elegance.',
    ),
);
?>

<section class="py-12 md:py-16 bg-pink-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 md:mb-12">
            <h2 class="text-2xl md:text-3xl font-bold text-zinc-800">Shop Our Instagram</h2>
            <p class="text-zinc-600 mt-2">Tag <span class="font-semibold text-amber-600">@CraftByClaudette</span> to be featured!</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <?php foreach ( $posts as $post ) : ?>
                <div class="group relative rounded-lg overflow-hidden cursor-pointer">
                    <img
                        src="<?php echo esc_url( $post['imageUrl'] ); ?>"
                        alt="<?php echo esc_attr( $post['caption'] ); ?>"
                        class="w-full h-full object-cover aspect-square"
                    />
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <p class="text-white text-center text-sm font-semibold"><?php echo esc_html( $post['caption'] ); ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>