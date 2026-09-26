// Data & Configuration
// Canonical list of services (order and IDs are fixed here in app.js)
var _requiredServices = [
    { id: 'simples',     name: 'Lavagem Simples',     duration: 45, prices: { hatch: 60,  sedan: 70,  suv: 80,  moto: 0 }, features: ['Lavagem externa', 'Aspira\u00e7\u00e3o interna b\u00e1sica', 'Limpeza de vidros', 'Pretinho nos pneus'], popular: false },
    { id: 'tradicional', name: 'Lavagem Tradicional',  duration: 60, prices: { hatch: 80,  sedan: 100, suv: 120, moto: 0 }, features: ['Tudo da Simples', 'Aplica\u00e7\u00e3o de cera l\u00edquida', 'Limpeza de painel', 'Higieniza\u00e7\u00e3o de tapetes'], popular: true  },
    { id: 'detalhada',   name: 'Lavagem Detalhada',    duration: 90, prices: { hatch: 130, sedan: 150, suv: 170, moto: 0 }, features: ['Tudo da Tradicional', 'Enceramento manual', 'Limpeza de motor', 'Hidrata\u00e7\u00e3o de couro (se houver)'], popular: false },
    { id: 'exterior',    name: 'Lavagem Exterior',     duration: 45, prices: { hatch: 0,   sedan: 0,   suv: 0,   moto: 0 }, features: ['Lavagem detalhada', 'Cera de prote\u00e7\u00e3o', 'Revitaliza\u00e7\u00e3o de pl\u00e1sticos externos'], popular: false },
    { id: 'interior',    name: 'Lavagem Interior',     duration: 45, prices: { hatch: 0,   sedan: 0,   suv: 0,   moto: 0 }, features: ['Higieniza\u00e7\u00e3o de bancos', 'Limpeza de painel', 'Aspira\u00e7\u00e3o profunda'], popular: false }
];

function getServices() {
    // Always read FRESH from localStorage so admin price changes are instantly reflected
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem('milgrau_services')); } catch(e) {}

    // Build the canonical 5 services, merging any admin-configured prices on top
    return _requiredServices.map(function(req) {
        var custom = stored ? stored.find(function(s) { return s.id === req.id; }) : null;
        if (custom) {
            return {
                id:       req.id,
                name:     custom.name     || req.name,
                duration: custom.duration !== undefined ? custom.duration : req.duration,
                prices:   custom.prices   || req.prices,
                features: custom.features || req.features,
                popular:  custom.popular  !== undefined ? custom.popular  : req.popular
            };
        }
        return req;
    });
}

// milgrauTimeSlots and milgrauSettings.maxCapacity are loaded from car-database.js

// App State
var appointments = JSON.parse(localStorage.getItem('milgrau_appointments')) || [];
let currentServicesViewType = 'hatch';

