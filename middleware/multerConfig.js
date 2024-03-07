const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        const allowedFileTypes=["image/jpg", "image/png","image/jpeg"]
        if (!allowedFileTypes.includes(file.mimetype)){
            cb(new Error("This file type is not supported"))
            return
        }
    
        cb(null,'./storage') // --> cb(error,success)
    },
    filename : function(req,file,cb){
        cb(null,Date.now()+ "-"+ file.originalname)
        
    }
 
 
})
const limits={
    fileSize:1024*1024
}

module.exports = {
    storage,
    multer,
    limits
}