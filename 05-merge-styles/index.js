const fs = require("fs/promises")
const path = require("path")
const pathToStyles = path.resolve(__dirname, "styles");
const pathToBundle = path.resolve(path.join(__dirname + '/project-dist', 'bundle.css'))

const stylesDir = async () => {    

   let entries = (await fs.readdir(pathToStyles, { withFileTypes: true }))
                 .filter(item => path.extname(item.name) === '.css' && item.isFile())
                 .map(item => path.resolve(pathToStyles, item.name))
    
   return entries

}

const cssBundle = async (data) => {   

    await fs.rm(pathToBundle, { recursive: true, force: true })

    for (let item of data) {
       let string =  await fs.readFile(item, { withFileTypes: true });       

      await fs.appendFile(pathToBundle, string.toString(), function(error) {
        if(error) throw error; 
        
     });     

    }
}

stylesDir().then(data => cssBundle(data))
