// Funcionalidades principales para el Sitio Web Internacional de Prensa

document.addEventListener('DOMContentLoaded', function () {
    setupMobileNavigation();
    setupNewsFilters();
    setupGallery();
    setupCalendar();
    setupSearch();
    setupSubscription();
    setupJournalistRegistration();
    setupImageFallback();
});

function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navClose = document.querySelector('.nav-close');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu || !navClose || !navOverlay) {
        return;
    }

    const closeMenu = function () {
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const openMenu = function () {
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    navToggle.addEventListener('click', openMenu);
    navClose.addEventListener('click', closeMenu);
    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth < 992) {
                closeMenu();
            }
        });
    });

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) {
            closeMenu();
        }
    });
}

function setupNewsFilters() {
    const newsFilters = Array.from(document.querySelectorAll('.news-filter'));
    const newsItems = document.querySelectorAll('.news-item');

    if (!newsFilters.length || !newsItems.length) {
        return;
    }

    const activateFilter = function (selectedFilter) {
        const category = selectedFilter.getAttribute('data-category');

        newsFilters.forEach(function (filter) {
            const isActive = filter === selectedFilter;
            filter.classList.toggle('active', isActive);
            filter.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        newsItems.forEach(function (item) {
            const visible = category === 'all' || item.getAttribute('data-category') === category;
            item.style.display = visible ? '' : 'none';
        });
    };

    newsFilters.forEach(function (filter, index) {
        filter.addEventListener('click', function () {
            activateFilter(filter);
        });

        filter.addEventListener('keydown', function (event) {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                return;
            }

            event.preventDefault();
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (index + direction + newsFilters.length) % newsFilters.length;
            newsFilters[nextIndex].focus();
        });
    });
}

function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryItems.length) {
        return;
    }

    const closeOnEscape = function (event) {
        if (event.key === 'Escape') {
            const modal = document.querySelector('.gallery-modal');
            if (modal) {
                removeModal(modal, closeOnEscape);
            }
        }
    };

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const image = item.querySelector('img');
            const titleEl = item.querySelector('.gallery-title');
            const typeEl = item.querySelector('.gallery-type');

            if (!image || !titleEl || !typeEl) {
                return;
            }

            const modal = buildGalleryModal(image.src, titleEl.textContent, typeEl.textContent);
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', closeOnEscape);
            modal.querySelector('.gallery-modal-close').focus();

            modal.addEventListener('click', function (event) {
                if (event.target === modal || event.target.classList.contains('gallery-modal-close')) {
                    removeModal(modal, closeOnEscape);
                }
            });
        });
    });
}

function buildGalleryModal(imgSrc, imgTitle, imgType) {
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    const content = document.createElement('div');
    content.className = 'gallery-modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'gallery-modal-close';
    closeBtn.setAttribute('aria-label', window.PressPortalI18n ? window.PressPortalI18n.t('ui.modal.closeGallery') : 'Cerrar galería');
    closeBtn.textContent = '×';

    const image = document.createElement('img');
    image.src = imgSrc;
    image.alt = imgTitle;
    image.className = 'gallery-modal-img';

    const info = document.createElement('div');
    info.className = 'gallery-modal-info';

    const title = document.createElement('h3');
    title.className = 'gallery-modal-title';
    title.textContent = imgTitle;

    const type = document.createElement('p');
    type.className = 'gallery-modal-type';
    type.textContent = imgType;

    const actions = document.createElement('div');
    actions.className = 'gallery-modal-actions';

    const downloadLink = document.createElement('a');
    downloadLink.href = imgSrc;
    downloadLink.className = 'btn';
    downloadLink.textContent = window.PressPortalI18n ? window.PressPortalI18n.t('ui.modal.download') : 'Descargar';
    downloadLink.setAttribute('download', '');

    actions.appendChild(downloadLink);
    info.appendChild(title);
    info.appendChild(type);
    info.appendChild(actions);
    content.appendChild(closeBtn);
    content.appendChild(image);
    content.appendChild(info);
    modal.appendChild(content);

    return modal;
}

