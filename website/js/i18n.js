(function () {
    const STORAGE_KEY = 'pressPortalLanguage';

    const translations = {
        es: {
            'common.backPortal': 'Volver al portal',
            'privacy.title': 'Política de Privacidad',
            'privacy.heading': 'Política de Privacidad',
            'privacy.p1': 'Este portal recopila únicamente los datos ingresados voluntariamente en formularios de contacto, suscripción y registro de periodistas.',
            'privacy.p2': 'La información se usa para gestionar solicitudes de prensa y enviar comunicaciones oficiales relacionadas con el portal.',
            'privacy.p3': 'Para solicitar actualización o eliminación de datos, escriba a <a href="mailto:prensa@organizacion.org">prensa@organizacion.org</a>.',
            'terms.title': 'Términos de Uso',
            'terms.heading': 'Términos de Uso',
            'terms.p1': 'El contenido de este portal está destinado a uso informativo y cobertura periodística autorizada.',
            'terms.p2': 'El material embargado no puede publicarse antes de la fecha y hora indicadas en cada recurso.',
            'terms.p3': 'El uso del portal implica aceptación de estas condiciones y de la política de privacidad.',
            'accessibility.title': 'Accesibilidad',
            'accessibility.heading': 'Declaración de Accesibilidad',
            'accessibility.p1': 'Este portal aplica mejoras de navegación por teclado, foco visible y mensajes de estado accesibles para formularios y búsqueda.',
            'accessibility.p2': 'Si encuentra barreras de accesibilidad, envíe detalles a <a href="mailto:prensa@organizacion.org">prensa@organizacion.org</a>.',
            'ui.search.empty': 'Escribe un término para iniciar la búsqueda.',
            'ui.search.none': 'No se encontraron coincidencias con los filtros seleccionados.',
            'ui.search.results': 'Se encontraron {count} coincidencias.',
            'ui.subscribe.invalid': 'Ingresa un correo electrónico válido.',
            'ui.subscribe.duplicate': 'Este correo ya está suscrito.',
            'ui.subscribe.success': 'Suscripción registrada correctamente.',
            'ui.form.required': 'Completa los campos obligatorios para continuar.',
            'ui.form.success': 'Solicitud enviada. Te contactaremos por correo.',
            'ui.modal.closeGallery': 'Cerrar galería',
            'ui.modal.download': 'Descargar',
            'ui.modal.closeEvent': 'Cerrar evento',
            'ui.nav.open': 'Abrir menú',
            'ui.nav.close': 'Cerrar menú',
            'nav.portalTitle': 'Portal Internacional de Prensa',
            'nav.home': 'Inicio',
            'nav.news': 'Noticias',
            'nav.releases': 'Comunicados',
            'nav.multimedia': 'Multimedia',
            'nav.events': 'Eventos',
            'nav.registration': 'Registro de Periodistas',
            'nav.embargoed': 'Material Embargado',
            'nav.contact': 'Contacto',
            'nav.pressKits': 'Kits de Prensa',
            'nav.team': 'Equipo',
            'nav.more': 'Más',
            'quick.button': 'Registro de Periodistas',
            'quick.title': 'Registro Rápido',
            'quick.name': 'Nombre completo *',
            'quick.media': 'Medio de comunicación *',
            'quick.email': 'Correo electrónico *',
            'quick.country': 'País de origen *',
            'quick.selectCountry': 'Seleccione un país',
            'quick.submit': 'Enviar solicitud',
            'quick.success': '¡Gracias por registrarse! Recibirá un correo de confirmación en breve.'
        },
        en: {
            'common.backPortal': 'Return to portal',
            'privacy.title': 'Privacy Policy',
            'privacy.heading': 'Privacy Policy',
            'privacy.p1': 'This portal collects only the information voluntarily provided through contact, subscription, and journalist registration forms.',
            'privacy.p2': 'The information is used to manage press requests and to send official communications related to the portal.',
            'privacy.p3': 'To request an update or deletion of your data, please write to <a href="mailto:prensa@organizacion.org">prensa@organizacion.org</a>.',
            'terms.title': 'Terms of Use',
            'terms.heading': 'Terms of Use',
            'terms.p1': 'The content of this portal is intended for informational use and authorized journalistic coverage.',
            'terms.p2': 'Embargoed material may not be published before the date and time indicated for each resource.',
            'terms.p3': 'Use of this portal implies acceptance of these conditions and of the privacy policy.',
            'accessibility.title': 'Accessibility',
            'accessibility.heading': 'Accessibility Statement',
            'accessibility.p1': 'This portal implements improvements for keyboard navigation, visible focus, and accessible status messages for forms and search.',
            'accessibility.p2': 'If you encounter accessibility barriers, please send details to <a href="mailto:prensa@organizacion.org">prensa@organizacion.org</a>.',
            'ui.search.empty': 'Please enter a term to begin searching.',
            'ui.search.none': 'No matches were found for the selected filters.',
            'ui.search.results': '{count} matches were found.',
            'ui.subscribe.invalid': 'Please enter a valid email address.',
            'ui.subscribe.duplicate': 'This email is already subscribed.',
            'ui.subscribe.success': 'Subscription completed successfully.',
            'ui.form.required': 'Please complete all required fields to continue.',
            'ui.form.success': 'Your request has been submitted. We will contact you by email.',
            'ui.modal.closeGallery': 'Close gallery',
            'ui.modal.download': 'Download',
            'ui.modal.closeEvent': 'Close event',
            'ui.nav.open': 'Open menu',
            'ui.nav.close': 'Close menu',
            'nav.portalTitle': 'International Press Portal',
            'nav.home': 'Home',
            'nav.news': 'News',
            'nav.releases': 'Press Releases',
            'nav.multimedia': 'Multimedia',
            'nav.events': 'Events',
            'nav.registration': 'Journalist Registration',
            'nav.embargoed': 'Embargoed Material',
            'nav.contact': 'Contact',
            'nav.pressKits': 'Press Kits',
            'nav.team': 'Team',
            'nav.more': 'More',
            'quick.button': 'Journalist Registration',
            'quick.title': 'Quick Registration',
            'quick.name': 'Full name *',
            'quick.media': 'Media outlet *',
            'quick.email': 'Email address *',
            'quick.country': 'Country of origin *',
            'quick.selectCountry': 'Select a country',
            'quick.submit': 'Submit request',
            'quick.success': 'Thank you for registering. You will receive a confirmation email shortly.'
        }
    };

    const indexBindings = [
        ['#inicio h1', 'Departamento de Prensa y Comunicaciones', 'Department of Press and Communications'],
        ['.search-btn', '<i class=\"fas fa-search\"></i> Buscar', '<i class=\"fas fa-search\"></i> Search'],
        ['.search-input', 'Buscar noticias, comunicados, eventos...', 'Search news, press releases, events...'],
        ['.footer-title', null, null]
    ];

    function getLanguage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'en' ? 'en' : 'es';
    }

    function setLanguage(lang) {
        const language = lang === 'en' ? 'en' : 'es';
        localStorage.setItem(STORAGE_KEY, language);
        document.documentElement.lang = language;
        applyTranslations(language);
        setActiveButton(language);
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: language } }));
    }

    function translateKey(key, replacements) {
        const lang = getLanguage();
        let value = (translations[lang] && translations[lang][key]) || (translations.es[key]) || key;
        if (replacements) {
            Object.keys(replacements).forEach(function (name) {
                value = value.replace('{' + name + '}', String(replacements[name]));
            });
        }
        return value;
    }

    function applyTranslations(lang) {
        document.querySelectorAll('[data-i18n]').forEach(function (element) {
            const key = element.getAttribute('data-i18n');
            const value = (translations[lang] && translations[lang][key]) || (translations.es[key]);
            if (!value) return;
            if (value.indexOf('<') >= 0) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        });

        if (document.body && document.body.classList !== undefined) {
            applyIndexBindings(lang);
        }
    }

    function applyIndexBindings(lang) {
        if (!document.querySelector('#inicio')) return;

        indexBindings.forEach(function (binding, index) {
            const target = document.querySelector(binding[0]);
            if (!target) return;
            const key = 'index.auto.' + index;
            target.setAttribute('data-i18n', key);
            translations.es[key] = binding[1] || target.innerHTML;
            translations.en[key] = binding[2] || target.innerHTML;
            target.innerHTML = lang === 'en' ? translations.en[key] : translations.es[key];
        });

        const navToggle = document.querySelector('.nav-toggle');
        const navClose = document.querySelector('.nav-close');
        if (navToggle) navToggle.setAttribute('aria-label', translateKey('ui.nav.open'));
        if (navClose) navClose.setAttribute('aria-label', translateKey('ui.nav.close'));
    }

    function setActiveButton(lang) {
        document.querySelectorAll('.language-btn[data-lang]').forEach(function (btn) {
            const active = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.language-btn[data-lang]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLanguage(btn.getAttribute('data-lang'));
            });
        });
        setLanguage(getLanguage());
    });

    window.PressPortalI18n = { setLanguage: setLanguage, getLanguage: getLanguage, t: translateKey };
})();
