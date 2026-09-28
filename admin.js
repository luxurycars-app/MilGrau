const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
};

// App State
var appointments = JSON.parse(localStorage.getItem('milgrau_appointments')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');
    
    if (sessionStorage.getItem('milgrau_admin_auth') === 'true') {
        if(loginScreen) loginScreen.style.display = 'none';
    } else {
        if(loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const pwd = document.getElementById('admin-password').value;
                if (pwd === 'Bcjr2005') {
                    sessionStorage.setItem('milgrau_admin_auth', 'true');
                    loginScreen.style.display = 'none';
                } else {
                    loginError.style.display = 'block';
                }
            });
        }
    }
    initNavigation();
    renderDashboard();
    renderAllAppointments();
    renderServicesEditor();
    renderAddonsEditor();
    
    // Initialize Settings View
    const waInput = document.getElementById('setting-whatsapp');
    const enableAddonsInput = document.getElementById('setting-enable-addons');
    const maxCapacityInput = document.getElementById('setting-max-capacity');
    
    if (typeof milgrauSettings !== 'undefined') {
        if (waInput) waInput.value = milgrauSettings.whatsappNumber || '';
        if (enableAddonsInput) enableAddonsInput.checked = milgrauSettings.enableAddons !== false; // default true
        if (maxCapacityInput) maxCapacityInput.value = milgrauSettings.maxCapacity || 3;
        
        // Initialize working days
        const workingDays = milgrauSettings.workingDays || [false, true, true, true, true, true, true];
        document.querySelectorAll('.working-day-cb').forEach(cb => {
            const dayIdx = parseInt(cb.getAttribute('data-day'));
            cb.checked = workingDays[dayIdx];
        });
        
        // Initialize weights
        const durations = milgrauSettings.vehicleDurations || { hatch: 60, sedan: 60, suv: 120, moto: 60 };
        
        const dhHatch = document.getElementById('setting-hatch-h');
        const dmHatch = document.getElementById('setting-hatch-m');
        if(dhHatch) dhHatch.value = Math.floor(durations.hatch / 60);
        if(dmHatch) dmHatch.value = durations.hatch % 60;
        
        const dhSedan = document.getElementById('setting-sedan-h');
        const dmSedan = document.getElementById('setting-sedan-m');
        if(dhSedan) dhSedan.value = Math.floor(durations.sedan / 60);
        if(dmSedan) dmSedan.value = durations.sedan % 60;
        
        const dhSuv = document.getElementById('setting-suv-h');
        const dmSuv = document.getElementById('setting-suv-m');
        if(dhSuv) dhSuv.value = Math.floor(durations.suv / 60);
        if(dmSuv) dmSuv.value = durations.suv % 60;
        
        const dhMoto = document.getElementById('setting-moto-h');
        const dmMoto = document.getElementById('setting-moto-m');
        if(dhMoto) dhMoto.value = Math.floor(durations.moto / 60);
        if(dmMoto) dmMoto.value = durations.moto % 60;
        
        // Initialize Message Templates
        const msgConfirmInput = document.getElementById('setting-msg-confirm');
        const msgCompleteInput = document.getElementById('setting-msg-complete');
        const msgCancelInput = document.getElementById('setting-msg-cancel');
        const msgRescheduleInput = document.getElementById('setting-msg-reschedule');
        const msgReminderInput = document.getElementById('setting-msg-reminder');
        
        if(msgConfirmInput) msgConfirmInput.value = milgrauSettings.msgConfirm || '';
        if(msgCompleteInput) msgCompleteInput.value = milgrauSettings.msgComplete || '';
        if(msgCancelInput) msgCancelInput.value = milgrauSettings.msgCancel || '';
        if(msgRescheduleInput) msgRescheduleInput.value = milgrauSettings.msgReschedule || '';
        if(msgReminderInput) msgReminderInput.value = milgrauSettings.msgReminder || '';
    }
    
    renderTimeSlots();
    
    const btnSaveSettings = document.getElementById('btn-save-settings');
    if (btnSaveSettings) {
        btnSaveSettings.addEventListener('click', () => {
            if (typeof milgrauSettings !== 'undefined') {
                const newNumber = document.getElementById('setting-whatsapp').value.trim();
                const enableAddons = document.getElementById('setting-enable-addons').checked;
                const maxCap = parseInt(document.getElementById('setting-max-capacity').value) || 3;
                
                milgrauSettings.whatsappNumber = newNumber;
                milgrauSettings.enableAddons = enableAddons;
                milgrauSettings.maxCapacity = maxCap;
                
                // Collect Working Days
                const workingDays = [false, false, false, false, false, false, false];
                document.querySelectorAll('.working-day-cb').forEach(cb => {
                    const dayIdx = parseInt(cb.getAttribute('data-day'));
                    workingDays[dayIdx] = cb.checked;
                });
                milgrauSettings.workingDays = workingDays;
                
                // Collect durations
                const getMins = (prefix) => {
                    const h = parseInt(document.getElementById(`setting-${prefix}-h`).value) || 0;
                    const m = parseInt(document.getElementById(`setting-${prefix}-m`).value) || 0;
                    return (h * 60) + m;
                };
                
                milgrauSettings.vehicleDurations = {
                    hatch: getMins('hatch') || 60,
                    sedan: getMins('sedan') || 60,
                    suv: getMins('suv') || 120,
                    moto: getMins('moto') || 60
                };
                
                // Collect Message Templates
                const msgConfirmInput = document.getElementById('setting-msg-confirm');
                const msgCompleteInput = document.getElementById('setting-msg-complete');
                const msgCancelInput = document.getElementById('setting-msg-cancel');
                const msgRescheduleInput = document.getElementById('setting-msg-reschedule');
                const msgReminderInput = document.getElementById('setting-msg-reminder');
                
                if(msgConfirmInput) milgrauSettings.msgConfirm = msgConfirmInput.value;
                if(msgCompleteInput) milgrauSettings.msgComplete = msgCompleteInput.value;
                if(msgCancelInput) milgrauSettings.msgCancel = msgCancelInput.value;
                if(msgRescheduleInput) milgrauSettings.msgReschedule = msgRescheduleInput.value;
                if(msgReminderInput) milgrauSettings.msgReminder = msgReminderInput.value;
                
                // Collect time slots
                const timeInputs = document.querySelectorAll('.timeslot-input');
                let newSlots = [];
                timeInputs.forEach(input => {
                    const val = input.value.trim();
                    if(val) newSlots.push(val);
                });
                
                // Sort them alphabetically (which corresponds to time correctly for HH:MM format)
                newSlots.sort();
                
                if(typeof milgrauTimeSlots !== 'undefined') {
                    milgrauTimeSlots.length = 0;
                    newSlots.forEach(s => milgrauTimeSlots.push(s));
                    localStorage.setItem('milgrau_time_slots', JSON.stringify(milgrauTimeSlots));
                }
                
                localStorage.setItem('milgrau_settings', JSON.stringify(milgrauSettings));
                renderTimeSlots();
                MilGrauDialog.showToast('Configurações salvas com sucesso!');
            }
        });
    }
    
    // Status Filter
    const statusFilter = document.getElementById('filter-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', renderAllAppointments);
    }
    
    // Mobile Sidebar Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    }
    
    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    // Reset Services
    const btnReset = document.getElementById('btn-reset-services');
    if(btnReset) {
        btnReset.addEventListener('click', () => {
            MilGrauDialog.confirm('Tem certeza de que deseja restaurar os preços e serviços aos valores padrão?', () => {
                localStorage.removeItem('milgrau_services');
                location.reload();
            });
        });
    }

    // Add Service Handler
    const btnAddService = document.getElementById('btn-add-service');
    if (btnAddService) {
        btnAddService.addEventListener('click', () => {
            const newService = {
                id: 'custom-' + Date.now(),
                name: 'Novo Serviço',
                prices: { hatch: 0, sedan: 0, suv: 0, moto: 0 },
                features: [],
                popular: false
            };
            milgrauServices.push(newService);
            localStorage.setItem('milgrau_services', JSON.stringify(milgrauServices));
            renderServicesEditor();
        });
    }

    // Add Addon Handler
    const btnAddAddon = document.getElementById('btn-add-addon');
    if (btnAddAddon) {
        btnAddAddon.addEventListener('click', () => {
            if (typeof milgrauAddons !== 'undefined') {
                milgrauAddons.push({
                    name: 'Novo Extra',
                    price: 0,
                    icon: 'ph-plus-circle'
                });
                localStorage.setItem('milgrau_addons', JSON.stringify(milgrauAddons));
                renderAddonsEditor();
            }
        });
    }

    // Add timeslot handler
    const btnAddTimeslot = document.getElementById('btn-add-timeslot');
    if (btnAddTimeslot) {
        btnAddTimeslot.addEventListener('click', () => {
            if (typeof milgrauTimeSlots !== 'undefined') {
                milgrauTimeSlots.push("00:00");
                renderTimeSlots();
            }
        });
    }

    // Save All Services/Addons Handler
    const btnSaveServices = document.getElementById('btn-save-services');
    if (btnSaveServices) {
        btnSaveServices.addEventListener('click', () => {
            // Re-sync all inputs from the DOM just in case onchange didn't fire
            const serviceInputsName = document.querySelectorAll('#services-editor-list input[type="text"]');
            serviceInputsName.forEach(input => {
                const idx = parseInt(input.getAttribute('data-index'));
                if(milgrauServices[idx]) milgrauServices[idx].name = input.value;
            });

            const serviceInputsPrice = document.querySelectorAll('#services-editor-list input[type="number"]');
            serviceInputsPrice.forEach(input => {
                const idx = parseInt(input.getAttribute('data-index'));
                const type = input.getAttribute('data-type');
                if(milgrauServices[idx] && type) milgrauServices[idx].prices[type] = parseInt(input.value) || 0;
            });
            
            const serviceFeaturesTextareas = document.querySelectorAll('#services-editor-list textarea');
            serviceFeaturesTextareas.forEach(textarea => {
                const idx = parseInt(textarea.getAttribute('data-index'));
                if(milgrauServices[idx]) {
                    milgrauServices[idx].features = textarea.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                }
            });

            const addonInputsName = document.querySelectorAll('#addons-editor-list input[type="text"]');
            addonInputsName.forEach(input => {
                const idx = parseInt(input.getAttribute('data-index'));
                if(milgrauAddons[idx]) milgrauAddons[idx].name = input.value;
            });

            const addonInputsPrice = document.querySelectorAll('#addons-editor-list input[type="number"]');
            addonInputsPrice.forEach(input => {
                const idx = parseInt(input.getAttribute('data-index'));
                if(milgrauAddons[idx]) milgrauAddons[idx].price = parseInt(input.value) || 0;
            });

            localStorage.setItem('milgrau_services', JSON.stringify(milgrauServices));
            localStorage.setItem('milgrau_addons', JSON.stringify(milgrauAddons));
            MilGrauDialog.showToast('Serviços e Preços salvos com sucesso!');
        });
    }

    // Modal close handlers
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
});

