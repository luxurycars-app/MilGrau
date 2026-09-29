const carDatabase = [
    // TOYOTA
    { brand: 'Toyota', model: 'Corolla', type: 'sedan' },
    { brand: 'Toyota', model: 'Hilux', type: 'suv' },
    { brand: 'Toyota', model: 'Yaris', type: 'hatch' },
    { brand: 'Toyota', model: 'Yaris Sedan', type: 'sedan' },
    { brand: 'Toyota', model: 'Etios', type: 'hatch' },
    { brand: 'Toyota', model: 'Etios Sedan', type: 'sedan' },
    { brand: 'Toyota', model: 'SW4', type: 'suv' },
    { brand: 'Toyota', model: 'Corolla Cross', type: 'suv' },
    { brand: 'Toyota', model: 'RAV4', type: 'suv' },
    { brand: 'Toyota', model: 'Camry', type: 'sedan' },
    { brand: 'Toyota', model: 'Prius', type: 'hatch' },
    // HONDA
    { brand: 'Honda', model: 'Civic', type: 'sedan' },
    { brand: 'Honda', model: 'HR-V', type: 'suv' },
    { brand: 'Honda', model: 'Fit', type: 'hatch' },
    { brand: 'Honda', model: 'City', type: 'sedan' },
    { brand: 'Honda', model: 'City Hatchback', type: 'hatch' },
    { brand: 'Honda', model: 'CR-V', type: 'suv' },
    { brand: 'Honda', model: 'WR-V', type: 'suv' },
    { brand: 'Honda', model: 'Accord', type: 'sedan' },
    { brand: 'Honda', model: 'ZR-V', type: 'suv' },
    // VOLKSWAGEN
    { brand: 'Volkswagen', model: 'Gol', type: 'hatch' },
    { brand: 'Volkswagen', model: 'Polo', type: 'hatch' },
    { brand: 'Volkswagen', model: 'Nivus', type: 'suv' },
    { brand: 'Volkswagen', model: 'T-Cross', type: 'suv' },
    { brand: 'Volkswagen', model: 'Jetta', type: 'sedan' },
    { brand: 'Volkswagen', model: 'Virtus', type: 'sedan' },
    { brand: 'Volkswagen', model: 'Voyage', type: 'sedan' },
    { brand: 'Volkswagen', model: 'Fox', type: 'hatch' },
    { brand: 'Volkswagen', model: 'Up!', type: 'hatch' },
    { brand: 'Volkswagen', model: 'Taos', type: 'suv' },
    { brand: 'Volkswagen', model: 'Tiguan', type: 'suv' },
    { brand: 'Volkswagen', model: 'Saveiro', type: 'hatch' }, // Pickups as hatch size or suv? usually hatch/sedan price unless large
    { brand: 'Volkswagen', model: 'Amarok', type: 'suv' },
    { brand: 'Volkswagen', model: 'Golf', type: 'hatch' },
    { brand: 'Volkswagen', model: 'Passat', type: 'sedan' },
    // CHEVROLET
    { brand: 'Chevrolet', model: 'Onix', type: 'hatch' },
    { brand: 'Chevrolet', model: 'Onix Plus', type: 'sedan' },
    { brand: 'Chevrolet', model: 'Tracker', type: 'suv' },
    { brand: 'Chevrolet', model: 'Cruze', type: 'sedan' },
    { brand: 'Chevrolet', model: 'Cruze Sport6', type: 'hatch' },
    { brand: 'Chevrolet', model: 'Prisma', type: 'sedan' },
    { brand: 'Chevrolet', model: 'Cobalt', type: 'sedan' },
    { brand: 'Chevrolet', model: 'Spin', type: 'suv' },
    { brand: 'Chevrolet', model: 'S10', type: 'suv' },
    { brand: 'Chevrolet', model: 'Equinox', type: 'suv' },
    { brand: 'Chevrolet', model: 'Trailblazer', type: 'suv' },
    { brand: 'Chevrolet', model: 'Montana', type: 'suv' },
    { brand: 'Chevrolet', model: 'Camaro', type: 'sedan' }, // Sports cars as sedan size
    // HYUNDAI
    { brand: 'Hyundai', model: 'HB20', type: 'hatch' },
    { brand: 'Hyundai', model: 'HB20S', type: 'sedan' },
    { brand: 'Hyundai', model: 'HB20X', type: 'hatch' },
    { brand: 'Hyundai', model: 'Creta', type: 'suv' },
    { brand: 'Hyundai', model: 'Tucson', type: 'suv' },
    { brand: 'Hyundai', model: 'Santa Fe', type: 'suv' },
    { brand: 'Hyundai', model: 'Elantra', type: 'sedan' },
    { brand: 'Hyundai', model: 'Azera', type: 'sedan' },
    { brand: 'Hyundai', model: 'I30', type: 'hatch' },
    // JEEP
    { brand: 'Jeep', model: 'Renegade', type: 'suv' },
    { brand: 'Jeep', model: 'Compass', type: 'suv' },
    { brand: 'Jeep', model: 'Commander', type: 'suv' },
    { brand: 'Jeep', model: 'Wrangler', type: 'suv' },
    { brand: 'Jeep', model: 'Grand Cherokee', type: 'suv' },
    // FIAT
    { brand: 'Fiat', model: 'Argo', type: 'hatch' },
    { brand: 'Fiat', model: 'Cronos', type: 'sedan' },
    { brand: 'Fiat', model: 'Pulse', type: 'suv' },
    { brand: 'Fiat', model: 'Fastback', type: 'suv' },
    { brand: 'Fiat', model: 'Mobi', type: 'hatch' },
    { brand: 'Fiat', model: 'Uno', type: 'hatch' },
    { brand: 'Fiat', model: 'Palio', type: 'hatch' },
    { brand: 'Fiat', model: 'Siena', type: 'sedan' },
    { brand: 'Fiat', model: 'Grand Siena', type: 'sedan' },
    { brand: 'Fiat', model: 'Strada', type: 'hatch' }, // Small pickup
    { brand: 'Fiat', model: 'Toro', type: 'suv' },
    { brand: 'Fiat', model: 'Fiorino', type: 'suv' },
    // RENAULT
    { brand: 'Renault', model: 'Kwid', type: 'hatch' },
    { brand: 'Renault', model: 'Sandero', type: 'hatch' },
    { brand: 'Renault', model: 'Stepway', type: 'hatch' },
    { brand: 'Renault', model: 'Logan', type: 'sedan' },
    { brand: 'Renault', model: 'Duster', type: 'suv' },
    { brand: 'Renault', model: 'Captur', type: 'suv' },
    { brand: 'Renault', model: 'Oroch', type: 'suv' },
    { brand: 'Renault', model: 'Kardian', type: 'suv' },
    { brand: 'Renault', model: 'Fluence', type: 'sedan' },
    { brand: 'Renault', model: 'Clio', type: 'hatch' },
    // NISSAN
    { brand: 'Nissan', model: 'Kicks', type: 'suv' },
    { brand: 'Nissan', model: 'Versa', type: 'sedan' },
    { brand: 'Nissan', model: 'Sentra', type: 'sedan' },
    { brand: 'Nissan', model: 'Frontier', type: 'suv' },
    { brand: 'Nissan', model: 'March', type: 'hatch' },
    // PEUGEOT
    { brand: 'Peugeot', model: '208', type: 'hatch' },
    { brand: 'Peugeot', model: '2008', type: 'suv' },
    { brand: 'Peugeot', model: '3008', type: 'suv' },
    { brand: 'Peugeot', model: '207', type: 'hatch' },
    { brand: 'Peugeot', model: '308', type: 'hatch' },
    { brand: 'Peugeot', model: '408', type: 'sedan' },
    // FORD
    { brand: 'Ford', model: 'Ka', type: 'hatch' },
    { brand: 'Ford', model: 'Ka Sedan', type: 'sedan' },
    { brand: 'Ford', model: 'EcoSport', type: 'suv' },
    { brand: 'Ford', model: 'Ranger', type: 'suv' },
    { brand: 'Ford', model: 'Fiesta', type: 'hatch' },
    { brand: 'Ford', model: 'Focus', type: 'hatch' },
    { brand: 'Ford', model: 'Focus Fastback', type: 'sedan' },
    { brand: 'Ford', model: 'Fusion', type: 'sedan' },
    { brand: 'Ford', model: 'Territory', type: 'suv' },
    { brand: 'Ford', model: 'Bronco', type: 'suv' },
    { brand: 'Ford', model: 'Mustang', type: 'sedan' },
    // CITROEN
    { brand: 'Citroen', model: 'C3', type: 'hatch' },
    { brand: 'Citroen', model: 'C4 Cactus', type: 'suv' },
    { brand: 'Citroen', model: 'C3 Aircross', type: 'suv' },
    { brand: 'Citroen', model: 'C4 Lounge', type: 'sedan' },
    // BMW
    { brand: 'BMW', model: 'Serie 3 (320i)', type: 'sedan' },
    { brand: 'BMW', model: 'X1', type: 'suv' },
    { brand: 'BMW', model: 'X3', type: 'suv' },
    { brand: 'BMW', model: 'X4', type: 'suv' },
    { brand: 'BMW', model: 'X5', type: 'suv' },
    { brand: 'BMW', model: 'X6', type: 'suv' },
    { brand: 'BMW', model: 'Serie 1', type: 'hatch' },
    // AUDI
    { brand: 'Audi', model: 'A3', type: 'hatch' },
    { brand: 'Audi', model: 'A3 Sedan', type: 'sedan' },
    { brand: 'Audi', model: 'A4', type: 'sedan' },
    { brand: 'Audi', model: 'A5', type: 'sedan' },
    { brand: 'Audi', model: 'Q3', type: 'suv' },
    { brand: 'Audi', model: 'Q5', type: 'suv' },
    { brand: 'Audi', model: 'Q7', type: 'suv' },
    // MERCEDES-BENZ
    { brand: 'Mercedes', model: 'Classe A', type: 'hatch' },
    { brand: 'Mercedes', model: 'Classe C (C180/C200)', type: 'sedan' },
    { brand: 'Mercedes', model: 'GLA', type: 'suv' },
    { brand: 'Mercedes', model: 'GLC', type: 'suv' },
    { brand: 'Mercedes', model: 'GLE', type: 'suv' },
    // KIA
    { brand: 'Kia', model: 'Sportage', type: 'suv' },
    { brand: 'Kia', model: 'Cerato', type: 'sedan' },
    { brand: 'Kia', model: 'Picanto', type: 'hatch' },
    { brand: 'Kia', model: 'Sorento', type: 'suv' },
    { brand: 'Kia', model: 'Soul', type: 'hatch' },
    // CHERY
    { brand: 'Caoa Chery', model: 'Tiggo 5X', type: 'suv' },
    { brand: 'Caoa Chery', model: 'Tiggo 7', type: 'suv' },
    { brand: 'Caoa Chery', model: 'Tiggo 8', type: 'suv' },
    { brand: 'Caoa Chery', model: 'Arrizo 6', type: 'sedan' },
    { brand: 'Caoa Chery', model: 'QQ', type: 'hatch' },
    // MITSUBISHI
    { brand: 'Mitsubishi', model: 'L200 Triton', type: 'suv' },
    { brand: 'Mitsubishi', model: 'Outlander', type: 'suv' },
    { brand: 'Mitsubishi', model: 'ASX', type: 'suv' },
    { brand: 'Mitsubishi', model: 'Eclipse Cross', type: 'suv' },
    { brand: 'Mitsubishi', model: 'Pajero', type: 'suv' },
    { brand: 'Mitsubishi', model: 'Lancer', type: 'sedan' },
    // VOLVO
    { brand: 'Volvo', model: 'XC40', type: 'suv' },
    { brand: 'Volvo', model: 'XC60', type: 'suv' },
    { brand: 'Volvo', model: 'XC90', type: 'suv' },
    // LAND ROVER
    { brand: 'Land Rover', model: 'Evoque', type: 'suv' },
    { brand: 'Land Rover', model: 'Discovery', type: 'suv' },
    { brand: 'Land Rover', model: 'Defender', type: 'suv' },
    { brand: 'Land Rover', model: 'Velar', type: 'suv' },
    // PORSCHE
    { brand: 'Porsche', model: 'Macan', type: 'suv' },
    { brand: 'Porsche', model: 'Cayenne', type: 'suv' },
    { brand: 'Porsche', model: '911', type: 'sedan' }, // Sports cars
    // MOTOS (Populares)
    { brand: 'Honda', model: 'CG 160 Titan', type: 'moto' },
    { brand: 'Honda', model: 'CG 160 Fan', type: 'moto' },
    { brand: 'Honda', model: 'Biz 125', type: 'moto' },
    { brand: 'Honda', model: 'NXR 160 Bros', type: 'moto' },
    { brand: 'Honda', model: 'CB 300F Twister', type: 'moto' },
    { brand: 'Honda', model: 'XRE 300', type: 'moto' },
    { brand: 'Honda', model: 'PCX', type: 'moto' },
    { brand: 'Yamaha', model: 'Fazer FZ25', type: 'moto' },
    { brand: 'Yamaha', model: 'YBR 150 Factor', type: 'moto' },
    { brand: 'Yamaha', model: 'Crosser 150', type: 'moto' },
    { brand: 'Yamaha', model: 'NMAX', type: 'moto' },
    { brand: 'Yamaha', model: 'XMAX', type: 'moto' },
    { brand: 'Yamaha', model: 'MT-03', type: 'moto' },
    { brand: 'Yamaha', model: 'MT-07', type: 'moto' },
    { brand: 'Yamaha', model: 'MT-09', type: 'moto' }
];

