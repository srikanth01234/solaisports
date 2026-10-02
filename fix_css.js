const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const startStr = '/* ==========================================================================\r\n       TRANSPARENT GLASSMORPHISM POPUP MODAL SCREEN';
const startStr2 = '/* ==========================================================================\n       TRANSPARENT GLASSMORPHISM POPUP MODAL SCREEN';

let startIndex = indexHtml.indexOf(startStr);
if (startIndex === -1) startIndex = indexHtml.indexOf(startStr2);

const endStr = '/* ==========================================================================\r\n       MINIMAL ANIMATIONS';
const endStr2 = '/* ==========================================================================\n       MINIMAL ANIMATIONS';

let endIndex = indexHtml.indexOf(endStr);
if (endIndex === -1) endIndex = indexHtml.indexOf(endStr2);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find start or end index", startIndex, endIndex);
    process.exit(1);
}

// Find the line just before MINIMAL ANIMATIONS where the } is.
const cssBlock = indexHtml.substring(startIndex, endIndex);

['about.html', 'projects.html', 'services.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('.quote-modal-overlay {')) {
        content = content.replace('</style>', '\n    ' + cssBlock + '\n  </style>');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`${file} already has the modal CSS`);
    }
});
