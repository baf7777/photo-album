// Данные фотографий с дополнительной информацией
const photoData = [
    {
        file: "photo1.jpg",
        title: "Закат над морем",
        description: "Невероятно красивый закат, который мы наблюдали во время отпуска. Цвета неба просто завораживают!",
        category: "landscape",
        date: "2024-01-15",
        location: "Черное море"
    },
    {
        file: "photo2.jpg", 
        title: "Портрет в саду",
        description: "Семейный портрет среди цветущих роз. Этот момент навсегда останется в наших сердцах.",
        category: "portrait",
        date: "2024-02-20",
        location: "Ботанический сад"
    },
    {
        file: "photo3.jpg",
        title: "Горный пейзаж",
        description: "Вид с вершины горы просто захватывает дух. Природа во всей своей красе!",
        category: "nature",
        date: "2024-03-10",
        location: "Кавказские горы"
    }
];

// Глобальные переменные
let currentFilter = 'all';
let currentView = 'grid';
let currentPhotoIndex = 0;
let filteredPhotos = [...photoData];

// DOM элементы
const photoContainer = document.getElementById("photo-container");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.getElementById("close-modal");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    addParallaxEffect();
    addParticleEffect();
});

// Основная функция инициализации
function initializeApp() {
    renderPhotos();
    addLoadingAnimation();
    setTimeout(() => {
        removeLoadingAnimation();
        addEntranceAnimations();
    }, 1000);
}

// Рендеринг фотографий
function renderPhotos() {
    photoContainer.innerHTML = '';
    
    filteredPhotos.forEach((photo, index) => {
        const photoElement = createPhotoElement(photo, index);
        photoContainer.appendChild(photoElement);
    });
    
    // Применяем текущий режим просмотра
    applyViewMode();
}

// Создание элемента фотографии
function createPhotoElement(photo, index) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo';
    photoDiv.setAttribute('data-category', photo.category);
    photoDiv.setAttribute('data-index', index);
    
    // Добавляем эффект наведения
    photoDiv.addEventListener('mouseenter', () => {
        addHoverEffect(photoDiv);
    });
    
    photoDiv.addEventListener('mouseleave', () => {
        removeHoverEffect(photoDiv);
    });
    
    // Клик для открытия модального окна
    photoDiv.addEventListener('click', () => {
        openModal(index);
    });
    
    photoDiv.innerHTML = `
        <img src="images/${photo.file}" alt="${photo.title}" loading="lazy">
        <div class="photo-info">
            <h3 class="photo-title">${photo.title}</h3>
            <p class="photo-description">${photo.description}</p>
            <div class="photo-meta">
                <span class="photo-date">
                    <i class="fas fa-calendar"></i> ${formatDate(photo.date)}
                </span>
                <span class="photo-location">
                    <i class="fas fa-map-marker-alt"></i> ${photo.location}
                </span>
            </div>
        </div>
    `;
    
    return photoDiv;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Фильтры
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.currentTarget.getAttribute('data-filter');
            applyFilter(filter);
            updateActiveFilter(e.currentTarget);
        });
    });
    
    // Режимы просмотра
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            applyViewMode(view);
            updateActiveView(e.currentTarget);
        });
    });
    
    // Модальное окно
    closeModal.addEventListener('click', closeModalWindow);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalWindow();
        }
    });
    
    // Навигация в модальном окне
    prevBtn.addEventListener('click', () => navigateModal(-1));
    nextBtn.addEventListener('click', () => navigateModal(1));
    
    // Клавиатурная навигация
    document.addEventListener('keydown', handleKeyboard);
    
    // Плавная прокрутка для карусели
    photoContainer.addEventListener('scroll', handleCarouselScroll);
}

// Применение фильтра
function applyFilter(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        filteredPhotos = [...photoData];
    } else {
        filteredPhotos = photoData.filter(photo => photo.category === filter);
    }
    
    // Анимация исчезновения
    photoContainer.style.opacity = '0';
    photoContainer.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        renderPhotos();
        photoContainer.style.opacity = '1';
        photoContainer.style.transform = 'scale(1)';
    }, 300);
}

// Применение режима просмотра
function applyViewMode(view = currentView) {
    currentView = view;
    
    photoContainer.className = 'photo-container';
    
    switch(view) {
        case 'masonry':
            photoContainer.classList.add('masonry');
            break;
        case 'carousel':
            photoContainer.classList.add('carousel');
            break;
        default:
            // Grid режим (по умолчанию)
            break;
    }
}