window.updateServicesView = function(type) {
    currentServicesViewType = type;
    
    // Update button visual state
    const filterContainer = document.getElementById('services-vehicle-filter');
    if (filterContainer) {
        filterContainer.querySelectorAll('.btn-type').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.getAttribute('data-type') === type) {
                btn.classList.add('selected');
            }
        });
    }
    
    renderServices();
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderServices();
    renderAddons();
    renderDashboard();
    initCustomSelects();
    initAutocomplete();
    
    const form = document.getElementById('booking-form');
    if(form) {
        form.addEventListener('submit', handleBookingSubmit);
    }
    
    const searchInput = document.getElementById('search-client');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => renderDashboard(e.target.value));
    }

    const phoneInput = document.getElementById('client-phone');
    if(phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    const dateInput = document.getElementById('booking-date');
    if(dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayString = `${yyyy}-${mm}-${dd}`;
        
        // Set minimum to today and default value to today
        dateInput.min = todayString;
        dateInput.value = todayString;
        
        // Automatically load slots for today
        updateTimeSlots(todayString);
        
        dateInput.addEventListener('change', (e) => updateTimeSlots(e.target.value));
    }

    const serviceSelect = document.getElementById('service-select');
    
    if(serviceSelect) serviceSelect.addEventListener('change', updatePriceDisplay);
    
    // Init addons handled inside renderAddons()
    
    // Step Wizard Logic
    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    
    if(btnNext && btnPrev && step1 && step2) {
        btnNext.addEventListener('click', () => {
            const form = document.getElementById('booking-form');
            // Check if step 1 fields are valid
            if(!form.checkValidity()) {
                const invalidElements = form.querySelectorAll(':invalid');
                if(invalidElements.length > 0) {
                    const firstInvalid = invalidElements[0];
                    firstInvalid.focus();
                    let fieldName = "este campo";
                    if(firstInvalid.previousElementSibling && firstInvalid.previousElementSibling.tagName === 'LABEL') {
                        fieldName = firstInvalid.previousElementSibling.innerText;
                    }
                    MilGrauDialog.showToast(`Por favor, preencha: ${fieldName}`, "error");
                }
                return;
            }
            
            // Check if custom time/service is selected (they use hidden inputs)
            const serviceId = document.getElementById('service-select').value;
            const time = document.getElementById('booking-time').value;
            const vehicle = document.getElementById('vehicle-type').value;
            
            if(!serviceId || !time || !vehicle) {
                MilGrauDialog.showToast("Por favor, preencha todos os campos obrigatórios (Serviço, Data, Horário e Veículo).", "error");
                return;
            }
            
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            updatePriceDisplay(); // Ensure price is displayed on step 2
        });
        
        btnPrev.addEventListener('click', () => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        });
    }
});

// Navigation Logic (SPA)
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            if (target) {
                navigateTo(target);
            }
        });
    });
}

window.navigateTo = function(targetId) {
    // Update active view
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`view-${targetId}`);
    if(targetView) {
        targetView.classList.add('active');
    }
    
    // Update active nav link (except for dashboard icon which shouldn't change main nav active state visually unless desired)
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        if(link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Specific logic per view
    if (targetId === 'booking') {
        const select = document.getElementById('service-select');
        // Pre-select service based on URL hash or just refresh
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if (serviceParam && select) {
            select.value = serviceParam;
        }
    }
    
    if (targetId === 'dashboard') {
        renderDashboard();
    }
    
    window.scrollTo(0, 0);
};

// Render Services in Pricing View and Select Options
function renderServices() {
    const grid = document.querySelector('.pricing-grid');
    
    if (!grid) return;
    grid.innerHTML = '';
    
    getServices().forEach(service => {
        // Pricing Card
        const card = document.createElement('div');
        card.className = `price-card ${service.popular ? 'popular' : ''}`;
        
        const price = service.prices[currentServicesViewType] || 0;
        const priceDisplay = price > 0 ? `R$ ${price},00` : `Indisponível`;
        
        const featuresHtml = service.features.map(f => `<li><i class="ph-fill ph-check-circle"></i> ${f}</li>`).join('');
        
        card.innerHTML = `
            <div class="price-header">
                <h3>${service.name}</h3>
                <div class="price-value" style="font-size: 1.8rem; margin-top: 0.5rem; font-weight: bold; color: var(--primary);">${priceDisplay}</div>
            </div>
            <ul class="price-features">
                ${featuresHtml}
            </ul>
            <button class="btn-${service.popular ? 'primary' : 'secondary'} w-full" onclick="bookService('${service.id}')">Agendar Este</button>
        `;
        grid.appendChild(card);
    });
    
    updateServicesDropdown();
}

