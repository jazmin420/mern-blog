import React, { useState } from 'react'
import newsLetter from '../assets/newsletter.svg'
import { Button } from 'flowbite-react';

function NewsLetter() {

    const [email, setEmail] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      //sign up logic here
      alert(`Thank you for signing up, ${email}!`);
    };

  return (
    <>
     <div className='m-10 flex items-center justify-center gap-10 border'>
      <div className='m-0'>
        <img src={newsLetter} className='w-80 h-80' alt="" />
      </div>
      <div>
         <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold text-center">Sign Up for Newsletter</h2>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mb-4 p-2 border border-gray-400 rounded"
            required
          />
          <Button type="submit" outline className="bg-rose-600 text-white rounded btn">
            Sign Up
          </Button>
        </form>
      </div>
     </div>
    </>
  )
}

export default NewsLetter