function setupCalendar() {
    const calendarEl = document.querySelector('.calendar');
    const calendarGrid = document.querySelector('.calendar-grid');
    const calendarTitle = document.querySelector('.calendar-title');
    const prevBtn = document.querySelector('.calendar-prev');
    const nextBtn = document.querySelector('.calendar-next');

    if (!calendarEl || !calendarGrid || !calendarTitle || !prevBtn || !nextBtn) {
        return;
    }

    const now = new Date();
    const eventYear = now.getFullYear();
    const eventsByDate = {};
    eventsByDate[eventYear + '-04-10'] = [{ title: 'Conferencia de Prensa', details: 'Conferencia para medios internacionales.' }];
    eventsByDate[eventYear + '-04-15'] = [{ title: 'Cumbre Internacional', details: 'Apertura de la cumbre y rueda de prensa.' }];
    eventsByDate[eventYear + '-04-16'] = [{ title: 'Cumbre Internacional', details: 'Sesiones técnicas y entrevistas.' }];
    eventsByDate[eventYear + '-04-17'] = [{ title: 'Cumbre Internacional', details: 'Cierre y comunicado oficial.' }];
    eventsByDate[eventYear + '-04-25'] = [{ title: 'Seminario Virtual', details: 'Evento virtual para periodistas registrados.' }];
    eventsByDate[eventYear + '-04-30'] = [{ title: 'Reunión de Directores', details: 'Briefing de resultados trimestrales.' }];

    const state = { month: now.getMonth(), year: now.getFullYear() };

    const renderCalendar = function () {
        const firstDay = new Date(state.year, state.month, 1);
        const firstWeekday = firstDay.getDay();
        const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
        const monthName = firstDay.toLocaleDateString('es-ES', { month: 'long' });

        calendarTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' ' + state.year;
        calendarGrid.innerHTML = '';

        for (let i = 0; i < firstWeekday; i += 1) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day calendar-day--empty';
            emptyDay.setAttribute('aria-hidden', 'true');
            calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';

            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-date';
            dayNumber.textContent = String(day);
            dayEl.appendChild(dayNumber);

            const key = formatCalendarKey(state.year, state.month, day);
            const events = eventsByDate[key] || [];

            events.forEach(function (eventData) {
                const eventButton = document.createElement('button');
                eventButton.type = 'button';
                eventButton.className = 'calendar-event';
                eventButton.textContent = eventData.title;
                eventButton.addEventListener('click', function () {
                    showEventModal(eventData.title, formatLongDate(state.year, state.month, day), eventData.details);
                });
                dayEl.appendChild(eventButton);
            });

            calendarGrid.appendChild(dayEl);
        }
    };

    prevBtn.addEventListener('click', function () {
        state.month -= 1;
        if (state.month < 0) {
            state.month = 11;
            state.year -= 1;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', function () {
        state.month += 1;
        if (state.month > 11) {
            state.month = 0;
            state.year += 1;
        }
        renderCalendar();
    });

    renderCalendar();
}

function showEventModal(title, dateLabel, details) {
    const modal = document.createElement('div');
    modal.className = 'event-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    const content = document.createElement('div');
    content.className = 'event-modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'event-modal-close';
    closeBtn.setAttribute('aria-label', window.PressPortalI18n ? window.PressPortalI18n.t('ui.modal.closeEvent') : 'Cerrar evento');
    closeBtn.textContent = '×';

    const titleEl = document.createElement('h3');
    titleEl.className = 'event-modal-title';
    titleEl.textContent = title;

    const dateEl = document.createElement('p');
    dateEl.className = 'event-modal-date';
    dateEl.textContent = dateLabel;

    const detailsEl = document.createElement('p');
    detailsEl.className = 'event-modal-details';
    detailsEl.textContent = details;

    content.appendChild(closeBtn);
    content.appendChild(titleEl);
    content.appendChild(dateEl);
    content.appendChild(detailsEl);
    modal.appendChild(content);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const closeModal = function () {
        document.body.style.overflow = '';
        modal.remove();
        window.removeEventListener('keydown', onEscape);
    };

    const onEscape = function (event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    modal.addEventListener('click', function (event) {
        if (event.target === modal || event.target.classList.contains('event-modal-close')) {
            closeModal();
        }
    });

    window.addEventListener('keydown', onEscape);
    closeBtn.focus();
}

function setupSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchFeedback = document.querySelector('.search-feedback');

    if (!searchForm || !searchInput || !searchFeedback) {
        return;
    }

    const searchableSelectors = {
        noticias: '#noticias .news-item',
        comunicados: '#comunicados .card',
        eventos: '#eventos .calendar-event',
        multimedia: '#multimedia .gallery-item'
    };

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        clearSearchHighlights();

        const searchTerm = normalizeText(searchInput.value.trim());
        if (!searchTerm) {
            setFeedback(searchFeedback, window.PressPortalI18n ? window.PressPortalI18n.t('ui.search.empty') : 'Escribe un término para iniciar la búsqueda.', 'error');
            return;
        }

        const selectedFilters = Array.from(document.querySelectorAll('.search-filter-input:checked')).map(function (input) {
            return input.value;
        });

        const activeFilters = selectedFilters.length ? selectedFilters : Object.keys(searchableSelectors);
        const results = [];

        activeFilters.forEach(function (filterKey) {
            const selector = searchableSelectors[filterKey];
            if (!selector) {
                return;
            }

            document.querySelectorAll(selector).forEach(function (element) {
                const text = normalizeText(element.textContent || '');
                if (text.includes(searchTerm)) {
                    element.classList.add('search-match');
                    results.push(element);
                }
            });
        });

        if (!results.length) {
            setFeedback(searchFeedback, window.PressPortalI18n ? window.PressPortalI18n.t('ui.search.none') : 'No se encontraron coincidencias con los filtros seleccionados.', 'error');
            return;
        }

        const firstResult = results[0];
        if (!firstResult.matches('a, button, input, select, textarea, [tabindex]')) {
            firstResult.setAttribute('tabindex', '-1');
            firstResult.dataset.tempTabindex = 'true';
        }

        firstResult.focus({ preventScroll: true });
        firstResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setFeedback(searchFeedback, window.PressPortalI18n ? window.PressPortalI18n.t('ui.search.results', { count: results.length }) : ('Se encontraron ' + results.length + ' coincidencias.'), 'success');
    });
}

