const path = require('path');
const fs = require('fs');
const pathDir = path.resolve(__dirname, 'text.txt');
const {stdout, stdin} = process;
const writableStream = fs.createWriteStream(pathDir)

stdout.write('Greetings my friend! Write something, please\n');

stdin.on('data', data => { 

  let string = data.toString().trim() 
  
  if (string === 'exit') {
    console.log(`Goodbye my friend!`);
    writableStream.close()
    process.exit()
  }
  
  writableStream.write(`${string}\n`)
  console.log(`Write something else, please`);   

 })

 process.on('SIGINT', () => {
  console.log(`Прощайте хлопцы, I'll be back!`);
  process.exit()
});
