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