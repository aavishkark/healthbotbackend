const express=require('express');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const { UserModel } = require('../Model/users.model');
const jwt=require('jsonwebtoken')

userRouter.post('/signup',async(req,res)=>{
    const {name,email,password}=req.body
    try{
        bcrypt.hash(password, 5,async(err, hash)=> {
          if(err){
            res.status(200).send({"msg":"Not able to generate hash","err":err})
          }
          else{
            const user=new UserModel({
                name,
                email,
                password:hash,
            })
            await user.save()
            res.status(200).send({"msg":"The new use is registered scuccessfully","new_user":req.body})
          }
        });
    }
    catch(err){
           res.status(400).send({"err":err})
    }
})

userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, async(err, result)=> {
                if(result){
                    const token=jwt.sign({email:email},"masai")
                    res.status(200).send({"msg":"Login Successfull","token":token})
                }
                else{
                    res.status(200).send({"msg":"Wrong credentials","err":err})
                }
            });
            
        }
        else{
            res.status(200).send({"msg":"User Does not exist"})  
        }
    }
    catch(err){
        res.status(400).send({"err":err})
    }
})

module.exports={userRouter};