import React, { useState } from "react";
import signUpImg from "../assets/signUpImg.svg";
import { Label, TextInput } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../services/allAPI";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OAuth from "../components/OAuth";

function Register() {
  
  //event binding to inputs
  const [ formData, setFormData ] = useState({});
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e) => {
   setFormData({...formData, [e.target.id]: e.target.value.trim()});
  }
  //console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if( !formData.username || !formData.email || !formData.password ){
      return setErrorMessage('please fill out all the fields!!');
    }
    //send form data
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await registerAPI(formData);
      //console.log(result);
      const data = await result.data;
      //console.log('Data:', data)
      if( data.success === false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(result.status===200){
        toast.warning(`Welcome ${result.data.username}... Please Login to explore our website!!!`)
        setTimeout(() => {
          navigate('/signin')
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen mt-20">
        <h3 className="text-center font-semibold text-2xl">Sign Up for your account</h3>
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <img src={signUpImg} alt="" width={400} height={400} />
          </div>
          <div className="flex-1">
            <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate >
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Your Username" />
                </div>
                <TextInput
                  id="username"
                  placeholder="Bonnie Green"
                  icon={FaRegUser}
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2  block">
                  <Label htmlFor="email" value="Your email" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  icon={HiMail}
                  placeholder="name@flowbite.com"
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
                  placeholder="12345678"
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
                ) : 'Sign Up'
              }
                </Button>
                <OAuth/>
            </form>
            <div className="flex gap-2 text-sm mt-4">
              <span>Already have an account?</span>
              <Link to="/signin" className="text-green-500">
                Sign In
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

export default Register;
