const fs = require('fs');

['about.html', 'projects.html', 'services.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace literal '\n  </script>' with '\n  </script>' properly
    if (content.includes('\\n  </script>')) {
        content = content.replace('\\n  </script>', '\n  </script>');
        fs.writeFileSync(file, content);
        console.log(`Fixed syntax error in ${file}`);
    }
});
