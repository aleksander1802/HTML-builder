const fs = require("fs/promises");
const path = require("path");

const pathToStyles = path.resolve(__dirname, "styles");
const pathToBundle = path.resolve(path.join(__dirname + '/project-dist', 'style.css'))
const pathToDist = path.resolve(__dirname, 'project-dist');
const pathToTemplate = path.resolve(__dirname, 'template.html')
const pathToHtml = path.resolve(pathToDist, 'index.html');
const pathToComponents = path.resolve(__dirname, 'components');
const pathFromCopy = path.resolve(__dirname, "assets")
const pathToCopy = path.resolve(pathToDist, "assets")

const createDist = async () => { 

    let obj = {}

    await fs.rm(pathToDist, { recursive: true, force: true }) // удаляем папку project-dist

     await fs.mkdir(pathToDist, { recursive: true }, err => { // создаём папку project-dist
         if (err) throw err;         
      }) 

    const entries = (await fs.readdir(pathToComponents, {withFileTypes: true}))
                .filter(item => path.extname(item.name) && item.isFile())                         
             
    for (let item of entries) {          
        
    await fs.readFile(path.resolve(pathToComponents, item.name)).then(data => obj[item.name] = data.toString() )
    
    }

    return obj    
}

const newHtml = async (someObject) => {

    let stringOfHTML = await fs.readFile(pathToTemplate).then(data => data.toString())

    for (let key in someObject) {

        stringOfHTML =  stringOfHTML.replace(`{{${key.split('.')[0]}}}`, someObject[key])       

    }

    await fs.writeFile(pathToHtml, stringOfHTML, (err) => {
        if (err) {
            throw err
        }        
    })   

    stylesDir().then(data => cssBundle(data)) // создаём style.css

}

const stylesDir = async () => {    

    let entries = (await fs.readdir(pathToStyles, { withFileTypes: true }))
                  .filter(item => path.extname(item.name) === '.css' && item.isFile())
                  .map(item => path.resolve(pathToStyles, item.name))
     
    return entries
 
 }
 
 const cssBundle = async (data) => {       
 
     for (let item of data) {
        let string =  await fs.readFile(item, { withFileTypes: true });       
 
       await fs.appendFile(pathToBundle, string.toString(), function(error) {
         if(error) throw error; 
         
      });     
 
     }

     deleteAndCreateFolder() // копируем папку assests со всем содержимым

 }

 const copyDir = async (src, dest) => {
     
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.resolve(path.join(src, entry.name))
        let destPath = path.resolve(path.join(dest, entry.name)) 

        entry.isDirectory() ? await copyDir(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
    }    
}

const deleteAndCreateFolder = async () => {

    await copyDir(pathFromCopy, pathToCopy)

}

createDist().then(data => newHtml(data))
