const fs = require('fs');
let c = fs.readFileSync('c:/Users/Elias/Documents/MilGrau/admin.js', 'utf8');

const escapeFunc = `const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};
`;

c = escapeFunc + c;
c = c.replace(/\bapp\.clientName\b/g, 'escapeHTML(app.clientName)')
     .replace(/\bapp\.clientPhone\b/g, 'escapeHTML(app.clientPhone)')
     .replace(/\bapp\.clientVehicle\b/g, 'escapeHTML(app.clientVehicle)')
     .replace(/\bapp\.notes\b/g, 'escapeHTML(app.notes)');

fs.writeFileSync('c:/Users/Elias/Documents/MilGrau/admin.js', c);