// Открытие модального окна
function openModal(index) {
    currentPhotoIndex = index;
    const photo = filteredPhotos[index];
    
    modalImage.src = `images/${photo.file}`;
    modalImage.alt = photo.title;
    modalTitle.textContent = photo.title;
    modalDescription.textContent = photo.description;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Анимация появления
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Закрытие модального окна
function closeModalWindow() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.opacity = '0';
    }, 300);
}

// Навигация в модальном окне
function navigateModal(direction) {
    const newIndex = currentPhotoIndex + direction;
    
    if (newIndex >= 0 && newIndex < filteredPhotos.length) {
        currentPhotoIndex = newIndex;
        const photo = filteredPhotos[currentPhotoIndex];
        
        // Анимация смены изображения
        modalImage.style.opacity = '0';
        modalImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            modalImage.src = `images/${photo.file}`;
            modalImage.alt = photo.title;
            modalTitle.textContent = photo.title;
            modalDescription.textContent = photo.description;
            
            modalImage.style.opacity = '1';
            modalImage.style.transform = 'scale(1)';
        }, 150);
    }
}

// Обработка клавиатуры
function handleKeyboard(e) {
    if (modal.classList.contains('show')) {
        switch(e.key) {
            case 'Escape':
                closeModalWindow();
                break;
            case 'ArrowLeft':
                navigateModal(-1);
                break;
            case 'ArrowRight':
                navigateModal(1);
                break;
        }
    }
}

// Обновление активного фильтра
function updateActiveFilter(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Обновление активного режима просмотра
function updateActiveView(activeBtn) {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Эффекты наведения
function addHoverEffect(element) {
    element.style.transform = 'translateY(-10px) scale(1.02)';
    element.style.boxShadow = '0 20px 40px rgba(31, 38, 135, 0.3)';
}

function removeHoverEffect(element) {
    element.style.transform = 'translateY(0) scale(1)';
    element.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
}

// Анимация загрузки
function addLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loader">
            <div class="loader-circle"></div>
            <div class="loader-text">Загружаем воспоминания...</div>
        </div>
    `;
    
    // Добавляем стили для загрузчика
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loader-circle {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #ff6b6b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        .loader-text {
            color: white;
            font-family: 'Poppins', sans-serif;
            font-size: 1.2rem;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loader);
}

function removeLoadingAnimation() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
}

// Анимации входа
function addEntranceAnimations() {
    const photos = document.querySelectorAll('.photo');
    photos.forEach((photo, index) => {
        photo.style.animationDelay = `${index * 0.1}s`;
        photo.classList.add('animate-in');
    });
}

// Параллакс эффект
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const stars = document.querySelector('.stars');
        const twinkling = document.querySelector('.twinkling');
        
        if (stars) {
            stars.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        if (twinkling) {
            twinkling.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Эффект частиц
function addParticleEffect() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Создаем частицы
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: float ${Math.random() * 10 + 10}s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
    `;
    
    container.appendChild(particle);
}

// Добавляем CSS для анимации частиц
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Обработка прокрутки карусели
function handleCarouselScroll() {
    if (currentView === 'carousel') {
        const scrollLeft = photoContainer.scrollLeft;
        const scrollWidth = photoContainer.scrollWidth;
        const clientWidth = photoContainer.clientWidth;
        
        // Добавляем индикатор прогресса
        const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
        updateCarouselProgress(progress);
    }
}

function updateCarouselProgress(progress) {
    let progressBar = document.querySelector('.carousel-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'carousel-progress';
        progressBar.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            z-index: 100;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.background = `linear-gradient(to right, #ff6b6b ${progress}%, rgba(255, 255, 255, 0.3) ${progress}%)`;
}

// Дополнительные эффекты
function addSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #ffd700;
        border-radius: 50%;
        pointer-events: none;
        animation: sparkleAnimation 1s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
    sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Добавляем CSS для эффекта искр
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnimation {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Добавляем эффект искр при клике на фотографии
document.addEventListener('click', (e) => {
    if (e.target.closest('.photo')) {
        addSparkleEffect(e.target.closest('.photo'));
    }
});

// Инициализация Intersection Observer для ленивой загрузки
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

// Применяем observer к изображениям после их создания
setTimeout(() => {
    document.querySelectorAll('.photo img').forEach(img => {
        imageObserver.observe(img);
    });
}, 100);

console.log('🎉 Фотоальбом-Конфетка загружен! Наслаждайтесь красивыми воспоминаниями! ✨');