// Sidebar Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active classes
            navItems.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.add('hidden'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class
            item.classList.add('active');
            const viewId = item.getAttribute('data-view');
            
            const targetSection = document.getElementById(`view-${viewId}`);
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            
            // Update Title
            const topbarTitle = document.getElementById('topbar-title');
            if(viewId === 'dashboard') topbarTitle.innerText = 'Visão Geral';
            if(viewId === 'appointments') topbarTitle.innerText = 'Agendamentos';
            if(viewId === 'services') topbarTitle.innerText = 'Gestão de Serviços e Preços';
            if(viewId === 'settings') topbarTitle.innerText = 'Configurações';

            // Refresh data on tab change
            renderDashboard();
            renderAllAppointments();
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('sidebar-overlay').classList.remove('active');
            }
        });
    });
}

// Helpers
function formatMoney(amount) {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseMoney(priceStr) {
    // E.g. "R$ 70,00" -> 70
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace('R$', '').replace(',00', '').trim();
    return parseInt(cleanStr) || 0;
}

// Dashboard
function renderDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7); // YYYY-MM
    
    let earningsToday = 0;
    let earningsMonth = 0;
    let completedWashes = 0;
    let pendingCount = 0;
    
    const todaysAppointments = [];

    appointments.forEach(app => {
        // Stats
        if (app.status === 'pendente') pendingCount++;
        if (app.status === 'concluido') {
            completedWashes++;
            const price = parseMoney(app.servicePrice);
            let addonTotal = 0;
            if (app.addons) {
                app.addons.forEach(ad => addonTotal += ad.price);
            }
            const total = price + addonTotal;

            if (app.date === today) {
                earningsToday += total;
            }
            if (app.date.startsWith(currentMonth)) {
                earningsMonth += total;
            }
        }
        
        // Today's list
        if (app.date === today) {
            todaysAppointments.push(app);
        }
    });

    // Update Widgets
    document.getElementById('stat-earnings-today').innerText = formatMoney(earningsToday);
    document.getElementById('stat-earnings-month').innerText = formatMoney(earningsMonth);
    document.getElementById('stat-completed-washes').innerText = completedWashes;
    document.getElementById('stat-pending-appointments').innerText = pendingCount;
    
    // Render Today's Table
    todaysAppointments.sort((a,b) => a.time.localeCompare(b.time));
    const tbody = document.getElementById('today-appointments-tbody');
    tbody.innerHTML = '';
    
    if (todaysAppointments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-secondary);">Nenhum agendamento para hoje.</td></tr>`;
        return;
    }
    
    todaysAppointments.forEach(app => {
        let notesText = app.notes ? `<div style="font-size: 0.85rem; color: #a1a1aa; margin-top: 4px; padding: 4px 8px; background: rgba(255,255,255,0.05); border-radius: 4px;"><i class="ph ph-chat-text"></i> ${escapeHTML(app.notes)}</div>` : '';
        tbody.innerHTML += `
            <tr>
                <td><strong>${escapeHTML(app.clientName)}</strong></td>
                <td>${escapeHTML(app.clientVehicle)}</td>
                <td>${app.serviceName}${notesText}</td>
                <td>${app.time}</td>
                <td><span class="status-badge status-${app.status}">${capitalize(app.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        ${getActionButtonsHTML(app)}
                    </div>
                </td>
            </tr>
        `;
    });
}

