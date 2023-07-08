const validator =require('validator')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Please provide a name'],
    maxLength:[40,'Name should be under 40 characters'],
},
email:{
    type:String,
    required:[true,'Please provide an email'],
    validate:[validator.isEmail,'Please enter email in correct format'],
    unique:[true,'This Email is Already registered']
},
password:{
    type:String,
    required:[true,'Please provide the password'],
    minLength:[6,'Password should be atleast 6 characters'],
    select:false
},
role:{
    type:String,
    default:'User',
},
photo:{
    id:{
        type:String,
        // required:true
    },
    secureUrl:{
        type:String,
        // required:true
    }
},
forgotPasswordToken:{
    type:String
},
forgotPasswordExpiry:{
    type:Date
},
createdAt:{
    type:Date,
    default:Date.now
}
})
//encrypt password before save
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
 this.password=await bcrypt.hash(this.password,10) 
 next()
})
//validate the password with passed on user
userSchema.methods.isValidatedPassword=async function(usersendPass){
    return await bcrypt.compare(usersendPass,this.password)
}
//create and return jwt token
userSchema.methods.getJwtToken= function(){

const token= jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRY
    })
    return token
}
//generate forgot password token
userSchema.methods.getForgotPassToken=function(){
  //generate a long and random string
  const forgotToken=crypto.randomBytes(20).toString('hex')
  //getting a hash
  this.forgotPasswordToken=crypto.
  createHash('sha256')
  .update(forgotToken)
  .digest('hex')
  //time of token
  this.forgotPasswordExpiry=Date.now()+ 20*60*1000

  return forgotToken
}
module.exports=mongoose.model('User',userSchema)