const defaultServices = [
    {
        id: 'simples',
        name: 'Lavagem Simples',
        duration: 45,
        prices: { hatch: 60, sedan: 70, suv: 80, moto: 0 },
        features: ['INTERIOR', 'Aspiração geral', 'Limpeza antibactericida', 'Limpeza de entrada de portas', 'Limpeza dos tapetes', 'Limpeza dos vidros', 'EXTERIOR', 'Lavagem externa com snow foam', 'Limpeza das rodas', 'Limpeza da caixa de rodas', 'Secagem do veículo'],
        popular: false
    },
    {
        id: 'tradicional',
        name: 'Lavagem Tradicional',
        duration: 60,
        prices: { hatch: 80, sedan: 100, suv: 120, moto: 0 },
        features: ['INTERIOR', 'Aspiração geral', 'Limpeza antibactericida', 'Limpeza de entrada de portas', 'Limpeza dos vidros', 'Revitalização', 'EXTERIOR', 'Lavagem externa com snow foam', 'Limpeza das rodas', 'Limpeza da caixa de rodas', 'Secagem do veículo', 'Revitalização de plásticos e borrachas', 'Selante de pneus', 'Cera cristalizadora'],
        popular: true
    },
    {
        id: 'detalhada',
        name: 'Lavagem Detalhada',
        duration: 90,
        prices: { hatch: 130, sedan: 150, suv: 170, moto: 0 },
        features: ['INTERIOR', 'Aspiração geral', 'Limpeza antibactericida', 'Limpeza de entrada de portas', 'Limpeza dos vidros', 'Limpeza do teto', 'Limpeza das pedaleiras', 'Higienização dos bancos', 'Hidratação dos plásticos e borrachas', 'EXTERIOR', 'Lavagem externa com snow foam', 'Limpeza das rodas', 'Limpeza da caixa de rodas', 'Limpeza compartimento combustível', 'Secagem do veículo', 'Revitalização', 'Selante de pneus', 'Cera blend 4 meses de proteção'],
        popular: false
    },
    {
        id: 'exterior',
        name: 'Lavagem Exterior',
        duration: 45,
        prices: { hatch: 45, sedan: 45, suv: 50, moto: 0 },
        features: ['Lavagem detalhada', 'Cera de prote\u00e7\u00e3o', 'Revitaliza\u00e7\u00e3o de pl\u00e1sticos externos'],
        popular: false
    },
    {
        id: 'interior',
        name: 'Lavagem Interior',
        duration: 45,
        prices: { hatch: 50, sedan: 50, suv: 60, moto: 0 },
        features: ['Higieniza\u00e7\u00e3o de bancos', 'Limpeza de painel', 'Aspira\u00e7\u00e3o profunda'],
        popular: false
    }
];

