const express=require('express')
require('dotenv').config()
const bodyParser=require('body-parser')
const port=process.env.PORT
const morgan=require('morgan')
const fileUpload=require('express-fileupload')
const cookieParser=require('cookie-parser')
const connection=require('./config/Database')
const cloudinary=require('cloudinary').v2

connection()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const app=express()
app.use(morgan('tiny'))
app.set("view engine","ejs")
app.get('/signuptest',(req,res)=>{
    res.render('postForm')
})
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const homeRouter=require('./routes/Home')
app.use('/api',homeRouter)
const UserRouter=require('./routes/User')
app.use('/api/v1',UserRouter)


app.listen(port,()=>{
    console.log(`Listening on ${port}`)
})