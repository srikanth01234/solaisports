const fs = require('fs');

const floatBtnHtml = `
  <!-- FLOATING WHATSAPP BUTTON -->
  <a href="https://wa.me/918056531313?text=Hi%20Solai%20Sports%20Infra,%20I%20am%20interested%20in%20a%20construction%20quote."
    target="_blank" class="whatsapp-float-btn" id="waFloatBtn" aria-label="Chat on WhatsApp">
    <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
      <path
        d="M16 2a13.93 13.93 0 0 0-11.83 21.23L2 30l7.03-1.84A13.93 13.93 0 1 0 16 2zm0 25.55a11.54 11.54 0 0 1-5.89-1.61l-.42-.25-4.38 1.15 1.17-4.27-.27-.44A11.56 11.56 0 1 1 16 27.55zm6.34-8.63c-.35-.17-2.07-1.02-2.39-1.14s-.55-.17-.78.17-.9 1.14-1.1 1.37-.41.26-.76.09a9.62 9.62 0 0 1-2.82-1.74 10.6 10.6 0 0 1-1.95-2.43c-.21-.35 0-.54.16-.71.16-.16.35-.41.53-.62s.23-.35.35-.58a.7.7 0 0 0 0-.66c-.09-.17-.78-1.88-1.07-2.58s-.57-.59-.78-.6h-.66a1.27 1.27 0 0 0-.92.43 3.9 3.9 0 0 0-1.22 2.9 6.78 6.78 0 0 0 1.42 3.6 15.54 15.54 0 0 0 5.96 5.26 13.37 13.37 0 0 0 1.99.73 4.8 4.8 0 0 0 2.21.14 3.6 3.6 0 0 0 2.37-1.67 2.92 2.92 0 0 0 .2-1.67c-.08-.13-.3-.21-.65-.38z" />
    </svg>
    <span class="whatsapp-tooltip">Chat with Us on WhatsApp</span>
  </a>

  <!-- GLASSMORPHISM TIMED POPUP MODAL SCREEN -->`;

['about.html', 'projects.html', 'services.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the modal start comment with the button + modal start comment
    if (content.includes('<!-- GLASSMORPHISM TIMED POPUP MODAL SCREEN -->') && !content.includes('id="waFloatBtn"')) {
        content = content.replace('<!-- GLASSMORPHISM TIMED POPUP MODAL SCREEN -->', floatBtnHtml.trim());
        fs.writeFileSync(file, content);
        console.log(`Re-added whatsapp button to ${file}`);
    }
});
