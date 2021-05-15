const router = require('express').Router()
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "./uploadedImages/",
    filename: function(req, file, cb){
       cb(null,"User-" + Date.now() + path.extname(file.originalname));
    }
 });
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 })
router.post('/',upload.array("files"),(req,res)=>{
    res.send({
        filesUploaded : req.files.map(file=>file.originalname)
    })
})
module.exports = router