// All Appointments
function renderAllAppointments() {
    const filter = document.getElementById('filter-status').value;
    const tbody = document.getElementById('all-appointments-tbody');
    tbody.innerHTML = '';
    
    let filtered = appointments;
    if (filter !== 'all') {
        filtered = appointments.filter(a => a.status === filter);
    }
    
    // Sort by date/time descending (newest first)
    filtered.sort((a,b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-secondary);">Nenhum agendamento encontrado.</td></tr>`;
        return;
    }
    
    filtered.forEach(app => {
        const price = parseMoney(app.servicePrice);
        let addonTotal = 0;
        let addonText = '';
        if (app.addons && app.addons.length > 0) {
            app.addons.forEach(ad => addonTotal += ad.price);
            addonText = `<br><small style="color:var(--text-secondary);">+ ${app.addons.length} Extras</small>`;
        }
        let notesText = app.notes ? `<div style="font-size: 0.85rem; color: #a1a1aa; margin-top: 4px; padding: 4px 8px; background: rgba(255,255,255,0.05); border-radius: 4px;"><i class="ph ph-chat-text"></i> ${escapeHTML(app.notes)}</div>` : '';
        const total = formatMoney(price + addonTotal);
        
        tbody.innerHTML += `
            <tr>
                <td>${app.date.split('-').reverse().join('/')}<br><small>${app.time}</small></td>
                <td><strong>${escapeHTML(app.clientName)}</strong></td>
                <td>${escapeHTML(app.clientPhone)}</td>
                <td>${escapeHTML(app.clientVehicle)} <small style="color:var(--text-secondary);">(${app.vehicleType})</small></td>
                <td>${app.serviceName}${addonText}${notesText}</td>
                <td><strong>${total}</strong></td>
                <td><span class="status-badge status-${app.status}">${capitalize(app.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        ${getActionButtonsHTML(app)}
                    </div>
                </td>
            </tr>
        `;
    });
}

