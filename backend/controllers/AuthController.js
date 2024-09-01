import { User } from "../models/UserModel.js"
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import{generateVerificationCode,generateTokenAndSetCookie,sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetPasswordSuccessEmail} from '../utils/index.js'

export const signup = async (req,res) => {
    const {email,password,name} = req.body
    try {
        if(!email || !password || !name)
        {
            throw new Error('All fields are required')
        }

        const userAlreadyExits = await User.findOne({email});
        if(userAlreadyExits)
        {
            return res.status(400).json({success:false,message:"User is already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password,10);
        const verificationToken = generateVerificationCode()
        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000,

        })

        await user.save();

        const token= generateTokenAndSetCookie(res,user._id);

        await sendVerificationEmail(user.email,verificationToken);
        res.status(201).json({success:true,message:"User created Successfully",user:{...user._doc,password:undefined}});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
} 

export const verifyEmail = async (req,res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt: {$gt:Date.now()}
        });

        if(!user)
        {
            return res.status(400).json({success:false,message: "Invalid or expired verification code!"});

        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({
            success:true,
            message:"Email verified successfully",
            user:{...user._doc,password:undefined}
        })

    } catch (error) {
        return res.status(400).json({success:false,message:error.message})

    }
}

export const login = async (req,res) => {
    const {email,password} = req.body
    try {
        if(!email || !password)
        {
            throw new Error('All fields are required')
        }

        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({success:false,message:"invalid credentials!"})
        }

        const isPasswordValid = await bcryptjs.compare(password,user.password);
        if(!isPasswordValid)
        {
            return res.status(400).json({success:false,message:"invalid credentials!"})
        }

        user.lastLogin = new Date();
        await user.save();
        const token= generateTokenAndSetCookie(res,user._id);
        res.status(201).json({success:true,message:"User Logged in Successfully",user:{...user._doc,password:undefined}});
    } catch (error) {
        console.log("error in login!");
        return res.status(400).json({success:false,message:error.message})
    }
} 

export const logout = async (req,res) => {
    res.clearCookie('token');
    res.status(201).json({success:true,message:"User Logged out Successfully"});
    
} 

export const forgotPassword = async (req,res) => {
    const {email} = req.body;
    console.log(email)
     try {
        const user = await User.findOne({
            email
        });

        if(!user)
        {
            //here we pretend to send email
            return res.status(200).json({
                message:"reset email sent successfully",
                success:true
            })
        }
        //generate reset token

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();
        await sendPasswordResetEmail(email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        return res.status(200).json({
            message:"reset email sent successfully",
            success:true
        });
           

     } catch (error) {
        return res.status(400).json({
            message:error.message,
            success:false
        })
     }
}

export const resetPassword = async (req,res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        });

        if(!user)
        {
            return res.status(400).json({
                message:"invalid or expired reset token",
                success:false
            });
        }

        user.password = await bcryptjs.hash(password,10);
        await user.save();

        await sendResetPasswordSuccessEmail(user.email);


        return res.status(200).json({
            message:"Password updated successfully",
            success:true
        });

    } catch (error) {
        return res.status(400).json({
            message:error.message,
            success:false
        })
    }
}

export const checkAuth = async (req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false
            })
        }
        return res.status(200).json({
            user,
            success:true
        });

    } catch (error) {
        console.log("Error in verification ",error.message);
        return res.status(500).json({
            message:"server error",
            success:false
        })
    }
}