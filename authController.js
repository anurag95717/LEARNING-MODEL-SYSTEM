import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';
import validator from 'validator';
import genToken from '../config/token.js';
import sendMail from '../config/sendMail.js';




export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Enter a strong password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
  
};
export const logOut = async(req, res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({ message: 'LogOut successfully.' });
    } catch (error) {
        return res.status(500).json({message:`LogOut error ${error}`})
        
    }
}

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerifed = false;
    await user.save();

    await sendMail(email, otp); // ✅ Corrected this line

    return res.status(200).json({ message: 'Otp sent successfully' });
  } catch (error) {
    return res.status(500).json({ message: `send otp error: ${error.message}` });
  }
};


export const verifyOTP = async (req,res)=>{
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp != otp || user.otpExpires < Date.now()){
        return res.status(401).json({ message: 'Invalid OTP' });

        }
        user.isOtpVerifed = true,
        user.resetOtp = undefined,
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({massage:'Otp Verified Successfully'})
        
        
    } catch (error) {
        return res.status(500).json({massage:`Otp Verified error ${error}`})
        
    }
}

export const resetPassword = async (req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerifed){
        return res.status(401).json({ message: 'OTP verification is required' });

        }
        const hashedPassword = await bcrypt.hash(password,10)
        user.password = hashedPassword,
        user.isOtpVerifed = false
        await user.save()
        return res.status(200).json({message:"ResetPassword Successfully"})

    } catch (error) {
        return res.status(500).json({massage:`ResetPassword error ${error}`})
    }
}

export const googleAuth = async (req,res)=>{
    try {
        const {name,email,role} = req.body
        const user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name,
                email,
                role,
            })
        }
        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set to true if using HTTPS
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({massage:`googleAuth error ${error}`})
        
    }
}