// Actions Generator
function getActionButtonsHTML(app) {
    if (app.status === 'pendente') {
        return `
            <button class="btn-icon success" title="Confirmar" onclick="changeStatus('${app.id}', 'confirmado')"><i class="ph ph-check"></i></button>
            <button class="btn-icon primary" title="Mudar Horário" onclick="openMoveModal('${app.id}')"><i class="ph ph-clock"></i></button>
            <button class="btn-icon" style="background: var(--warning); color: white;" title="Enviar Lembrete" onclick="sendReminder('${app.id}')"><i class="ph ph-bell-ringing"></i></button>
            <button class="btn-icon danger" title="Rejeitar" onclick="changeStatus('${app.id}', 'cancelado')"><i class="ph ph-x"></i></button>
        `;
    }
    if (app.status === 'confirmado') {
        return `
            <button class="btn-icon success" title="Marcar como Concluído" onclick="changeStatus('${app.id}', 'concluido')"><i class="ph ph-flag-checkered"></i></button>
            <button class="btn-icon primary" title="Mudar Horário" onclick="openMoveModal('${app.id}')"><i class="ph ph-clock"></i></button>
            <button class="btn-icon" style="background: var(--warning); color: white;" title="Enviar Lembrete" onclick="sendReminder('${app.id}')"><i class="ph ph-bell-ringing"></i></button>
            <button class="btn-icon danger" title="Cancelar" onclick="changeStatus('${app.id}', 'cancelado')"><i class="ph ph-x"></i></button>
        `;
    }
    // No actions for concluido or cancelado
    return `<span style="color:var(--text-secondary);font-size:12px;">-</span>`;
}

