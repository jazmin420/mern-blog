import React from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { createPostAPI } from '../services/allAPI';


function Post() {

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  //console.log(formData);

  //async upload to be cmpltd on fb
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      //if there is
      setImageUploadError(null);
      //fb storage
      const storage = getStorage(app);
      //img name
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      //process of uploading
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //fix decimal to 0
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        //url
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            //saving url to formdata
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token")
    if(token){
    const reqHeader ={
      "Authorization" : `Bearer ${token}`
    }
    try {
      const result = await createPostAPI(formData, reqHeader);
      console.log(result);
      const data = await result.data;
      //console.log(data)
      //console.log(result.data)
      if( data.success === false ){
        return setPublishError(data.message);
      }
      
      if(result.status === 200){
        setPublishError(null);
        //console.log('Navigating to:', `/post/${data.slug}`);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setPublishError('Something went wrong');
    }
  }
  };


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create Your post</h1>
      <form className='flex flex-col gap-4' 
      onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='fashion'>Fashion</option>
            <option value='lifestyle'>Lifestyle</option>
            <option value='health'>Health</option>
            <option value='creativity'>Creativity</option>
            <option value='art'>Art</option>
            <option value='travel'>Travel</option>
            <option value='recipes'>Recipes</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-2 border-rose-500 p-3'>
          <FileInput
            type='file'
            accept='image/*'
            //to get first img, choose one img [0]
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            className='btn bg-rose-600'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                {/* showing progressof img upload */}
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {/* display img after upload */}
        {imageUploadError && 
        <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          //instead of e , value here
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' className='bg-rose-600 btn'>
          Publish Your Post
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  )
}

export default Post