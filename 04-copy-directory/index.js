const fs = require("fs/promises")
const path = require("path")
const pathFromCopy = path.resolve(__dirname, "files")
const pathToCopy = path.resolve(__dirname, "files-copy")
const {stat} = require('fs');

const deleteExistsDirectory = async () => {    
    await fs.rm(pathToCopy, { recursive: true, force: true })
}

const  copyDir = async (src, dest) => {
     
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.resolve(path.join(src, entry.name))
        let destPath = path.resolve(path.join(dest, entry.name)) 

        entry.isDirectory() ? await copyDir(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
    }    
}

const deleteandCreateFolder = async () => {

    stat(pathToCopy, async function(err) {
        if (!err) {
            console.log(`\nDirectory is already exists. Ok, then let's update the files and folders`);
            await deleteExistsDirectory()
            console.log('____________\n');
            await copyDir(pathFromCopy, pathToCopy)
           console.log('Files was succesfully updated\n');
        }
        else if (err.code === 'ENOENT') {
            console.log('\nCreate a directory\n');
           await copyDir(pathFromCopy, pathToCopy)
           console.log('Directory was successfully created the files were successfully copied\n');
        }
    });

}

deleteandCreateFolder()