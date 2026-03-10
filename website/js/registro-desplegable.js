// Funcionalidad para el formulario de registro desplegable

function t(key, fallback) {
    return window.PressPortalI18n ? window.PressPortalI18n.t(key) : fallback;
}

function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }

    return input.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Crear el elemento del botón de registro y el formulario
    const registroHTML = `
        <div class="registro-desplegable">
            <button class="registro-btn" id="registro-toggle-btn" aria-expanded="false" aria-controls="registro-form-container">
                <i class="fas fa-user-edit"></i> ${t('quick.button', 'Registro de Periodistas')}
            </button>
            <div class="registro-form-container" id="registro-form-container">
                <div class="registro-form-header">
                    <h3 class="registro-form-title">${t('quick.title', 'Registro Rápido')}</h3>
                    <button class="registro-form-close" id="registro-form-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form class="registro-mini-form" id="registro-mini-form">
                    <div class="registro-form-group">
                        <label for="registro-nombre" class="registro-form-label">${t('quick.name', 'Nombre completo *')}</label>
                        <input type="text" id="registro-nombre" name="nombre" class="registro-form-input" required>
                    </div>
                    <div class="registro-form-group">
                        <label for="registro-medio" class="registro-form-label">${t('quick.media', 'Medio de comunicación *')}</label>
                        <input type="text" id="registro-medio" name="medio" class="registro-form-input" required>
                    </div>
                    <div class="registro-form-group">
                        <label for="registro-email" class="registro-form-label">${t('quick.email', 'Correo electrónico *')}</label>
                        <input type="email" id="registro-email" name="email" class="registro-form-input" required>
                    </div>
                    <div class="registro-form-group">
                        <label for="registro-pais" class="registro-form-label">${t('quick.country', 'País de origen *')}</label>
                        <select id="registro-pais" name="pais" class="registro-form-select" required>
                            <option value="">${t('quick.selectCountry', 'Seleccione un país')}</option>
                            <option value="argentina">Argentina</option>
                            <option value="bolivia">Bolivia</option>
                            <option value="brasil">Brasil</option>
                            <option value="chile">Chile</option>
                            <option value="colombia">Colombia</option>
                            <option value="costa-rica">Costa Rica</option>
                            <option value="cuba">Cuba</option>
                            <option value="ecuador">Ecuador</option>
                            <option value="el-salvador">El Salvador</option>
                            <option value="espana">España</option>
                            <option value="estados-unidos">Estados Unidos</option>
                            <option value="guatemala">Guatemala</option>
                            <option value="honduras">Honduras</option>
                            <option value="mexico">México</option>
                            <option value="nicaragua">Nicaragua</option>
                            <option value="panama">Panamá</option>
                            <option value="paraguay">Paraguay</option>
                            <option value="peru">Perú</option>
                            <option value="republica-dominicana">República Dominicana</option>
                            <option value="uruguay">Uruguay</option>
                            <option value="venezuela">Venezuela</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <button type="submit" class="registro-form-submit">${t('quick.submit', 'Enviar solicitud')}</button>
                </form>
                <div class="registro-success-message" id="registro-success-message">
                    ${t('quick.success', '¡Gracias por registrarse! Recibirá un correo de confirmación en breve.')}
                </div>
            </div>
        </div>
    `;
    
    // Insertar el HTML en el body
    document.body.insertAdjacentHTML('beforeend', registroHTML);
    
    // Obtener referencias a los elementos
    const toggleBtn = document.getElementById('registro-toggle-btn');
    const formContainer = document.getElementById('registro-form-container');
    const closeBtn = document.getElementById('registro-form-close');
    const miniForm = document.getElementById('registro-mini-form');
    const successMessage = document.getElementById('registro-success-message');
    
    // Mostrar/ocultar el formulario al hacer clic en el botón
    toggleBtn.addEventListener('click', function() {
        const isOpening = !formContainer.classList.contains('active');
        formContainer.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
    });
    
    // Cerrar el formulario al hacer clic en el botón de cierre
    const closeForm = function() {
        formContainer.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
    };
    closeBtn.addEventListener('click', closeForm);
    
    // Manejar el envío del formulario
    miniForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!miniForm.checkValidity()) {
            miniForm.reportValidity();
            return;
        }

        const recordsKey = 'pressPortalJournalistRegistrations';
        let existingRecords = [];
        try {
            const rawRecords = localStorage.getItem(recordsKey) || '[]';
            const parsedRecords = JSON.parse(rawRecords);
            existingRecords = Array.isArray(parsedRecords) ? parsedRecords : [];
        } catch (error) {
            existingRecords = [];
        }
        const emailValue = sanitizeInput(miniForm.querySelector('#registro-email').value.trim().toLowerCase());

        existingRecords.push({
            fullName: sanitizeInput(miniForm.querySelector('#registro-nombre').value.trim()),
            mediaOutlet: sanitizeInput(miniForm.querySelector('#registro-medio').value.trim()),
            email: emailValue,
            country: sanitizeInput(miniForm.querySelector('#registro-pais').value),
            source: 'quick-form',
            submittedAt: new Date().toISOString()
        });
        localStorage.setItem(recordsKey, JSON.stringify(existingRecords));
        
        // Mostrar mensaje de éxito
        miniForm.style.display = 'none';
        successMessage.classList.add('active');
        
        // Ocultar el mensaje y restablecer el formulario después de 3 segundos
        setTimeout(function() {
            closeForm();
            setTimeout(function() {
                miniForm.style.display = 'flex';
                successMessage.classList.remove('active');
                miniForm.reset();
            }, 300);
        }, 3000);
    });
    
    // Cerrar el formulario al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!formContainer.contains(e.target) && !toggleBtn.contains(e.target)) {
            closeForm();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeForm();
        }
    });
});
