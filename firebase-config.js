const firebaseConfig = {
  apiKey: "AIzaSyD24YE4WvD9wU52BK2rWa803Q0AQSXdV_U",
  authDomain: "milgrau-84448.firebaseapp.com",
  projectId: "milgrau-84448",
  storageBucket: "milgrau-84448.firebasestorage.app",
  messagingSenderId: "458149611578",
  appId: "1:458149611578:web:950ef9d2aca98966e8cd03"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Sincronização Inteligente entre LocalStorage e Firebase Firestore
const keysToSync = ['milgrau_appointments', 'milgrau_services', 'milgrau_settings', 'milgrau_time_slots', 'milgrau_addons'];
let isFirebaseReady = false;
let isSyncingFromFirebase = false;
let syncTimeout = null;

// Timestamps de última escrita local por chave (anti-race-condition)
// Se o admin acabou de salvar, ignoramos dados antigos do Firebase por 8 segundos
window._localWriteTimestamps = {};

// Escutar mudanças do Firebase (atualização em tempo real em todos os dispositivos)
db.collection("milgrau_data").doc("global_state").onSnapshot((doc) => {
    if (doc.exists) {
        const data = doc.data();
        const firebaseUpdatedAt = data._updatedAt || 0;

        isSyncingFromFirebase = true;

        keysToSync.forEach(key => {
            const shortKey = key.replace('milgrau_', '');
            if (data[shortKey] !== undefined && data[shortKey] !== null) {

                // Anti-race-condition: se escrevemos localmente há menos de 8s,
                // confiar na versão local e NÃO sobrescrever com dados do Firebase
                const localWriteTime = window._localWriteTimestamps[key] || 0;
                const secondsSinceLocalWrite = (Date.now() - localWriteTime) / 1000;
                if (localWriteTime > 0 && secondsSinceLocalWrite < 8) {
                    // Dado local é mais recente, pular
                    return;
                }

                // Só aceitar se Firebase tiver dados válidos (array com itens, ou objeto não-vazio)
                const fbValue = data[shortKey];
                const isValidArray = Array.isArray(fbValue) && fbValue.length > 0;
                const isValidObject = !Array.isArray(fbValue) && typeof fbValue === 'object' && fbValue !== null && Object.keys(fbValue).length > 0;

                if (!isValidArray && !isValidObject) return; // Firebase tem dado inválido/vazio, não sobrescrever

                localStorage.setItem(key, JSON.stringify(fbValue));

                // Atualizar variáveis globais em memória se existirem
                if (key === 'milgrau_appointments' && typeof window.appointments !== 'undefined') {
                    window.appointments.length = 0;
                    fbValue.forEach(item => window.appointments.push(item));
                }
                if (key === 'milgrau_services' && typeof window.milgrauServices !== 'undefined') {
                    window.milgrauServices.length = 0;
                    fbValue.forEach(item => {
                        // MIGRATION: Inject featuresMoto and default moto prices if missing from Firebase
                        if (typeof defaultServices !== 'undefined') {
                            const def = defaultServices.find(d => d.id === item.id);
                            if (def) {
                                if (!item.featuresMoto) item.featuresMoto = def.featuresMoto;
                                if (!item.prices) item.prices = {};
                                if (item.prices.moto === undefined || item.prices.moto === 0) {
                                    item.prices.moto = def.prices.moto;
                                }
                            }
                        }
                        window.milgrauServices.push(item);
                    });
                }
                if (key === 'milgrau_settings' && typeof window.milgrauSettings !== 'undefined') {
                    Object.assign(window.milgrauSettings, fbValue);
                }
                if (key === 'milgrau_time_slots' && typeof window.milgrauTimeSlots !== 'undefined') {
                    window.milgrauTimeSlots.length = 0;
                    fbValue.forEach(item => window.milgrauTimeSlots.push(item));
                }
                if (key === 'milgrau_addons' && typeof window.milgrauAddons !== 'undefined') {
                    window.milgrauAddons.length = 0;
                    fbValue.forEach(item => window.milgrauAddons.push(item));
                }
            }
        });

        isSyncingFromFirebase = false;
        isFirebaseReady = true;

        // Se a UI já carregou, forçar atualização visual
        if (typeof renderDashboard === 'function') renderDashboard();
        if (typeof renderAllAppointments === 'function') renderAllAppointments();
        if (typeof renderServices === 'function') renderServices();
        if (typeof updateServicesDropdown === 'function') updateServicesDropdown();
        if (typeof renderAddons === 'function') renderAddons();
        const dateInput = document.getElementById('booking-date');
        if (dateInput && typeof updateTimeSlots === 'function') updateTimeSlots(dateInput.value);

    } else {
        // Primeira vez: subir dados locais para Firebase
        isFirebaseReady = true;
        syncToFirebase();
    }
});

// Interceptar todos os saves locais (localStorage.setItem) para subir ao Firebase
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
    originalSetItem(key, value);

    if (keysToSync.includes(key) && !isSyncingFromFirebase) {
        // Registrar timestamp da escrita local (anti-race-condition)
        window._localWriteTimestamps[key] = Date.now();

        if (isFirebaseReady) {
            syncToFirebase();
        }
    }
};

// Subir dados locais ao Firebase (debounce reduzido para 300ms)
function syncToFirebase() {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
        const data = { _updatedAt: Date.now() };
        keysToSync.forEach(key => {
            const shortKey = key.replace('milgrau_', '');
            try {
                const raw = localStorage.getItem(key);
                if (raw) {
                    data[shortKey] = JSON.parse(raw);
                }
            } catch(e) {}
        });
        db.collection("milgrau_data").doc("global_state").set(data, { merge: true }).catch(console.error);
    }, 300); // 300ms debounce - muito mais rápido que antes (era 1000ms)
}
