const fs = require('fs');
const h = fs.readFileSync('futgg.html', 'utf8');
const urls = h.match(/https:\/\/[^"']+/g) || [];
console.log(urls.filter(u => u.includes('api') || u.includes('trpc')).slice(0, 10));