function clearSearchHighlights() {
    document.querySelectorAll('.search-match').forEach(function (el) {
        el.classList.remove('search-match');
        if (el.dataset.tempTabindex === 'true') {
            el.removeAttribute('tabindex');
            delete el.dataset.tempTabindex;
        }
    });
}

function setupSubscription() {
    const subscribeForm = document.querySelector('.subscribe-form');
    const emailInput = subscribeForm ? subscribeForm.querySelector('.subscribe-input') : null;
    const feedbackEl = document.querySelector('.subscribe-feedback');
    const storageKey = 'pressPortalSubscriptions';

    if (!subscribeForm || !emailInput || !feedbackEl) {
        return;
    }

    subscribeForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        if (!isValidEmail(email)) {
            setFeedback(feedbackEl, window.PressPortalI18n ? window.PressPortalI18n.t('ui.subscribe.invalid') : 'Ingresa un correo electrónico válido.', 'error');
            return;
        }

        const subscriptions = readStorageArray(storageKey);
        const alreadySubscribed = subscriptions.some(function (entry) {
            return entry.email === email;
        });

        if (alreadySubscribed) {
            setFeedback(feedbackEl, window.PressPortalI18n ? window.PressPortalI18n.t('ui.subscribe.duplicate') : 'Este correo ya está suscrito.', 'error');
            return;
        }

        subscriptions.push({
            email: email,
            subscribedAt: new Date().toISOString()
        });
        localStorage.setItem(storageKey, JSON.stringify(subscriptions));

        subscribeForm.reset();
        setFeedback(feedbackEl, window.PressPortalI18n ? window.PressPortalI18n.t('ui.subscribe.success') : 'Suscripción registrada correctamente.', 'success');
    });
}

function setupJournalistRegistration() {
    const form = document.getElementById('journalist-registration');
    const feedbackEl = form ? form.querySelector('.form-feedback') : null;
    const storageKey = 'pressPortalJournalistRegistrations';

    if (!form || !feedbackEl) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            setFeedback(feedbackEl, window.PressPortalI18n ? window.PressPortalI18n.t('ui.form.required') : 'Completa los campos obligatorios para continuar.', 'error');
            return;
        }

        const formData = new FormData(form);
        const areasSelect = form.querySelector('#areas');
        const areas = areasSelect
            ? Array.from(areasSelect.selectedOptions).map(function (option) { return option.value; })
            : [];

        const records = readStorageArray(storageKey);
        records.push({
            fullName: formData.get('full-name') || '',
            email: formData.get('email') || '',
            mediaOutlet: formData.get('media-outlet') || '',
            position: formData.get('position') || '',
            country: formData.get('country') || '',
            phone: formData.get('phone') || '',
            areas: areas,
            comments: formData.get('comments') || '',
            newsletter: formData.get('newsletter') === 'on',
            submittedAt: new Date().toISOString()
        });

        localStorage.setItem(storageKey, JSON.stringify(records));
        form.reset();
        setFeedback(feedbackEl, window.PressPortalI18n ? window.PressPortalI18n.t('ui.form.success') : 'Solicitud enviada. Te contactaremos por correo.', 'success');
    });
}

function setupImageFallback() {
    const placeholderPath = 'images/placeholder.svg';
    const images = document.querySelectorAll('img');

    images.forEach(function (img) {
        img.addEventListener('error', function () {
            if (img.dataset.fallbackApplied === 'true') {
                return;
            }
            img.dataset.fallbackApplied = 'true';
            img.src = placeholderPath;
        });
    });
}

function setFeedback(element, message, type) {
    element.textContent = message;
    element.classList.remove('is-success', 'is-error');
    element.classList.add(type === 'success' ? 'is-success' : 'is-error');
}

function readStorageArray(key) {
    try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function removeModal(modal, handler) {
    document.body.style.overflow = '';
    modal.remove();
    window.removeEventListener('keydown', handler);
}

function formatCalendarKey(year, month, day) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return year + '-' + mm + '-' + dd;
}

function formatLongDate(year, month, day) {
    const date = new Date(year, month, day);
    return date.toLocaleDateString((window.PressPortalI18n && window.PressPortalI18n.getLanguage() === 'en') ? 'en-US' : 'es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function normalizeText(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
