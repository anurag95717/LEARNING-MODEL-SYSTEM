import React, { useState } from 'react';
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import ClipLoader from "react-spinner" // ✅ Correct spinner
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utlas/firebase';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login", // ✅ fixed the = mistake
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const googleLogin = async () =>{
    try {
        const response = await signInWithPopup(auth,provider)
        let user = response.user
        let name = user.displayName
        let email = user.email
        let role = ''
        const result = await axios.post(serverUrl + "/api/auth/googleauth",{name,email,role},{withCredentials:true})

        dispatch(setUserData(result.data))
        navigate("/");
        toast.success("Login Successful");
    } catch (error) {
        console.log(error)
        toast.error("Signup failed. Please try again.");
    }
  }

  return (
    <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center'>
      <form
        className='w-[90%] md:w-200 h-150 bg-white shadow-xl rounded-2xl flex'
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Left side */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3'>
          <div>
            <h1 className='font-semibold text-black text-2xl'>Welcome back</h1>
            <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
          </div>

          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input
              id='email'
              type="text"
              className='border w-full h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
              placeholder='Your Email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
            <label htmlFor="password" className='font-semibold'>Password</label> {/* ✅ fixed "Name" to "Password" */}
            <input
              id='password'
              type={show ? "text" : 'password'}
              className='border w-full h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
              placeholder='Your password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {!show && (
              <IoEyeOutline
                className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[20%]'
                onClick={() => setShow(prev => !prev)}
              />
            )}
            {show && (
              <IoEye
                className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[20%]'
                onClick={() => setShow(prev => !prev)}
              />
            )}
          </div>

          <button
            className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[10px]'
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? <ClipLoader size={20} color='white' /> : "Login"}
          </button>

          <span className='text-[13px] cursor-pointer text-[#585757]' onClick={()=>navigate("/forget")}>Forgot password?</span>

          <div className='w-[80%] flex items-center gap-2'>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
            <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center'>or continue</div>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
          </div>

          <div className='w-[80%] h-[40px] border border-black rounded-[10px] flex items-center justify-center gap-2' onClick={googleLogin}>
            <img src={google} alt="Google" className='w-[18px]' />
            <span className='text-[18px] text-gray-500'>Google</span> {/* ✅ fixed typo "oogle" */}
          </div>

          <p className='flex gap-[10px]'>
            You don't have an account?
            <span
              className='text-[#5555f6cf] font-semibold cursor-pointer'
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Right side */}
        <div className='w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden'>
          <img src={logo} alt='Logo' className='w-30 shadow-2xl' />
        </div>
      </form>
    </div>
  );
}

export default Login;

