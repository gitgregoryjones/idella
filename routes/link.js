var link = require('fs-symlink')
 
link(process.cwd() + '/../public/js', process.cwd() + '/../public/american.com/js', 'junction').then(function () {
 
})
console.log(__dirname);
console.log(process.cwd());