// Handle Status Change
window.changeStatus = function(id, newStatus) {
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        const app = appointments[index];
        let promptMsg = '';
        let waText = '';
        
        const formattedDate = app.date.split('-').reverse().join('/');
        
        let template = '';
        if(newStatus === 'confirmado') {
            promptMsg = 'Confirmar este agendamento e notificar cliente?';
            template = milgrauSettings.msgConfirm || '';
        } else if(newStatus === 'concluido') {
            promptMsg = 'Finalizar serviço e avisar o cliente que o carro está pronto?';
            template = milgrauSettings.msgComplete || '';
        } else if(newStatus === 'cancelado') {
            promptMsg = 'Rejeitar/cancelar este agendamento e notificar cliente?';
            template = milgrauSettings.msgCancel || '';
        }
        
        // Replace variables
        waText = template
            .replace(/\{\{clientName\}\}/g, app.clientName)
            .replace(/\{\{serviceName\}\}/g, app.serviceName)
            .replace(/\{\{date\}\}/g, formattedDate)
            .replace(/\{\{time\}\}/g, app.time);

        MilGrauDialog.confirm(promptMsg, () => {
            appointments[index].status = newStatus;
            localStorage.setItem('milgrau_appointments', JSON.stringify(appointments));
            renderDashboard();
            renderAllAppointments();
            
            // Redirect to WA
            if(app.clientPhone) {
                let phone = app.clientPhone.replace(/\D/g, '');
                if(phone.startsWith('55') && phone.length > 11) {
                    phone = phone.substring(2);
                }
                const waLink = `https://wa.me/55${phone}?text=${encodeURIComponent(waText)}`;
                window.open(waLink, '_blank');
            }
        });
    }
};

window.sendReminder = function(id) {
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        const app = appointments[index];
        const formattedDate = app.date.split('-').reverse().join('/');
        
        let template = milgrauSettings.msgReminder || '';
        
        // Replace variables
        let waText = template
            .replace(/\{\{clientName\}\}/g, app.clientName)
            .replace(/\{\{serviceName\}\}/g, app.serviceName)
            .replace(/\{\{date\}\}/g, formattedDate)
            .replace(/\{\{time\}\}/g, app.time);

        MilGrauDialog.confirm('Abrir WhatsApp para enviar lembrete ao cliente?', () => {
            if(app.clientPhone) {
                let phone = app.clientPhone.replace(/\D/g, '');
                if(phone.startsWith('55') && phone.length > 11) {
                    phone = phone.substring(2);
                }
                const waLink = `https://wa.me/55${phone}?text=${encodeURIComponent(waText)}`;
                window.open(waLink, '_blank');
            }
        });
    }
};

// Modal for Move
const modal = document.getElementById('action-modal');
const modalBody = document.getElementById('modal-body');
const btnSaveModal = document.getElementById('btn-save-modal');
let currentEditingId = null;

