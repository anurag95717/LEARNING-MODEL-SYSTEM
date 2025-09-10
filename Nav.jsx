import React, { use, useState } from 'react'
import { FaCircleUser } from "react-icons/fa6";
import logo from '../assets/logo.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { RxCross2 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";
import { toast } from 'react-toastify';

function Nav() {
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [show,setShow] = useState(false)
    const [showham,setShowHam] = useState(false)


    const handleLogOut = async () =>{
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout",{withCredentials:true})
            dispatch(setUserData(null))
            console.log(result.data)
            toast.success("LogOut Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.massage)
            
        }
    }
  return (
    <div className='w-[100vw] h-[70px] bg-[#ecfafaec] z-10 fixed
    top-0 flex items-center justify-between px-[20px] shadow-md shadow-black'>
        <div className='lg:w-[20%] w-[40%] lg:pl-[50px]'>
            <img src={logo} alt="" className='w-[60px] rounded-[5px] border-2 border-white cursor-pointer' />

        </div>
        <div className='w-[30%] lg:flex items-center justify-center gap-4 hidden'>
            {!userData && <FaCircleUser className='w-[50px] h-[50px] fill-black cursor-pointer' onClick={()=>setShow(prev=>!prev)}/>}
            {userData?.photoUrl ? <img src={userData?.photoUrl} className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer'/>:
            <div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer' onClick={()=>setShow(prev=>!prev)}>
                {userData?.name?.slice(0,1).toUpperCase()}
            </div>}
           {userData?.rol === " educator" && <div className='px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white bg-[black] rounded-[10px] text-[18px] font-light cursor-pointer' onClick={()=>navigate("/dashboard")}>Dashboard</div>}
           {!userData ? <span className='px-[20px] py-[10px] border-2 border-white  text-white  rounded-[10px] text-[18px] font-light cursor-pointer bg-[black]'onClick={()=>navigate("/login")}>Login</span>:
           <span className='px-[20px] py-[10px] border-2 border-white  text-black  rounded-[10px] shadow-sm shadow-black text-[18px]  cursor-pointer bg-[white]' onClick={handleLogOut}>LogOut</span>}
           {show && <div className='absolute top-[110%] right-[15%] flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-[2px] border-black hover:border-white hover:text-white cursor-pointer hover:bg-black'>
            <span className='bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600'onClick={()=>navigate("/profile")}>My Profile</span>
            <span className='bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600'>My Courses</span>

           </div>}
           


        </div>
        <RxHamburgerMenu className='w-[35px] h-[35px] lg:hidden text-white cursor-pointer ' onClick={()=>setShowHam(prev=>!prev)}/>
            <div className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden ${showham ? "translate-x-[0] transition duration-600":"translate-x-[-100%] transition duration-600"}`}>
                <RxCross2 className='w-[40px] h-[40px] fill-white absolute top-5 right-[4%]' onClick={()=>setShowHam(prev=>!prev)}/>
                    {!userData && <FaCircleUser className='w-[50px] h-[50px] fill-black cursor-pointer' />}
            {userData &&<div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer' >
                {userData?.name.slice(0,1).toUpperCase()}
            </div>}
            <div className='w-[200px] h-[65px] border-2 border-white  flex items-center justify-center  bg-[black] rounded-[10px] text-[18px] text-white font-light cursor-pointer' onClick={()=>navigate("/profile")}>My Profile</div>
            <div className='w-[200px] h-[65px] border-2 border-white  flex items-center justify-center  bg-[black] rounded-[10px] text-[18px] text-white font-light cursor-pointer'>My Courses</div>
            {userData?.rol === " educator" && <div className='w-[200px] h-[65px] border-2 border-white  flex items-center justify-center  bg-[black] rounded-[10px] text-[18px] text-white font-light cursor-pointer' onClick={()=>navigate("/dashboard")}>Dashboard</div>}
            {!userData ? <span className='w-[200px] h-[65px] border-2 border-white  flex items-center justify-center  bg-[black] rounded-[10px] text-[18px] text-white font-light cursor-pointer'onClick={()=>navigate("/login")}>Login</span>:
           <span className='w-[200px] h-[65px] border-2 border-white  flex items-center justify-center  bg-[black] rounded-[10px] text-[18px] text-white font-light cursor-pointer' onClick={handleLogOut}>LogOut</span>}
            </div>
      
    </div>
  )
}

export default Nav
