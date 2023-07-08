const User=require('../models/User')
const BigPromise=require('../middleware/bigPromise')
const cookieToken = require('../utils/cookieToken')
const fileUpload=require('express-fileupload')
const cloudinary=require('cloudinary').v2
exports.signup=BigPromise(async(req,res,next)=>{
    let result
    console.log(req.files)
    if(req.files){
        let file=req.files.photo
     result= await cloudinary.uploader.upload(file.tempFilePath,{
            folder:'users',
            width:150,
            crop:"scale"
        })
    }
    const {name,email,password}=req.body
    if(!email || !name || !password){
         return next(new Error("Name,Email and Password is required"))
    }
    const user=await User.create({
        name,
        email,
        password,
        photo:{
            id:result.public_id,
            secureUrl:result.secure_url
        }
    })
    cookieToken(user,res);
})