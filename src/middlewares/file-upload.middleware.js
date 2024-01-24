import multer from "multer";

const storageConfig = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,"public/images/");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"_"+file.originalname);
    }
});

export const uploadFile = multer({storage:storageConfig});

//we'll not be using it -while hosting onlince it created a problem
// basically the image was first getinng save to directory - on online it was not able to save
// it to the directory there 
// so as a work around we will straight away store it in mongo db