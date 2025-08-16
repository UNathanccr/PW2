// ===================================
// MUEBLERÍA ELEGANTE - JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // INICIALIZACIÓN DE COMPONENTES BOOTSTRAP
    // ===================================
    
    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // ===================================
    // NAVBAR SCROLL EFFECT
    // ===================================
    
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        }
    });
    
    // ===================================
    // SMOOTH SCROLL PARA ANCHORS
    // ===================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - navbarHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // LAZY LOADING DE IMÁGENES
    // ===================================
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // ===================================
    // ANIMACIONES ON SCROLL
    // ===================================
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animateOnScroll.observe(element);
    });
    
    // ===================================
    // FORMULARIO DE CONTACTO
    // ===================================
    
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                showAlert('Por favor, complete todos los campos requeridos.', 'warning');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Por favor, ingrese un email válido.', 'danger');
                return;
            }
            
            // Simular envío
            showLoader();
            
            setTimeout(() => {
                hideLoader();
                showAlert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
    
    // ===================================
    // FILTROS DE CATÁLOGO
    // ===================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar productos
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.parentElement.style.display = 'block';
                    card.parentElement.classList.add('animate-fadeIn');
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        });
    });
    
    // ===================================
    // CARRITO DE COMPRAS (SIMULACIÓN)
    // ===================================
    
    let cart = [];
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice);
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
            
            // Animación del botón
            this.classList.add('added');
            this.innerHTML = '<i class="bi bi-check"></i> Agregado';
            
            setTimeout(() => {
                this.classList.remove('added');
                this.innerHTML = '<i class="bi bi-cart-plus"></i> Comprar';
            }, 2000);
        });
    });
    
    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }
        
        updateCartUI();
        saveCartToLocalStorage();
    }
    
    function updateCartUI() {
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
    
    function saveCartToLocalStorage() {
        // Nota: En producción, esto se manejaría con una base de datos
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // ===================================
    // BÚSQUEDA EN TIEMPO REAL
    // ===================================
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const productName = card.querySelector('.card-title').textContent.toLowerCase();
                const productDescription = card.querySelector('.card-text').textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                    card.parentElement.style.display = 'block';
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        });
    }
    
    // ===================================
    // GALERÍA LIGHTBOX
    // ===================================
    
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            const src = this.src;
            const alt = this.alt;
            
            // Crear lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${src}" alt="${alt}">
                    <div class="lightbox-caption">${alt}</div>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Cerrar lightbox
            lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                lightbox.remove();
            });
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.remove();
                }
            });
        });
    });
    
    // ===================================
    // CONTADOR DE VISITAS (SIMULACIÓN)
    // ===================================
    
    function updateVisitorCount() {
        let visits = parseInt(sessionStorage.getItem('visits') || '0');
        visits++;
        sessionStorage.setItem('visits', visits.toString());
        
        const visitorCounter = document.querySelector('.visitor-counter');
        if (visitorCounter) {
            visitorCounter.textContent = `Visitas: ${visits}`;
        }
    }
    
    updateVisitorCount();
    
    // ===================================
    // FUNCIONES AUXILIARES
    // ===================================
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-5`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    function showLoader() {
        const loader = document.createElement('div');
        loader.className = 'loader-overlay';
        loader.innerHTML = `
            <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        `;
        document.body.appendChild(loader);
    }
    
    function hideLoader() {
        const loader = document.querySelector('.loader-overlay');
        if (loader) {
            loader.remove();
        }
    }
    
    // ===================================
    // MODO OSCURO (OPCIONAL)
    // ===================================
    
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            
            this.innerHTML = isDarkMode ? 
                '<i class="bi bi-sun-fill"></i>' : 
                '<i class="bi bi-moon-fill"></i>';
        });
        
        // Cargar preferencia guardada
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
    }
    
    // ===================================
    // ANIMACIÓN DE NÚMEROS
    // ===================================
    
    function animateNumbers() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const increment = target / 200;
            
            const updateCounter = () => {
                const current = +counter.innerText;
                
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(updateCounter, 10);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Activar animación cuando sea visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // ===================================
    // PWA - SERVICE WORKER (OPCIONAL)
    // ===================================
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registrado'))
                .catch(err => console.log('SW error:', err));
        });
    }
    
    // ===================================
    // PERFORMANCE - PRELOAD CRÍTICO
    // ===================================
    
    // Precargar imágenes críticas
    const criticalImages = [
        '/img/optimized/hero-banner.jpg',
        '/img/optimized/slide1.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
});

// ===================================
// ESTILOS DINÁMICOS PARA LOADER
// ===================================

const loaderStyles = `
    .loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9998;
        animation: fadeIn 0.3s;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-content img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 35px;
        cursor: pointer;
        transition: transform 0.3s;
    }
    
    .lightbox-close:hover {
        transform: scale(1.2);
    }
    
    .lightbox-caption {
        color: white;
        text-align: center;
        padding: 10px;
        font-size: 16px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = loaderStyles;
document.head.appendChild(styleSheet);