function updateServicesDropdown() {
    const itemsContainer = document.getElementById('service-items');
    const vehicleType = document.getElementById('vehicle-type') ? document.getElementById('vehicle-type').value : '';
    const trigger = document.querySelector('#custom-service .select-selected');
    const hidden = document.getElementById('service-select');
    
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    const defaultOpt = document.createElement('div');
    const defaultText = vehicleType ? 'Selecione um serviço' : 'Primeiro, informe seu veículo';
    defaultOpt.innerHTML = defaultText;
    defaultOpt.setAttribute('data-value', '');
    itemsContainer.appendChild(defaultOpt);
    
    if (!vehicleType) {
        if (trigger && !trigger.innerHTML.includes('Primeiro')) {
            trigger.innerHTML = defaultText;
            if (hidden) { hidden.value = ''; hidden.dispatchEvent(new Event('change')); }
        }
        return;
    }
    
    let hasSelected = false;
    getServices().forEach(service => {
        const option = document.createElement('div');
        const price = service.prices[vehicleType];
        const priceText = price > 0 ? ` - R$ ${price},00` : ` - Indisponível`;
        option.innerHTML = `${service.name}<span style="color: var(--brand-primary); font-weight: bold;">${priceText}</span>`;
        option.setAttribute('data-value', service.id);
        
        // Retain selection text if it was already selected
        if (hidden && hidden.value === service.id) {
            trigger.innerHTML = option.innerHTML;
            hasSelected = true;
        }
        
        itemsContainer.appendChild(option);
    });
    
    // If we have a vehicle type but no service is selected, update trigger text
    if (trigger && !hasSelected) {
        trigger.innerHTML = defaultText;
    }
}

function renderAddons() {
    const addonsSection = document.querySelector('.addons-section');
    const addonsContainer = document.getElementById('addons-grid-container');
    
    if (typeof milgrauSettings !== 'undefined' && milgrauSettings.enableAddons === false) {
        if (addonsSection) addonsSection.style.display = 'none';
        return;
    } else {
        if (addonsSection) addonsSection.style.display = 'block';
    }
    
    if (!addonsContainer) return;
    addonsContainer.innerHTML = '';
    
    if (typeof milgrauAddons === 'undefined') return;
    
    milgrauAddons.forEach(addon => {
        const card = document.createElement('div');
        card.className = 'addon-card';
        card.setAttribute('data-price', addon.price);
        card.setAttribute('data-name', addon.name);
        
        card.innerHTML = `
            <div class="addon-info">
                <span class="addon-title">${addon.name}</span>
                <span class="addon-price">+ R$ ${addon.price},00</span>
            </div>
            <div class="addon-check"><i class="ph-fill ph-check-circle"></i></div>
        `;
        
        card.addEventListener('click', function() {
            this.classList.toggle('active');
            updatePriceDisplay();
        });
        
        addonsContainer.appendChild(card);
    });
}

// Helper to pre-select and navigate
window.bookService = function(serviceId) {
    const hiddenInput = document.getElementById('service-select');
    const trigger = document.querySelector('#custom-service .select-selected');
    
    if(hiddenInput && trigger) {
        hiddenInput.value = serviceId;
        const serviceObj = getServices().find(s => s.id === serviceId);
        trigger.innerHTML = serviceObj ? `${serviceObj.name}` : serviceId;
        hiddenInput.dispatchEvent(new Event('change'));
    }
    navigateTo('booking');
};

