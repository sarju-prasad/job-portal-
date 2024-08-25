import { User } from "../models/users.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        // Validate fields
        if (!fullName || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
                success: false,
            });
        }

        // Hash password and create new user
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            email,
            password: hashPassword,
            phoneNumber,
            role
        });

        return res.status(201).json({
            message: 'User registered successfully',
            success: true,
            user: newUser
        });

    } catch (error) {
        console.error(`Error in user registration: ${error}`);
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Required fields are missing",
                success: false,
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Invalid password',
                success: false,
            });
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: 'Role mismatch',
                success: false,
            });
        }
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: "User logged in successfully",
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error(`Error in user login: ${error}`);
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};
export const logout = async (req, res) => {
    try {
        return res.status(200).clearCookie("token").json({
            message: 'User logged out successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error in user logout:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, bio, phoneNumber, skills } = req.body;
        const userId = req.userId; 
        if (!fullName || !email || !bio || !phoneNumber || !skills) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false,
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        user.fullName = fullName;
        user.email = email;
        user.profile = { ...user.profile, bio, skills: skills.split(",") };
        user.phoneNumber = phoneNumber;

        await user.save();

        return res.status(200).json({
            message: 'User profile updated successfully',
            success: true,
            user: {
                fullName,
                email,
                phoneNumber,
                bio,
                skills
            }
        });

    } catch (error) {
        console.error(`Error updating user profile: ${error}`);
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};
