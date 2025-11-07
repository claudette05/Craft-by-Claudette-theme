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

        function showSlide(index, direction) {
            slides.forEach((slide, i) => {
                slide.style.transition = 'none';
                slide.style.zIndex = 1;
                
                if (i === index) {
                    slide.style.transform = 'translateX(0)';
                    slide.style.opacity = 1;
                    slide.style.zIndex = 2;
                } else {
                    const prevSlideIndex = (index - 1 + slides.length) % slides.length;
                    if( i === prevSlideIndex) {
                       slide.style.transform = 'translateX(-100%)';
                    } else {
                       slide.style.transform = 'translateX(100%)';
                    }
                    slide.style.opacity = 0;
                }
                setTimeout(() => {
                    slide.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                }, 50);
            });
        }

        function changeSlide(newDirection) {
            const nextIndex = (currentSlide + newDirection + slides.length) % slides.length;
            showSlide(nextIndex, newDirection);
            currentSlide = nextIndex;
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
            showSlide(0, 1);
            startSlideShow();
        }
    }

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
        if (!modalContainer) return;

        modalContainer.classList.remove('hidden');
        modalContainer.innerHTML = `<div class="modal-backdrop fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm p-4"><div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div></div>`;

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
                // re-initialize add to cart variation form if it exists
                if (typeof jQuery !== 'undefined' && typeof jQuery.fn.wc_variation_form !== 'undefined') {
                    jQuery( '.variations_form' ).each( function() {
                        jQuery( this ).wc_variation_form();
                    });
                }
            } else {
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
        }
    }
});
