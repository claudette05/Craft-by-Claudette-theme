<?php
/**
 * Template part for displaying the newsletter section.
 */
?>

<section class="bg-white py-12 md:py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-amber-100 rounded-lg p-6 md:p-12 text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-amber-800 mb-2">Join the Club!</h2>
            <p class="text-zinc-700 mb-6 max-w-2xl mx-auto text-sm md:text-base">
                Sign up for our newsletter to get exclusive deals, early access to new collections, and a special treat on your first order.
            </p>
            <form class="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                    type="email"
                    placeholder="Your email address"
                    class="w-full px-4 py-3 rounded-full border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    required
                />
                <button
                    type="submit"
                    class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-colors flex-shrink-0"
                >
                    Subscribe
                </button>
            </form>
        </div>
    </div>
</section>