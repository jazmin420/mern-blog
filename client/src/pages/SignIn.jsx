import React, { useState } from "react";
import loginImg from "../assets/loginImg.svg";
import { Label, TextInput } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../services/allAPI";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInStart, signInFailure, signInSuccess } from "../../redux/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

function SignIn() {
  
  //event binding to inputs
  const [ formData, setFormData ] = useState({});
  const { loading, error: errorMessage} = useSelector(state => state.user)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
   setFormData({...formData, [e.target.id]: e.target.value.trim()});
  }
  //console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if( !formData.email || !formData.password ){
      dispatch(signInFailure('Please fill out all the fields!!'))
    }
    //send form data
    dispatch(signInStart());
    try {
      const result = await loginAPI(formData);
      //console.log(result);
      const data = await result.data;
      //console.log('Data:', data)
      if( data.success === false){
        dispatch(signInFailure(data.message))
      }

      if(result.status===200){
        //store token 
        sessionStorage.setItem('token', data.token);

        toast.warning('You can start to explore our website!!!')
        dispatch(signInSuccess(data));
        setTimeout(() => {
          navigate('/')
        }, 2000);
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <img src={loginImg} alt="" width={400} height={400} />
          </div>
          <div className="flex-1">
            <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <div className="mb-2  block">
                  <Label htmlFor="email" value="Your email" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  icon={HiMail}
                  placeholder="name@gmail.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2  block">
                  <Label htmlFor="password" value="Your Password" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  icon={RiLockPasswordLine}
                  placeholder="*******"
                  required
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="bg-rose-600 btn" disabled= {loading}>
                { loading ? (
                  <>
                    <Spinner size='sm' color="success" aria-label="Success spinner example" />
                    <span className="pl-3">Loading....</span>
                  </>
                ) : 'Sign In'
              }
                </Button>
                <OAuth/>
            </form>
            <div className="flex gap-2 text-sm mt-4">
              <span>Don't have an account?</span>
              <Link to="/register" className="text-rose-600">
                Sign Up
              </Link>
            </div>
            { 
            errorMessage && (
           <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
           <span className="font-medium">Error! </span>
          {errorMessage}
          </Alert>
        ) }
          </div>
        </div>
        <ToastContainer position="top-center" theme="colored" autoClose={3000} />
      </div>
    </>
  );
}

export default SignIn;
