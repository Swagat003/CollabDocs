import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/user.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isPresent = await UserModel.findOne({ email });
        if (isPresent) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new UserModel({ name, email, password });
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.status(201).json({ 
            message: 'Signed up successfully',
            success: true 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const jwtToken = jwt.sign({ email: user.email, _id:user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Logged in successfully',
            token: jwtToken,
            success: true,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
}