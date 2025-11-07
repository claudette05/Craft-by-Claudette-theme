document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------------------------------
    // Navbar Scroll & Mobile Menu
    // -------------------------------------------------------------------------
    const nav = document.getElementById('main-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const xIcon = document.getElementById('x-icon');

    function handleScroll() {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
            nav.style.backgroundColor = 'rgba(254, 249, 241, 0.7)';
            nav.style.backdropFilter = 'blur(12px)';
            nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05)';
        } else {
            nav.classList.remove('scrolled');
            nav.style.backgroundColor = 'rgba(254, 249, 241, 0)';
            nav.style.backdropFilter = 'blur(0px)';
            nav.style.boxShadow = 'none';
        }
    }

    function toggleMenu() {
        const isOpen = mobileMenuContainer.classList.contains('open');
        if (isOpen) {
            mobileMenuPanel.style.transform = 'translateY(-100%)';
            mobileMenuBackdrop.style.opacity = 0;
            hamburgerIcon.classList.remove('hidden');
            xIcon.classList.add('hidden');
            setTimeout(() => {
                mobileMenuContainer.classList.remove('open');
                mobileMenuContainer.classList.add('hidden');
            }, 300);
        } else {
            mobileMenuContainer.classList.remove('hidden');
            mobileMenuContainer.classList.add('open');
            hamburgerIcon.classList.add('hidden');
            xIcon.classList.remove('hidden');
            setTimeout(() => {
                mobileMenuPanel.style.transform = 'translateY(0)';
                mobileMenuBackdrop.style.opacity = 1;
            }, 10);
        }
    }
    
    if (nav) {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

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
                slide.style.opacity = 0;
                slide.style.zIndex = 1;
                slide.style.transform = i > index ? 'translateX(100%)' : 'translateX(-100%)';
                slide.classList.add('hidden');
            });

            if (slides[index]) {
                slides[index].classList.remove('hidden');
                setTimeout(() => {
                    slides[index].style.opacity = 1;
                    slides[index].style.zIndex = 2;
                    slides[index].style.transform = 'translateX(0)';
                }, 50);
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopSlideShow();
                startSlideShow();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopSlideShow();
                startSlideShow();
            });
        }
        
        showSlide(0);
        startSlideShow();
    }


    // -------------------------------------------------------------------------
    // Product Quick View Modal
    // -------------------------------------------------------------------------
    const modalContainer = document.getElementById('product-modal-container');

    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.quick-view-btn')) {
            e.preventDefault();
            const productId = e.target.getAttribute('data-product-id');
            openQuickViewModal(productId);
        }

        if (e.target.matches('.modal-close-btn') || e.target.matches('.modal-backdrop')) {
            e.preventDefault();
            closeQuickViewModal();
        }
    });

    function openQuickViewModal(productId) {
        if (!modalContainer) return;

        // Show loading spinner
        modalContainer.innerHTML = `<div class="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm p-4"><div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div></div>`;
        modalContainer.classList.remove('hidden');

        const formData = new FormData();
        formData.append('action', 'load_product_quick_view');
        formData.append('product_id', productId);

        fetch(craftAjax.ajaxurl, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                modalContainer.innerHTML = response.data;
                // re-initialize add to cart variation form
                if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                    $( '.variations_form' ).each( function() {
                        $( this ).wc_variation_form();
                    });
                }
            } else {
                modalContainer.innerHTML = `<div class="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm p-4"><p class="text-white">Could not load product.</p></div>`;
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