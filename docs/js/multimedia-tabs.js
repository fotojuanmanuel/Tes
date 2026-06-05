// Funcionalidad para las pestañas multimedia
document.addEventListener('DOMContentLoaded', function () {
    const tabs = Array.from(document.querySelectorAll('.multimedia-tab'));
    const contents = Array.from(document.querySelectorAll('.multimedia-content'));
    const tabsContainer = document.querySelector('.multimedia-tabs');

    if (!tabsContainer || !tabs.length || !contents.length) {
        return;
    }

    const activateTab = function (tabToActivate) {
        const tabId = tabToActivate.getAttribute('data-tab');
        if (!tabId) {
            return;
        }

        tabs.forEach(function (tab) {
            const isActive = tab === tabToActivate;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        contents.forEach(function (content) {
            const isActive = content.id === tabId + '-content';
            content.classList.toggle('active', isActive);
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-labelledby', 'tab-' + tabId);
            content.toggleAttribute('hidden', !isActive);
        });
    };

    tabsContainer.addEventListener('click', function (event) {
        const target = event.target.closest('.multimedia-tab');
        if (!target) {
            return;
        }
        activateTab(target);
    });

    tabsContainer.addEventListener('keydown', function (event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            return;
        }

        const activeIndex = tabs.findIndex(function (tab) {
            return tab.getAttribute('aria-selected') === 'true';
        });
        if (activeIndex < 0) {
            return;
        }

        event.preventDefault();
        let nextIndex = activeIndex;

        if (event.key === 'ArrowRight') {
            nextIndex = (activeIndex + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = tabs.length - 1;
        }

        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
    });

    // Mejora de rendimiento para imágenes de galería.
    document.querySelectorAll('.gallery-img').forEach(function (img) {
        img.loading = 'lazy';
        img.decoding = 'async';
    });

    const firstActiveTab = tabs.find(function (tab) {
        return tab.classList.contains('active');
    }) || tabs[0];
    activateTab(firstActiveTab);
});
