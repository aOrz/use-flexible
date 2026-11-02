const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
let output;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../bin/flexible.js'), 'utf8'), {
  require: name => {
    if (name === 'path') return path;
    if (name === 'glob') return (pattern, callback) => callback(null, pattern === '*.css' ? ['style.css'] : []);
    if (name === 'fs') return {
      readFile: (file, encoding, callback) => callback(null, 'a { width:37.5px; margin:-7.5px; padding:.75px; border:0px; font-size:15px; }'),
      writeFile: (file, data, callback) => { output = data; callback(null); }
    };
    throw new Error(name);
  },
  process: { cwd: () => '/tmp' }, console: { log: () => {} }
});
assert.strictEqual(output, 'a { width:1rem; margin:-0.2rem; padding:0.02rem; border:0rem; font-size:15px; }');
console.log('decimal CSS conversion regression tests passed');
