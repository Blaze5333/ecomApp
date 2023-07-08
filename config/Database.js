const mongoose=require('mongoose')
const connection=async()=>{
  mongoose.connect(process.env.DB_URL).then(()=>{
    console.log('Connected to database')
  })
}
module.exports=connection