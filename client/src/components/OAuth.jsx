import { Button } from 'flowbite-react'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from '../firebase';
import { googleAuthAPI } from '../services/allAPI';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/Slices/userSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {

  const auth = getAuth(app)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({prompt: 'select_account'});

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      //console.log(resultsFromGoogle);
      //console.log(resultsFromGoogle.user);
      const res = await googleAuthAPI({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
      });
      if (res.status === 200){
          dispatch(signInSuccess(res.data));
          navigate('/');
          console.log(res.data.token)
          sessionStorage.setItem('token', res.data.token);
      }
  } catch (error) {
      console.log(error);
  }
}
  
  return (
    <>
    <Button type='button' outline className='btn bg-rose-600'  onClick={handleGoogle}>
    <FcGoogle className='w-6 h-6 mr-2' />
    Continue with Google
    </Button>
    </>
  )
}

export default OAuth