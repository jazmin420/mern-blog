import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Button, Checkbox, Label, TextInput, Alert, Modal } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess,signOutSuccess } from '../../redux/Slices/userSlice';
import { deleteUserAPI, signOutAPI, updateUserAPI } from '../services/allAPI';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {Link} from 'react-router-dom';

function ProfileDash() {
  const { currentUser, error, loading} = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadingFileProgress, setUploadingFileProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  //console.log(uploadingFileProgress, imageFileUploadError)
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0 ]
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }
  //console.log(imageFile, imageFileUrl)
  useEffect(() => {
    if(imageFile) {
      uploadImage()
    }
  }, [imageFile])

    //   service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

  const uploadImage = async ()=>{
    //console.log(('uploading image...'));
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    //storage from firebase
    const storageRef = ref(storage, fileName)
    //upload your img not url
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      //info getting while uploading bytes by bytes
       (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadingFileProgress(progress.toFixed(0));
      },
      (error) =>{
        setImageFileUploadError('could not upload image');
        setUploadingFileProgress(null);
        setImageFileUrl(null)
        setImageFile(null)
        setImageFileUploading(false)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
          //console.log(downloadURL);
          setImageFileUrl(downloadURL);
          //add url to formdata state
          setFormData({
           ...formData,
            profilePicture: downloadURL
          });
          setImageFileUploading(false);
        })
      }
  )
}

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.id]: e.target.value });
};
//console.log(formData)

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setUpdateUserError(null);
//   setUpdateUserSuccess(null);
//   if (Object.keys(formData).length === 0) {
//     setUpdateUserError('No changes made');
//     return;
//   }
//   if (imageFileUploading) {
//     setUpdateUserError('Please wait for image to upload');
//     return;
//   }
//   try {
//     dispatch(updateStart());
//     const res = await fetch(`http://localhost:3000/update/${currentUser._id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     });
//     const data = await res.json();
//     if (!res.ok) {
//       dispatch(updateFailure(data.message));
//       setUpdateUserError(data.message);
//     } else {
//       dispatch(updateSuccess(data));
//       setUpdateUserSuccess("User's profile updated successfully");
//     }
//   } catch (error) {
//     dispatch(updateFailure(error.message));
//     setUpdateUserError(error.message);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setUpdateUserError(null);
  setUpdateUserSuccess(null);
  //if empty form data
  if (Object.keys(formData).length === 0) {
    setUpdateUserError('No changes made');
    return;
  }
  if (imageFileUploading) {
    setUpdateUserError('Please wait for image to upload');
    return;
  }
  const token = sessionStorage.getItem("token")
  if(token){
    const reqHeader ={
      "Authorization" : `Bearer ${token}`
    }

    try {
      dispatch(updateStart());
      const res = await updateUserAPI(formData, currentUser._id, reqHeader);
      if (res.status !== 200) {
        dispatch(updateFailure(res.data.message));
        setUpdateUserError(res.data.message);
      } else {
        dispatch(updateSuccess(res.data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  }

  const handleDeleteUser = async () => {
    setOpenModal(false);
    const token = sessionStorage.getItem("token")
    if(token){
    const reqHeader ={
      "Authorization" : `Bearer ${token}`
    }
    //console.log(reqHeader);
    try {
      dispatch(deleteUserStart());
      //console.log(currentUser._id)
      const res = await deleteUserAPI(currentUser._id, reqHeader);
      if (res.status !== 200) {
        dispatch(deleteUserFailure(res.data.message));
      } else {
        dispatch(deleteUserSuccess(res.data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
  };

  const handleSignOut = async () => {

    const token = sessionStorage.getItem("token")
    if(token){
    const reqHeader ={
      "Authorization" : `Bearer ${token}`
    }

    try {
      const res = await signOutAPI(reqHeader);
      if (res.status !== 200) {
        console.log(res.data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
  
  
  return (
  <>
  <div className='max-w-lg mx-auto p-3 w-full'>
    <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
    <form
    onSubmit={handleSubmit}
    className='flex flex-col gap-4'>
      <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
      <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
      {uploadingFileProgress && (
            <CircularProgressbar
              value={uploadingFileProgress || 0}
              text={`${uploadingFileProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    uploadingFileProgress / 100
                  })`,
                },
              }}
            />
          )}
      <img src={imageFileUrl  || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${uploadingFileProgress && uploadingFileProgress < 100 &&
              'opacity-60' }`} />
      </div>
      {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )} 
      <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
      <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
      <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
      <Button type='submit' className='bg-rose-600 btn' outline disabled= {loading || imageFileUploading}>
        Update
      </Button>
      {currentUser.isAdmin && (
          <Link to={'/createpost'}>
            <Button
              type='button'
              className='w-full btn bg-rose-600'
              
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={() => setOpenModal(true)}>Delete your account</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
        {updateUserSuccess && (
          <Alert color='success' className='mt-5'>
          {updateUserSuccess}
          </Alert>
        )
        } 
        {updateUserError && (
          <Alert color='failure' className='mt-5'>
          {updateUserError}
          </Alert>
        )
        }
        {error && (
          <Alert color='failure' className='mt-5'>
          {error}
          </Alert>
        )
        }
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

  </div>
  </>
  )
}


export default ProfileDash