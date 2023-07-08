const express=require('express')
const router=express.Router()
const {home}=require('../controller/Home')
router.get('/h',home)

module.exports=router