// Always force-reset localStorage with the canonical 5 services.
// Preserve user-customized prices from admin panel if the id matches.
var milgrauServices = (function() {
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem('milgrau_services')); } catch(e) {}

    var result = defaultServices.map(function(def) {
        // Only restore a stored entry if it's one of our known 5 IDs
        var s = stored ? stored.find(function(x) { return x.id === def.id; }) : null;
        if (s) {
            return {
                id:       def.id,
                name:     s.name     || def.name,
                duration: s.duration !== undefined ? s.duration : def.duration,
                prices:   s.prices   || def.prices,
                features: s.features || def.features,
                popular:  s.popular  !== undefined ? s.popular  : def.popular
            };
        }
        return def;
    });

    localStorage.setItem('milgrau_services', JSON.stringify(result));
    return result;
})();

// Global Settings (WhatsApp, etc)
const defaultSettings = {
    whatsappNumber: '5549998396690',
    enableAddons: true,
    maxCapacity: 3,
    workingDays: [false, true, true, true, true, true, true], // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
    vehicleDurations: { hatch: 90, sedan: 120, suv: 120, moto: 60 },
    msgConfirm: 'Olá, *{{clientName}}*! Seu agendamento na Estética MilGrau para *{{serviceName}}* no dia {{date}} às {{time}} foi *CONFIRMADO*! Estamos te esperando.',
    msgComplete: 'Olá, *{{clientName}}*! O serviço de *{{serviceName}}* no seu veículo foi *CONCLUÍDO*! Seu carro já está limpo e pronto para retirada na Estética MilGrau.',
    msgCancel: 'Olá, *{{clientName}}*. Infelizmente tivemos que *CANCELAR* seu agendamento para *{{serviceName}}* no dia {{date}}. Por favor, entre em contato para mais informações ou para remarcarmos.',
    msgReschedule: 'Olá, *{{clientName}}*. Seu agendamento para *{{serviceName}}* na Estética MilGrau foi *REMARCADO* para o dia {{date}} às {{time}}. Qualquer dúvida, estamos à disposição.',
    msgReminder: 'Olá, *{{clientName}}*! Passando para lembrar do seu agendamento hoje na Estética MilGrau para *{{serviceName}}* às *{{time}}*. Te esperamos!'
};

