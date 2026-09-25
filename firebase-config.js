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

// Sincronización Inteligente entre LocalStorage y Firebase Firestore
const keysToSync = ['milgrau_appointments', 'milgrau_services', 'milgrau_settings', 'milgrau_time_slots', 'milgrau_addons'];
let isFirebaseReady = false;
let isSyncingFromFirebase = false;
let syncTimeout = null;

// Escuchar cambios desde Firebase (para actualización en tiempo real en todos los dispositivos)
db.collection("milgrau_data").doc("global_state").onSnapshot((doc) => {
    if (doc.exists) {
        const data = doc.data();
        isSyncingFromFirebase = true; // Prevenir ciclo infinito al guardar localmente

        keysToSync.forEach(key => {
            const shortKey = key.replace('milgrau_', '');
            if (data[shortKey]) {
                localStorage.setItem(key, JSON.stringify(data[shortKey]));
                
                // Actualizar variables globales en memoria si existen
                if (key === 'milgrau_appointments' && typeof window.appointments !== 'undefined') {
                    window.appointments.length = 0;
                    data[shortKey].forEach(item => window.appointments.push(item));
                }
                if (key === 'milgrau_services' && typeof window.milgrauServices !== 'undefined') {
                    window.milgrauServices.length = 0;
                    data[shortKey].forEach(item => window.milgrauServices.push(item));
                }
                if (key === 'milgrau_settings' && typeof window.milgrauSettings !== 'undefined') {
                    Object.assign(window.milgrauSettings, data[shortKey]);
                }
                if (key === 'milgrau_time_slots' && typeof window.milgrauTimeSlots !== 'undefined') {
                    window.milgrauTimeSlots.length = 0;
                    data[shortKey].forEach(item => window.milgrauTimeSlots.push(item));
                }
                if (key === 'milgrau_addons' && typeof window.milgrauAddons !== 'undefined') {
                    window.milgrauAddons.length = 0;
                    data[shortKey].forEach(item => window.milgrauAddons.push(item));
                }
            }
        });
        
        isSyncingFromFirebase = false;
        isFirebaseReady = true;

        // Si la UI ya cargó, forzar actualización visual
        if (typeof renderDashboard === 'function') renderDashboard();
        if (typeof renderAllAppointments === 'function') renderAllAppointments();
        if (typeof renderServices === 'function') renderServices();
        if (typeof renderAddons === 'function') renderAddons();
        const dateInput = document.getElementById('booking-date');
        if (dateInput && typeof updateTimeSlots === 'function') updateTimeSlots(dateInput.value);

    } else {
        // Es la primera vez que se usa Firebase en este proyecto, subir datos locales iniciales
        isFirebaseReady = true;
        syncToFirebase();
    }
});

// Interceptar todos los guardados locales (localStorage.setItem) para subirlos a Firebase automáticamente
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    
    // Si la clave es de nuestro sistema y no proviene de una actualización de Firebase, subirla
    if (isFirebaseReady && keysToSync.includes(key) && !isSyncingFromFirebase) {
        syncToFirebase();
    }
};

// Función para subir los datos locales a Firebase agrupados (debounce)
function syncToFirebase() {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
        const data = {};
        keysToSync.forEach(key => {
            const shortKey = key.replace('milgrau_', '');
            data[shortKey] = JSON.parse(localStorage.getItem(key)) || [];
            // Si es un objeto en lugar de arreglo, parsear o asignar null
            if (key === 'milgrau_settings') {
                data[shortKey] = JSON.parse(localStorage.getItem(key)) || null;
            }
        });
        db.collection("milgrau_data").doc("global_state").set(data).catch(console.error);
    }, 1000); // Esperar 1 segundo de inactividad antes de subir (evita múltiples escrituras simultáneas)
}
