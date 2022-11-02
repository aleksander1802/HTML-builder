const fs = require('fs')
const path = require('path');
const pathDir = path.resolve(__dirname, 'text.txt')
const readableStream = fs.createReadStream(pathDir);

// или вариант в одну строку
readableStream.on('data', chunk => console.log(chunk.toString()))

// или вариант ниже
// let data = '';
// readableStream.on('data', chunk => data += chunk);
// readableStream.on('end', () => console.log(data));