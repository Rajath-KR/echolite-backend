import User from '../models/userModal.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_fallback';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email 
          ? 'Email already in use' 
          : 'Username already taken'
      });
    }
    
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    const token = generateToken(newUser._id);
    
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    
    const token = generateToken(user._id);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};