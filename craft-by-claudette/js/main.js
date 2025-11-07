document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------------------------------
    // Navbar Scroll & Mobile Menu
    // -------------------------------------------------------------------------
    const nav = document.getElementById('main-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

    function handleScroll() {
        if (!nav) return;
        const isMenuOpen = nav.classList.contains('menu-open');
        if (window.scrollY > 10 || isMenuOpen) {
            nav.style.backgroundColor = 'rgba(254, 249, 241, 0.7)';
            nav.style.backdropFilter = 'blur(12px)';
            nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05)';
        } else {
            nav.style.backgroundColor = 'rgba(254, 249, 241, 0)';
            nav.style.backdropFilter = 'blur(0px)';
            nav.style.boxShadow = 'none';
        }
    }

    function toggleMenu() {
        if (!mobileMenuContainer || !mobileMenuPanel || !mobileMenuBackdrop || !nav) return;
        const isOpen = !mobileMenuContainer.classList.contains('hidden');
        if (isOpen) {
            nav.classList.remove('menu-open');
            mobileMenuPanel.style.transform = 'translateY(-100%)';
            mobileMenuBackdrop.style.opacity = 0;
            setTimeout(() => {
                mobileMenuContainer.classList.add('hidden');
            }, 300);
        } else {
            nav.classList.add('menu-open');
            mobileMenuContainer.classList.remove('hidden');
            setTimeout(() => {
                mobileMenuPanel.style.transform = 'translateY(0)';
                mobileMenuBackdrop.style.opacity = 1;
            }, 10);
        }
        handleScroll(); // Update nav style immediately
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMenu);
    }
    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', toggleMenu);
    }

    // -------------------------------------------------------------------------
    // Hero Carousel
    // -------------------------------------------------------------------------
    const hero = document.querySelector('.hero-carousel');
    if (hero) {
        const slides = hero.querySelectorAll('.hero-slide');
        const prevBtn = hero.querySelector('.prev-btn');
        const nextBtn = hero.querySelector('.next-btn');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.transition = 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out';
                if (i === index) {
                    slide.style.opacity = 1;
                    slide.style.transform = 'scale(1)';
                    slide.style.zIndex = 2;
                } else {
                    slide.style.opacity = 0;
                    slide.style.transform = 'scale(1.05)';
                    slide.style.zIndex = 1;
                }
            });
        }

        function changeSlide(newDirection) {
            currentSlide = (currentSlide + newDirection + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        function startSlideShow() {
            stopSlideShow();
            slideInterval = setInterval(() => changeSlide(1), 5000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                changeSlide(1);
                startSlideShow();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                changeSlide(-1);
                startSlideShow();
            });
        }
        
        if(slides.length > 0) {
            showSlide(0);
            startSlideShow();
        }
    }
    
    // -------------------------------------------------------------------------
    // Generic Carousel (for Categories)
    // -------------------------------------------------------------------------
    const carousels = document.querySelectorAll('.category-carousel-container');
    carousels.forEach(container => {
        const carousel = container.querySelector('.category-carousel');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');

        if (!carousel || !prevBtn || !nextBtn) return;

        const scrollAmount = carousel.firstElementChild ? carousel.firstElementChild.offsetWidth + 16 : 300; // Card width + gap

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    });


    // -------------------------------------------------------------------------
    // Product Quick View Modal
    // -------------------------------------------------------------------------
    const modalContainer = document.getElementById('product-modal-container');

    document.body.addEventListener('click', function(e) {
        const quickViewButton = e.target.closest('.quick-view-btn');
        if (quickViewButton) {
            e.preventDefault();
            const productId = quickViewButton.getAttribute('data-product-id');
            openQuickViewModal(productId);
        }

        const closeButton = e.target.closest('.modal-close-btn');
        const backdrop = e.target.matches('.modal-backdrop');
        if (closeButton || backdrop) {
            e.preventDefault();
            closeQuickViewModal();
        }
    });

    function openQuickViewModal(productId) {
        if (!modalContainer || !craftAjax) return;

        modalContainer.classList.remove('hidden');
        modalContainer.innerHTML = `<div class="modal-backdrop fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm p-4"><div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div></div>`;
        document.body.style.overflow = 'hidden';

        const formData = new FormData();
        formData.append('action', 'load_product_quick_view');
        formData.append('product_id', productId);
        formData.append('nonce', craftAjax.nonce);

        fetch(craftAjax.ajaxurl, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                modalContainer.innerHTML = response.data;
                // Re-initialize add to cart variation form if it exists
                if (typeof jQuery !== 'undefined' && jQuery().wc_variation_form) {
                    jQuery('.variations_form').wc_variation_form();
                }
                 // Handle AJAX add to cart from within the modal
                const modalForm = modalContainer.querySelector('form.cart');
                if (modalForm) {
                    modalForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const form = e.target;
                        const submitButton = form.querySelector('.single_add_to_cart_button');
                        if (!submitButton) return;

                        const originalButtonText = submitButton.innerHTML;
                        submitButton.innerHTML = 'Adding...';
                        submitButton.disabled = true;

                        const formData = new FormData(form);
                        
                        fetch(form.action || window.location.href, {
                            method: 'POST',
                            body: new URLSearchParams(formData),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                        .then(res => {
                            // This triggers the fragments update
                            if (typeof jQuery !== 'undefined') {
                                jQuery(document.body).trigger('added_to_cart', [null, null, jQuery(submitButton)]);
                            }

                            submitButton.innerHTML = 'Added!';
                            setTimeout(() => {
                                closeQuickViewModal();
                            }, 1000);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            submitButton.innerHTML = originalButtonText;
                            submitButton.disabled = false;
                        });
                    });
                }
            } else {
                 console.error('Quick view failed:', response.data);
                 closeQuickViewModal();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            closeQuickViewModal();
        });
    }

    function closeQuickViewModal() {
        if (modalContainer) {
            modalContainer.classList.add('hidden');
            modalContainer.innerHTML = '';
            document.body.style.overflow = '';
        }
    }
});
