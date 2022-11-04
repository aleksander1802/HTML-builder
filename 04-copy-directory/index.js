const fs = require("fs/promises")
const path = require("path")
const pathFromCopy = path.resolve(__dirname, "files")
const pathToCopy = path.resolve(__dirname, "files-copy")

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

    await fs.rm(pathToCopy, { recursive: true, force: true })

    await copyDir(pathFromCopy, pathToCopy)          

}

deleteandCreateFolder()