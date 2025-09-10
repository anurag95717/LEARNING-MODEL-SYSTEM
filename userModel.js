import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
    
  },
  description:{
    type:String

  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'educator'],
    required:true
  },
  photoUrl:{
    type:String,
    default:""
  },
  enrolledCourses:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Cources",
  }],
  resetOtp:{
    type:String
  },
  otpExpires:{
    type:Date
  },
  isOtpVerifed:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
