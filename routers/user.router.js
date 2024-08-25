import express from 'express';
import { login, logout, register, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewars/isAuthenticate.js';



const router=express.Router();
console.log("this is the router page")

router.post('/register',(req,res)=>{
   register(req,res);
});
router.post('/login',(req,res)=>{
    login(req,res);
});

router.post('/profile/update',isAuthenticated,(req,res)=>{
    updateProfile(req,res);
});

router.post('/logout',isAuthenticated,(req,res)=>{
    logout(req,res);
})

export default router;