var milgrauSettings = JSON.parse(localStorage.getItem('milgrau_settings'));
if (!milgrauSettings) {
    milgrauSettings = defaultSettings;
    localStorage.setItem('milgrau_settings', JSON.stringify(milgrauSettings));
} else {
    // Migration: add missing keys to existing settings
    let updated = false;
    ['msgConfirm', 'msgComplete', 'msgCancel', 'msgReschedule', 'msgReminder', 'vehicleDurations'].forEach(key => {
        if (!milgrauSettings[key]) {
            milgrauSettings[key] = defaultSettings[key];
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('milgrau_settings', JSON.stringify(milgrauSettings));
    }
}

// Time Slots
const defaultTimeSlots = ["08:00", "09:30", "10:30", "13:30", "15:00", "16:30"];
var milgrauTimeSlots = JSON.parse(localStorage.getItem('milgrau_time_slots'));
if (!milgrauTimeSlots || milgrauTimeSlots.length === 0) {
    milgrauTimeSlots = defaultTimeSlots;
    localStorage.setItem('milgrau_time_slots', JSON.stringify(milgrauTimeSlots));
}

// Addons / Extra Services
const defaultAddons = [
    { name: 'Cera Cristalizadora', price: 50, icon: 'ph-sparkle' },
    { name: 'Lavagem de Motor', price: 80, icon: 'ph-engine' },
    { name: 'Hidratação de Couro', price: 70, icon: 'ph-armchair' },
    { name: 'Oxi-Sanitização (Ar)', price: 60, icon: 'ph-wind' }
];

var milgrauAddons = JSON.parse(localStorage.getItem('milgrau_addons'));
if (!milgrauAddons || milgrauAddons.length === 0) {
    milgrauAddons = defaultAddons;
    localStorage.setItem('milgrau_addons', JSON.stringify(milgrauAddons));
}

// ==========================================
// Modern Notifications & Dialogs System
// ==========================================
window.MilGrauDialog = {
    activeToasts: {},

    init: function() {
        if(document.getElementById('milgrau-dialog-container')) return;
        
        const style = document.createElement('style');
        style.innerHTML = `
            .mg-toast-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; display: flex; flex-direction: column; align-items: center; gap: 10px; pointer-events: none; width: 90%; max-width: 400px; }
            .mg-toast { pointer-events: all; background: rgba(20, 24, 30, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px 18px; border-radius: 50px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; gap: 10px; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 500; opacity: 0; transform: translateY(-20px) scale(0.9); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-align: center; }
            .mg-toast.show { opacity: 1; transform: translateY(0) scale(1); }
            .mg-toast.success i { color: #10B981; }
            .mg-toast.error i { color: #EF4444; }
            
            .mg-toast-badge { background: rgba(255,255,255,0.15); border-radius: 20px; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; margin-left: 5px; }
            .mg-toast.bump { animation: toastBump 0.3s ease; }
            @keyframes toastBump { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
            
            .mg-dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 10001; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
            .mg-dialog-overlay.show { opacity: 1; pointer-events: all; }
            .mg-dialog { background: #181b21; border: 1px solid rgba(255,255,255,0.08); padding: 2rem; border-radius: 16px; width: 90%; max-width: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transform: scale(0.9); transition: transform 0.2s ease; font-family: 'Outfit', sans-serif; text-align: left; }
            .mg-dialog-overlay.show .mg-dialog { transform: scale(1); }
            .mg-dialog h3 { margin-top: 0; margin-bottom: 0.5rem; color: #fff; font-size: 1.25rem; font-weight: 500; }
            .mg-dialog p { color: #9ca3af; margin-bottom: 1.5rem; line-height: 1.5; font-size: 0.95rem; }
            .mg-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }
            .mg-btn { padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 500; font-family: inherit; cursor: pointer; border: none; transition: 0.2s; font-size: 0.95rem; }
            .mg-btn-cancel { background: transparent; color: #9ca3af; border: 1px solid rgba(255,255,255,0.1); }
            .mg-btn-cancel:hover { background: rgba(255,255,255,0.05); color: #fff; }
            .mg-btn-confirm { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #111; }
            .mg-btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3); }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'milgrau-dialog-container';
        container.innerHTML = `
            <div id="mg-toast-container" class="mg-toast-container"></div>
            <div id="mg-dialog-overlay" class="mg-dialog-overlay">
                <div class="mg-dialog">
                    <h3 id="mg-dialog-title">Confirmação</h3>
                    <p id="mg-dialog-message">Tem certeza?</p>
                    <div class="mg-dialog-actions">
                        <button class="mg-btn mg-btn-cancel" id="mg-dialog-cancel">Cancelar</button>
                        <button class="mg-btn mg-btn-confirm" id="mg-dialog-confirm">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
        
        document.getElementById('mg-dialog-cancel').addEventListener('click', () => {
            this.closeConfirm();
        });
    },

    showToast: function(message, type = 'success') {
        this.init();
        const container = document.getElementById('mg-toast-container');
        
        // Grouping Logic
        if (this.activeToasts[message]) {
            const toastInfo = this.activeToasts[message];
            toastInfo.count++;
            
            // Clear old timeout
            clearTimeout(toastInfo.timeoutId);
            
            // Update Badge
            let badge = toastInfo.element.querySelector('.mg-toast-badge');
            if(!badge) {
                badge = document.createElement('span');
                badge.className = 'mg-toast-badge';
                toastInfo.element.appendChild(badge);
            }
            badge.innerText = 'x' + toastInfo.count;
            
            // Animate bump
            toastInfo.element.classList.remove('bump');
            void toastInfo.element.offsetWidth; // reflow
            toastInfo.element.classList.add('bump');
            
            // Reset timeout
            toastInfo.timeoutId = setTimeout(() => {
                toastInfo.element.classList.remove('show');
                setTimeout(() => {
                    toastInfo.element.remove();
                    delete this.activeToasts[message];
                }, 400);
            }, 3500);
            
            return;
        }

        const toast = document.createElement('div');
        toast.className = `mg-toast ${type}`;
        const icon = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';
        
        toast.innerHTML = `<i class="ph-fill ${icon}" style="font-size: 1.3rem;"></i> <span>${message}</span>`;
        container.appendChild(toast);
        
        void toast.offsetWidth;
        toast.classList.add('show');
        
        const timeoutId = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                delete this.activeToasts[message];
            }, 400);
        }, 3500);
        
        this.activeToasts[message] = {
            element: toast,
            count: 1,
            timeoutId: timeoutId
        };
    },

    confirm: function(message, onConfirm) {
        this.init();
        const overlay = document.getElementById('mg-dialog-overlay');
        document.getElementById('mg-dialog-message').innerText = message;
        
        const confirmBtn = document.getElementById('mg-dialog-confirm');
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        
        newBtn.addEventListener('click', () => {
            this.closeConfirm();
            if(onConfirm) onConfirm();
        });
        
        overlay.classList.add('show');
    },
    
    closeConfirm: function() {
        document.getElementById('mg-dialog-overlay').classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MilGrauDialog.init();
});