window.openMoveModal = function(id) {
    currentEditingId = id;
    const app = appointments.find(a => a.id === id);
    if (!app) return;
    
    modalBody.innerHTML = `
        <div class="price-input-group" style="margin-bottom:16px;">
            <label>Nova Data</label>
            <div class="price-input-wrapper" style="margin-top:8px;">
                <i class="ph ph-calendar" style="position:absolute; left:12px; color:var(--text-secondary);"></i>
                <input type="date" id="modal-date" value="${app.date}">
            </div>
        </div>
        <div class="price-input-group">
            <label>Novo Horário</label>
            <div class="price-input-wrapper" style="margin-top:8px;">
                <i class="ph ph-clock" style="position:absolute; left:12px; color:var(--text-secondary);"></i>
                <input type="time" id="modal-time" value="${app.time}">
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    
    btnSaveModal.onclick = () => {
        const newDate = document.getElementById('modal-date').value;
        const newTime = document.getElementById('modal-time').value;
        if (newDate && newTime) {
            MilGrauDialog.confirm('Salvar remarcação e notificar o cliente via WhatsApp?', () => {
                app.date = newDate;
                app.time = newTime;
                localStorage.setItem('milgrau_appointments', JSON.stringify(appointments));
                renderDashboard();
                renderAllAppointments();
                closeModal();
                
                if (app.clientPhone) {
                    const formattedDate = newDate.split('-').reverse().join('/');
                    let template = milgrauSettings.msgReschedule || '';
                    const waText = template
                        .replace(/\{\{clientName\}\}/g, app.clientName)
                        .replace(/\{\{serviceName\}\}/g, app.serviceName)
                        .replace(/\{\{date\}\}/g, formattedDate)
                        .replace(/\{\{time\}\}/g, newTime);
                    let phone = app.clientPhone.replace(/\D/g, '');
                    if(phone.startsWith('55') && phone.length > 11) {
                        phone = phone.substring(2);
                    }
                    const waLink = `https://wa.me/55${phone}?text=${encodeURIComponent(waText)}`;
                    window.open(waLink, '_blank');
                }
            });
        }
    };
};

function closeModal() {
    modal.classList.add('hidden');
    currentEditingId = null;
}

// Services Editor
function renderServicesEditor() {
    const container = document.getElementById('services-editor-list');
    container.innerHTML = '';
    
    milgrauServices.forEach((service, index) => {
        container.innerHTML += `
            <div class="service-editor-card">
                <div class="service-editor-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="price-input-wrapper" style="flex-grow: 1; margin-right: 16px;">
                        <input type="text" data-index="${index}" value="${service.name}" onchange="updateServiceName(this)" style="font-size: 1.1rem; font-weight: bold; background: transparent; border: 1px solid var(--border-color); padding: 8px;">
                    </div>
                    <button class="btn-icon danger" onclick="deleteService(${index})" title="Excluir Serviço"><i class="ph ph-trash"></i></button>
                </div>
                <div class="service-prices-grid">
                    <div class="price-input-group">
                        <label>Preço Hatch</label>
                        <div class="price-input-wrapper">
                            <span>R$</span>
                            <input type="number" data-index="${index}" data-type="hatch" value="${service.prices.hatch}" onchange="updateServicePrice(this)">
                        </div>
                    </div>
                    <div class="price-input-group">
                        <label>Preço Sedan</label>
                        <div class="price-input-wrapper">
                            <span>R$</span>
                            <input type="number" data-index="${index}" data-type="sedan" value="${service.prices.sedan}" onchange="updateServicePrice(this)">
                        </div>
                    </div>
                    <div class="price-input-group">
                        <label>Preço SUV</label>
                        <div class="price-input-wrapper">
                            <span>R$</span>
                            <input type="number" data-index="${index}" data-type="suv" value="${service.prices.suv}" onchange="updateServicePrice(this)">
                        </div>
                    </div>
                    <div class="price-input-group">
                        <label>Preço Moto</label>
                        <div class="price-input-wrapper">
                            <span>R$</span>
                            <input type="number" data-index="${index}" data-type="moto" value="${service.prices.moto}" onchange="updateServicePrice(this)">
                        </div>
                    </div>
                </div>
                <div class="price-input-group" style="margin-top: 16px;">
                    <label>Tempo do Serviço (Minutos)</label>
                    <div class="price-input-wrapper">
                        <span>Min</span>
                        <input type="number" data-index="${index}" value="${service.duration || 60}" onchange="updateServiceDuration(this)">
                    </div>
                </div>
                <div class="price-input-group" style="margin-top: 16px;">
                    <label>Características do Serviço (uma por linha)</label>
                    <textarea data-index="${index}" onchange="updateServiceFeatures(this)" style="width: 100%; height: 80px; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: var(--text-primary); font-family: 'Outfit'; resize: vertical; margin-top: 8px;">${service.features.join('\n')}</textarea>
                </div>
            </div>
        `;
    });
}