// Handle Booking Form
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('booking-form');
    if(!form.checkValidity()) {
        const invalidElements = form.querySelectorAll(':invalid');
        if(invalidElements.length > 0) {
            const firstInvalid = invalidElements[0];
            firstInvalid.focus();
            let fieldName = "este campo";
            if(firstInvalid.previousElementSibling && firstInvalid.previousElementSibling.tagName === 'LABEL') {
                fieldName = firstInvalid.previousElementSibling.innerText;
            }
            MilGrauDialog.showToast(`Por favor, preencha: ${fieldName}`, "error");
        }
        return;
    }
    
    const serviceId = document.getElementById('service-select').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const vehicle = document.getElementById('client-vehicle').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    const vehicleColor = document.getElementById('vehicle-color').value;
    const notesInput = document.getElementById('booking-notes');
    const notes = notesInput ? notesInput.value : '';
    const honeypot = document.getElementById('milgrau-honeypot');
    
    // Anti-Bot: Honeypot check
    if(honeypot && honeypot.value !== '') {
        return; // Bot detected, silently reject
    }
    
    if(!time) {
        MilGrauDialog.showToast("Por favor, selecione um horário válido.", "error");
        return;
    }
    
    const serviceObj = getServices().find(s => s.id === serviceId);
    let finalPrice = "N/A";
    if(serviceObj && vehicleType && serviceObj.prices[vehicleType]) {
        finalPrice = `R$ ${serviceObj.prices[vehicleType]},00`;
    }
    
    // Anti-Spam Check: Prevent booking the same car again on the same day if there is already an active booking
    const duplicate = appointments.find(a => 
        a.date === date && 
        a.clientPhone === phone && 
        a.clientVehicle === vehicle && 
        (a.status === 'pendente' || a.status === 'confirmado')
    );
    
    if (duplicate) {
        MilGrauDialog.showToast("Você já tem um agendamento ativo para este veículo hoje.", "error");
        return;
    }
    
    const activeAddons = Array.from(document.querySelectorAll('.addon-card.active')).map(card => {
        return {
            name: card.getAttribute('data-name'),
            price: parseInt(card.getAttribute('data-price'))
        };
    });

    const appointment = {
        id: Date.now().toString(),
        serviceId: serviceId,
        serviceName: serviceObj ? serviceObj.name : serviceId,
        servicePrice: finalPrice,
        date: date,
        time: time,
        clientName: name,
        clientPhone: phone,
        clientVehicle: vehicle,
        vehicleType: vehicleType,
        vehicleColor: vehicleColor,
        notes: notes,
        addons: activeAddons,
        status: 'pendente',
        createdAt: new Date().toISOString()
    };
    
    appointments.push(appointment);
    saveAppointments();
    
    // Construct WhatsApp Message
    const formattedDate = date.split('-').reverse().join('/');
    let totalPriceNum = (serviceObj && serviceObj.prices[vehicleType]) ? serviceObj.prices[vehicleType] : 0;
    
    let addonsWaText = '';
    if (activeAddons.length > 0) {
        addonsWaText = '\n*--- SERVIÇOS EXTRAS ---*\n';
        activeAddons.forEach(addon => {
            totalPriceNum += addon.price;
            addonsWaText += `• ${addon.name} (+ R$ ${addon.price},00)\n`;
        });
    }

    let waMessage = `*ESTÉTICA MILGRAU - NOVO AGENDAMENTO*\n\n`;
    waMessage += `*Cliente:* ${name}\n`;
    waMessage += `*Contato:* ${phone}\n\n`;
    waMessage += `*--- DADOS DO VEÍCULO ---*\n`;
    waMessage += `*Modelo:* ${vehicle}\n`;
    waMessage += `*Cor:* ${vehicleColor}\n`;
    waMessage += `*Categoria:* ${vehicleType.toUpperCase()}\n\n`;
    waMessage += `*--- DETALHES DO SERVIÇO ---*\n`;
    waMessage += `*Lavagem:* ${serviceObj ? serviceObj.name : serviceId}\n`;
    waMessage += `*Data:* ${formattedDate}\n`;
    waMessage += `*Horário:* ${time}\n`;
    if(notes) waMessage += `*Observações:* ${notes}\n`;
    waMessage += addonsWaText + `\n`;
    waMessage += `*VALOR ESTIMADO:* *R$ ${totalPriceNum},00*\n\n`;
    waMessage += `_Aguardando confirmação do estabelecimento._`;

    const waNumber = milgrauSettings.whatsappNumber || '5549998396690';
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
    
    // Redirect to WhatsApp
    window.open(waLink, '_blank');

    // Show success message
    document.getElementById('booking-form').classList.add('hidden');
    document.getElementById('booking-success-msg').classList.remove('hidden');
    
    // Also reset steps
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    if(step1 && step2) {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        // Reset addons active state
        document.querySelectorAll('.addon-card.active').forEach(c => c.classList.remove('active'));
    }
}

window.resetBookingForm = function() {
    document.getElementById('booking-form').reset();
    document.getElementById('booking-form').classList.remove('hidden');
    document.getElementById('booking-success-msg').classList.add('hidden');
};

