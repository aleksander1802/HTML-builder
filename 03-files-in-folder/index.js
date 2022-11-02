const fs = require('fs');
const path = require('path');
const { readdir, stat } = require('fs/promises');

const secretFolderPath = path.resolve(__dirname, 'secret-folder');

const filesType = async (path) => {

   try {
    const types = await readdir(path, {withFileTypes: true})
    return types
   }
   catch(error) {        
        return error.message
   }
} 

const filesInfo  = async (string) => {
    try {
        const info = await stat(string)
        return info
    }
    catch(error) {
        return error.message
    }   
}

const filesDescription = (array) => {
    
    const arrayOnlyWithFiles = array.filter(item => item.isFile())
    
    arrayOnlyWithFiles.map(item => {     
    
        filesInfo(path.resolve(secretFolderPath, item.name), 'data')
        .then(res => console.log(
            `Filename: ${item.name.split('.')[0]} - Format: ${(path.extname(item.name)).split('.')[1]} - Size: ${res.size} bytes`))
    });    
    
}

filesType(secretFolderPath).then(data => filesDescription(data))