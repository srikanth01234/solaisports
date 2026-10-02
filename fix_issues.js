const fs = require('fs');

const filesToFixLogo = ['index.html', 'about.html', 'projects.html', 'services.html', 'contact.html', 'visit.html'];
const filesToFixWhatsapp = ['about.html', 'projects.html', 'services.html'];

// CSS to inject for the tooltip
const tooltipCss = `
    .whatsapp-tooltip {
      position: absolute;
      right: 72px;
      top: 50%;
      transform: translateY(-50%) translateX(10px);
      background: rgba(10, 18, 12, 0.92);
      backdrop-filter: blur(8px);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    }

    .whatsapp-float-btn:hover .whatsapp-tooltip {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
`;

// 1. Fix Logo Size
filesToFixLogo.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    // Change height from 48px to 56px or 60px
    content = content.replace(/\.brand-logo-img\s*{\s*height:\s*48px;/g, '.brand-logo-img {\n      height: 58px;');
    fs.writeFileSync(file, content);
    console.log(`Increased logo size in ${file}`);
});

// 2. Fix Whatsapp Button Issues
filesToFixWhatsapp.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Remove the old duplicate button block
    const oldBtnStart = '<!-- WHATSAPP BUTTON -->';
    const oldBtnEnd = '</a>\r\n\r\n  <!-- ====== JAVASCRIPT ====== -->';
    const oldBtnEnd2 = '</a>\n\n  <!-- ====== JAVASCRIPT ====== -->';

    let startIndex = content.indexOf(oldBtnStart);
    if (startIndex !== -1) {
        let endIndex = content.indexOf(oldBtnEnd, startIndex);
        let len = oldBtnEnd.length;
        if (endIndex === -1) {
            endIndex = content.indexOf(oldBtnEnd2, startIndex);
            len = oldBtnEnd2.length;
        }
        
        if (endIndex !== -1) {
            // Cut out the old button block
            content = content.substring(0, startIndex) + '<!-- ====== JAVASCRIPT ====== -->' + content.substring(endIndex + len);
            console.log(`Removed duplicate whatsapp button from ${file}`);
        }
    }

    // Inject tooltip CSS if missing
    if (!content.includes('.whatsapp-tooltip {')) {
        content = content.replace('</style>', tooltipCss + '\n  </style>');
        console.log(`Injected tooltip CSS into ${file}`);
    }

    fs.writeFileSync(file, content);
});
