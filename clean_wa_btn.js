const fs = require('fs');

['about.html', 'projects.html', 'services.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // This regex looks for an anchor tag with class="whatsapp-float-btn" but NO id="waFloatBtn"
    // and captures from the preceding comment up to the closing </a>
    // We want to delete this entirely.
    const regex = /<!--\s*FLOATING WHATSAPP BUTTON\s*-->\s*<a href="https:\/\/wa\.me[^>]*?class="whatsapp-float-btn"[^>]*?>[\s\S]*?<\/a>/gi;
    const regex2 = /<!--\s*WHATSAPP BUTTON\s*-->\s*<a href="https:\/\/wa\.me[^>]*?class="whatsapp-float-btn"[^>]*?>[\s\S]*?<\/a>/gi;

    let original = content;
    content = content.replace(regex, '');
    content = content.replace(regex2, '');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Cleaned up duplicate whatsapp buttons in ${file}`);
    }
});