// Dashboard Logic
function renderDashboard(filter = '') {
    const tbody = document.getElementById('appointments-tbody');
    const emptyState = document.getElementById('empty-state');
    const statTotal = document.getElementById('stat-total');
    
    if (!tbody) return;
    
    let filtered = appointments;
    if (filter) {
        const lowerFilter = filter.toLowerCase();
        filtered = appointments.filter(a => 
            (a.clientName && a.clientName.toLowerCase().includes(lowerFilter)) || 
            (a.clientVehicle && a.clientVehicle.toLowerCase().includes(lowerFilter)) ||
            (a.vehicle && a.vehicle.toLowerCase().includes(lowerFilter))
        );
    }
    
    // Sort by date/time (closest first)
    filtered.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    
    statTotal.textContent = appointments.length;
    
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        tbody.parentElement.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        tbody.parentElement.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        tbody.innerHTML = filtered.map(app => {
            // Format date to DD/MM/YYYY
            const dateObj = new Date(`${app.date}T00:00:00`);
            const formattedDate = dateObj.toLocaleDateString('pt-BR');
            const service = getServices().find(s => s.id === app.serviceId);
            
            const addonsText = app.addons && app.addons.length > 0 
                ? `<br><small style="color: var(--brand-primary); font-size: 0.75rem;">+ ${app.addons.map(a => a.name).join(', ')}</small>` 
                : '';
            
            return `
            <tr>
                <td>
                    ${service ? service.name : (app.serviceName || 'Desconhecido')}
                    ${addonsText}
                </td>
                <td>
                    <strong>${formattedDate}</strong><br>
                    <small class="text-secondary">${app.time}</small>
                </td>
                <td>
                    <strong>${app.clientName}</strong><br>
                    <small>${app.clientPhone}</small>
                </td>
                <td>
                    ${app.clientVehicle || app.vehicle || ''} <span style="text-transform: uppercase; font-size: 0.7rem; padding: 2px 4px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-left: 5px;">${app.vehicleType || '-'}</span><br>
                    <small class="text-secondary">Cor: ${app.vehicleColor || '-'}</small>
                </td>
                <td><span class="status-badge status-${app.status || 'pendente'}">${app.status || 'pendente'}</span></td>
                <td>
                    <button class="icon-btn btn-success" onclick="updateStatus('${app.id}', 'concluido')" title="Marcar como Concluído">
                        <i class="ph ph-check-circle"></i>
                    </button>
                    <button class="icon-btn btn-danger" onclick="deleteAppointment('${app.id}')" title="Cancelar/Deletar">
                        <i class="ph ph-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    }
}

window.deleteAppointment = function(id) {
    MilGrauDialog.confirm('Tem certeza que deseja cancelar este agendamento?', () => {
        appointments = appointments.filter(a => a.id !== id);
        saveAppointments();
        renderDashboard();
    });
};

function saveAppointments() {
    localStorage.setItem('milgrau_appointments', JSON.stringify(appointments));
}

// Price Calculation
function updatePriceDisplay() {
    const serviceId = document.getElementById('service-select') ? document.getElementById('service-select').value : '';
    const vehicleType = document.getElementById('vehicle-type') ? document.getElementById('vehicle-type').value : '';
    const priceContainer = document.getElementById('calculated-price-container');
    const priceDisplay = document.getElementById('calculated-price');
    
    if(serviceId && vehicleType) {
        const service = getServices().find(s => s.id === serviceId);
        if(service) {
            let basePrice = (service.prices && service.prices[vehicleType] !== undefined) ? service.prices[vehicleType] : 0;
            
            // Add addons
            const activeAddons = document.querySelectorAll('.addon-card.active');
            activeAddons.forEach(card => {
                basePrice += parseInt(card.getAttribute('data-price') || 0);
            });
            
            if(priceDisplay) priceDisplay.innerHTML = basePrice > 0 ? `R$ ${basePrice},00` : `A Configurar`;
            if(priceContainer) priceContainer.classList.remove('hidden');
            return;
        }
    }
    if(priceContainer) priceContainer.classList.add('hidden');
}

// Time Slot Calculation
function updateTimeSlots(dateString) {
    const timeItems = document.getElementById('time-items');
    const timeTrigger = document.querySelector('#custom-time .select-selected');
    const timeInput = document.getElementById('booking-time');
    
    if(!timeItems) return;
    
    if(!dateString) {
        timeItems.innerHTML = '';
        timeTrigger.innerHTML = 'Selecione uma data primeiro';
        timeInput.value = '';
        return;
    }
    
    const selectedDate = new Date(dateString + 'T00:00:00'); // Prevent timezone shift
    const dayOfWeek = selectedDate.getDay(); // 0 is Sunday, 6 is Saturday
    const workingDays = typeof milgrauSettings !== 'undefined' && milgrauSettings.workingDays ? milgrauSettings.workingDays : [false, true, true, true, true, true, true];
    
    if(!workingDays[dayOfWeek]) {
        timeItems.innerHTML = '';
        timeTrigger.innerHTML = 'Fechado neste dia da semana';
        timeTrigger.style.color = '#ef4444'; // red
        timeInput.value = '';
        return;
    }
    timeTrigger.style.color = ''; // reset
    
    // Count appointments on this date per slot
    const slotCounts = {};
    const slots = typeof milgrauTimeSlots !== 'undefined' ? milgrauTimeSlots : ["08:00", "09:30", "10:30", "13:30", "15:00", "16:30"];
    const maxCapacity = typeof milgrauSettings !== 'undefined' && milgrauSettings.maxCapacity ? milgrauSettings.maxCapacity : 3;
    
    const dayAppointments = appointments.filter(a => a.date === dateString);
    
    const durations = milgrauSettings.vehicleDurations || { hatch: 60, sedan: 60, suv: 120, moto: 60 };
    
    const timeToMins = (t) => {
        const [h, m] = t.split(':').map(Number);
        return (h * 60) + m;
    };
    
    slots.forEach(slot => slotCounts[slot] = 0);
    
    // Calculate overlapping appointments for each slot based on durations
    slots.forEach(slot => {
        const slotMins = timeToMins(slot);
        
        dayAppointments.forEach(app => {
            if(app.status !== 'cancelado' && app.time) {
                const startMins = timeToMins(app.time);
                let duration = durations[app.vehicleType] || 60;
                if (app.serviceId) {
                    const srv = typeof milgrauServices !== 'undefined' ? milgrauServices.find(s => s.id === app.serviceId) : null;
                    if (srv && srv.duration) {
                        duration = srv.duration;
                    }
                }
                const endMins = startMins + duration;
                
                // If this slot falls within the appointment's duration, it occupies a bay
                if (slotMins >= startMins && slotMins < endMins) {
                    slotCounts[slot]++;
                }
            }
        });
    });
    
    timeItems.innerHTML = '';
    let hasAvailable = false;
    
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const isToday = (dateString === todayStr);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    slots.forEach(slot => {
        if (isToday) {
            const [slotH, slotM] = slot.split(':').map(Number);
            if (slotH < currentHour || (slotH === currentHour && slotM <= currentMinute)) {
                return; // Skip past slots
            }
        }
        
        const booked = slotCounts[slot];
        if(booked < maxCapacity) {
            hasAvailable = true;
            const vagas = maxCapacity - booked;
            const vagasText = vagas === 1 ? 'Última vaga!' : `${vagas} vagas disponíveis`;
            
            const opt = document.createElement('div');
            opt.setAttribute('data-value', slot);
            opt.style.display = 'flex';
            opt.style.justifyContent = 'space-between';
            opt.style.alignItems = 'center';
            opt.innerHTML = `
                <span style="font-weight: 600; font-size: 1.1rem; color: var(--text-primary);">${slot}</span>
                <span style="font-size: 0.85rem; padding: 3px 8px; border-radius: 6px; background: ${vagas === 1 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; color: ${vagas === 1 ? '#ef4444' : 'var(--brand-primary)'}; font-weight: 500;">
                    ${vagasText}
                </span>
            `;
            timeItems.appendChild(opt);
        }
    });
    
    if(!hasAvailable) {
        timeTrigger.innerHTML = 'Nenhum horário disponível';
        timeInput.value = '';
    } else {
        timeTrigger.innerHTML = 'Selecione o horário';
        timeInput.value = '';
    }
}

// Custom Select Logic
function initCustomSelects() {
    document.addEventListener('click', function(e) {
        // Close all selects if clicking outside
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.select-items').forEach(el => el.classList.add('select-hide'));
            document.querySelectorAll('.select-selected').forEach(el => el.classList.remove('select-arrow-active'));
            return;
        }
        
        // If clicking on a trigger
        if (e.target.classList.contains('select-selected')) {
            const items = e.target.nextElementSibling;
            
            // Close others
            document.querySelectorAll('.select-items').forEach(el => {
                if(el !== items) el.classList.add('select-hide');
            });
            document.querySelectorAll('.select-selected').forEach(el => {
                if(el !== e.target) el.classList.remove('select-arrow-active');
            });
            
            items.classList.toggle('select-hide');
            e.target.classList.toggle('select-arrow-active');
        }
        
        // If clicking on an option
        if (e.target.parentElement && e.target.parentElement.classList.contains('select-items')) {
            const wrapper = e.target.closest('.custom-select');
            const trigger = wrapper.querySelector('.select-selected');
            const hiddenInput = wrapper.nextElementSibling;
            
            trigger.innerHTML = e.target.innerHTML;
            if(hiddenInput) {
                hiddenInput.value = e.target.getAttribute('data-value');
                hiddenInput.dispatchEvent(new Event('change'));
            }
            
            // Remove same-as-selected class from all options
            const allOptions = e.target.parentElement.querySelectorAll('div');
            allOptions.forEach(opt => opt.removeAttribute('class'));
            e.target.setAttribute('class', 'same-as-selected');
            
            e.target.parentElement.classList.add('select-hide');
            trigger.classList.remove('select-arrow-active');
        }
    });
}

// Autocomplete Logic
function initAutocomplete() {
    const input = document.getElementById("client-vehicle");
    const list = document.getElementById("vehicle-autocomplete-list");
    const typeInput = document.getElementById("vehicle-type");
    const manualSelection = document.getElementById("manual-type-selection");
    
    if(!input || !list) return;
    
    input.addEventListener("input", function() {
        const val = this.value;
        list.innerHTML = "";
        
        // Reset type when user starts typing again
        typeInput.value = "";
        updatePriceDisplay();
        
        if (!val) {
            list.classList.add('select-hide');
            manualSelection.classList.add('hidden');
            return;
        }
        
        let hasMatches = false;
        
        carDatabase.forEach(car => {
            const fullName = `${car.brand} ${car.model}`;
            if (fullName.toLowerCase().includes(val.toLowerCase())) {
                hasMatches = true;
                const div = document.createElement("div");
                
                const regex = new RegExp(`(${val})`, "gi");
                div.innerHTML = fullName.replace(regex, "<strong>$1</strong>");
                div.innerHTML += ` <small class="text-secondary">(${car.type.toUpperCase()})</small>`;
                
                div.addEventListener("click", function() {
                    input.value = fullName;
                    typeInput.value = car.type;
                    list.innerHTML = "";
                    list.classList.add('select-hide');
                    manualSelection.classList.add('hidden');
                    updatePriceDisplay();
                    if(typeof updateServicesDropdown === 'function') updateServicesDropdown();
                    
                    // Clear plan B selection visual state
                    document.querySelectorAll('.btn-type').forEach(b => b.classList.remove('selected'));
                });
                
                list.appendChild(div);
            }
        });
        
        if(hasMatches) {
            list.classList.remove('select-hide');
            manualSelection.classList.add('hidden');
        } else {
            list.classList.add('select-hide');
            manualSelection.classList.remove('hidden'); // Show plan B
        }
    });
    
    // Close list on outside click
    document.addEventListener("click", function (e) {
        if (e.target !== input) {
            list.innerHTML = "";
            list.classList.add('select-hide');
        }
    });
    
    // Plan B buttons logic
    const typeButtons = document.querySelectorAll('.btn-type');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            typeButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            typeInput.value = this.getAttribute('data-type');
            updatePriceDisplay();
            if(typeof updateServicesDropdown === 'function') updateServicesDropdown();
        });
    });
}
