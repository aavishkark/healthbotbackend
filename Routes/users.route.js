const express=require('express');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const { UserModel } = require('../Model/users.model');
const jwt = require('jsonwebtoken');

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


userRouter.post('/query', async (req, res) => {
    try {
      const { query } = req.body;
  
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.Groq}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content:
                "You are a helpful nutrition assistant. Only answer questions related to calories and your response will only have calories and nothing else.The response should not be in range it should always be a number. If user specifies specific amount then make your response according to it.Here is some example: 'How many calories are in 200g of chicken breast?' and the answer should be '300 calories in 200g chicken breast'.'How many calories are in chicken breast?' and the answer should be '160 calories in 100g chicken breast'. Notice the second question is not specific about the amount but you are still giving the answer in 100g. If user asks about the calories in a specific amount then give the answer according to that amount.",
            },
            { role: 'user', content: query },
          ],
        }),
      });
  
      const data = await response.json();
      const answer = data.choices[0].message.content;
      res.status(200).json({ reply: answer });
  
    } catch (error) {
      console.error('Groq API Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  userRouter.post('/addcalories', async (req, res) => {
    const email = req.body.email;
  
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
  
    try {
      const { calories, foodItem, foodAmount } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      user.calories.push({ calories, foodItem, foodAmount });
      await user.save();
  
      res.status(200).json({ msg: "Calories added to user profile", user });
    } catch (err) {
      res.status(500).json({ msg: "Error saving calorie info", error: err.message });
    }
  });

  userRouter.get('/getProfile', async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      res.status(200).json({ user: user });
    } catch (err) {
      res.status(500).json({ msg: "Error fetching calorie info", error: err.message });
    }
  });
  
module.exports={userRouter};