function renderAddonsEditor() {
    const container = document.getElementById('addons-editor-list');
    if (!container || typeof milgrauAddons === 'undefined') return;
    
    container.innerHTML = '';
    
    milgrauAddons.forEach((addon, index) => {
        container.innerHTML += `
            <div class="service-editor-card" style="padding: 16px;">
                <div class="service-editor-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: none; padding-bottom: 0;">
                    <div class="price-input-wrapper" style="flex-grow: 1; margin-right: 16px;">
                        <input type="text" data-index="${index}" value="${addon.name}" onchange="updateAddonName(this)" style="font-size: 1.1rem; font-weight: bold; background: transparent; border: 1px solid var(--border-color); padding: 8px;">
                    </div>
                    <button class="btn-icon danger" onclick="deleteAddon(${index})" title="Excluir Extra"><i class="ph ph-trash"></i></button>
                </div>
                <div class="price-input-group">
                    <label>Preço Adicional (R$)</label>
                    <div class="price-input-wrapper">
                        <span>R$</span>
                        <input type="number" data-index="${index}" value="${addon.price}" onchange="updateAddonPrice(this)">
                    </div>
                </div>
            </div>
        `;
    });
}

function renderTimeSlots() {
    const list = document.getElementById('timeslots-list');
    if (!list || typeof milgrauTimeSlots === 'undefined') return;
    
    list.innerHTML = '';
    
    milgrauTimeSlots.forEach((slot, index) => {
        list.innerHTML += `
            <div style="display: flex; gap: 8px; align-items: center;">
                <input type="time" class="timeslot-input" value="${slot}" data-index="${index}" style="flex-grow: 1; background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); padding: 8px; border-radius: 6px;">
                <button class="btn-icon danger" onclick="deleteTimeSlot(${index})" title="Excluir Horário"><i class="ph ph-trash"></i></button>
            </div>
        `;
    });
}

window.deleteTimeSlot = function(index) {
    MilGrauDialog.confirm('Tem certeza de que deseja excluir este horário?', () => {
        milgrauTimeSlots.splice(index, 1);
        renderTimeSlots();
    });
};

window.updateServicePrice = function(input) {
    const index = parseInt(input.getAttribute('data-index'));
    const type = input.getAttribute('data-type');
    const value = parseInt(input.value);
    
    if (milgrauServices[index] && milgrauServices[index].prices[type] !== undefined) {
        milgrauServices[index].prices[type] = value;
        localStorage.setItem('milgrau_services', JSON.stringify(milgrauServices));
    }
};

window.updateServiceFeatures = function(textarea) {
    const index = parseInt(textarea.getAttribute('data-index'));
    const text = textarea.value;
    
    if (milgrauServices[index]) {
        // Split by newline and filter out empty strings
        milgrauServices[index].features = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        localStorage.setItem('milgrau_services', JSON.stringify(milgrauServices));
    }
};

window.updateServiceName = function(input) {
    const index = parseInt(input.getAttribute('data-index'));
    const value = input.value;
    
    if (milgrauServices[index]) {
        milgrauServices[index].name = value;
        localStorage.setItem('milgrau_services', JSON.stringify(milgrauServices));
    }
};

window.updateServiceDuration = function(input) {
    const index = parseInt(input.getAttribute('data-index'));
    const value = parseInt(input.value) || 0;
    
    if (milgrauServices[index]) {
        milgrauServices[index].duration = value;
        localStorage.setItem('milgrau_services', JSON.stringify(milgrauServices));
    }
};

window.deleteService = function(index) {
    MilGrauDialog.confirm('Tem certeza de que deseja excluir este serviço?', () => {
        milgrauServices.splice(index, 1);
        localStorage.setItem('milgrau_services', JSON.stringify(milgrauServices));
        renderServicesEditor();
    });
};

window.updateAddonName = function(input) {
    const index = parseInt(input.getAttribute('data-index'));
    const value = input.value;
    
    if (milgrauAddons[index]) {
        milgrauAddons[index].name = value;
        localStorage.setItem('milgrau_addons', JSON.stringify(milgrauAddons));
    }
};

window.updateAddonPrice = function(input) {
    const index = parseInt(input.getAttribute('data-index'));
    const value = parseMoney(input.value) || 0;
    
    if (milgrauAddons[index]) {
        milgrauAddons[index].price = value;
        localStorage.setItem('milgrau_addons', JSON.stringify(milgrauAddons));
    }
};

window.deleteAddon = function(index) {
    MilGrauDialog.confirm('Tem certeza de que deseja excluir este extra?', () => {
        milgrauAddons.splice(index, 1);
        localStorage.setItem('milgrau_addons', JSON.stringify(milgrauAddons));
        renderAddonsEditor();
    });
};

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
