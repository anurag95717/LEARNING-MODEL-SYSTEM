import React, { useState } from 'react';
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { FaSpinner } from "react-icons/fa6"; // Use spinner instead of Clipboard
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utlas/firebase';

function SignUp() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSignup = async (e) => {
    e.preventDefault(); // Properly prevent default form submission
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      toast.success("Signup Successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const googleSignUp = async () =>{
    try {
        const response = await signInWithPopup(auth,provider)
        let user = response.user
        let name = user.displayName
        let email = user.email
        const result = await axios.post(serverUrl + "/api/auth/googleauth",{name,email,role},{withCredentials:true})

        dispatch(setUserData(result.data))
        navigate("/");
        toast.success("Signup Successful");
    } catch (error) {
        console.log(error)
        toast.error("Signup failed. Please try again.");
    }
  }

  return (
    <div className='bg-[#dddbdb] w-full h-screen flex items-center justify-center'>
      <form
        className='w-[90%] md:w-200 h-150 bg-white shadow-xl rounded-2xl flex'
        onSubmit={handleSignup}
      >
        {/* left div */}
        <div className='md:w-[50%] w-full h-full flex flex-col items-center justify-center gap-3'>
          <div>
            <h1 className='font-semibold text-black text-2xl'>Let's get started</h1>
            <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
          </div>

          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor="name" className='font-semibold'>Name</label>
            <input
              id='name'
              type="text"
              className='w-full h-[35px] border border-[#e7e6e6] text-[15px] px-[20px]'
              placeholder='Your name'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input
              id='email'
              type="email"
              className='w-full h-[35px] border border-[#e7e6e6] text-[15px] px-[20px]'
              placeholder='Your Email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
            <label htmlFor="password" className='font-semibold'>Password</label>
            <input
              id='password'
              type={show ? "text" : "password"}
              className='w-full h-[35px] border border-[#e7e6e6] text-[15px] px-[20px]'
              placeholder='Your password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {show ? (
              <IoEye className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[25%]' onClick={() => setShow(false)} />
            ) : (
              <IoEyeOutline className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[25%]' onClick={() => setShow(true)} />
            )}
          </div>

          <div className='flex md:w-[50%] w-[70%] items-center justify-center gap-4'>
            <span
              className={`px-[10px] py-[5px] border rounded-2xl cursor-pointer ${role === "student" ? "border-black" : "border-gray-400"}`}
              onClick={() => setRole("student")}
            >
              Student
            </span>
            <span
              className={`px-[10px] py-[5px] border rounded-2xl cursor-pointer ${role === "educator" ? "border-black" : "border-gray-400"}`}
              onClick={() => setRole("educator")}
            >
              Educator
            </span>
          </div>

          <button
            type="submit"
            className='w-[80%] h-[40px] bg-black text-white flex items-center justify-center rounded-[10px] disabled:opacity-50'
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
          </button>

          <div className='w-[80%] flex items-center gap-2'>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
            <div className='w-[50%] text-[15px] text-[#6f6f6f] text-center'>or continue</div>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
          </div>

          <div className='w-[80%] h-[40px] border border-black rounded-[10px] flex items-center justify-center gap-2' onClick={googleSignUp}>
            <img src={google} alt="Google" className='w-[18px]' />
            <span className='text-[18px] text-gray-500'>oogle</span>
          </div>

          <p className='text-sm'>
            Already have an account?
            <span
              className='text-blue-600 font-semibold cursor-pointer ml-2'
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>

        {/* right div */}
        <div className='w-[50%] h-full rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden'>
          <img src={logo} alt='Logo' className='w-30 shadow-2xl' />
        </div>
      </form>
    </div>
  );
}

export default SignUp;


