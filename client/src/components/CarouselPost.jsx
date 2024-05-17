import React, { useEffect, useState } from 'react'
import { Carousel } from "flowbite-react";
import { getPopularPostsAPI } from '../services/allAPI';

function CarouselPost() {

  const [posts, setPosts] = useState([]);
  console.log(posts)

  useEffect(() => {
    //fetch poular posts
   try {
    const fetchPopularPost = async () =>{
      const response = await getPopularPostsAPI();
      console.log(response)
      const data = await response.data;
      //console.log(data)
      if (response.status === 200) {
        setPosts(data);
      }
    }
    fetchPopularPost();
   } catch (error) {
    console.log(error);
   }
  }, []);

  return (
    <>
   <div className="h-60 sm:h-64 xl:h-80 2xl:h-120 mx-auto sm:w-3/4 mt-10 mb-20">
   <h1 className='text-center font-semibold text-xl mt-8 mb-4 text-rose-600'>Most Popular Blogs</h1>
  <Carousel slideInterval={2000}>
    {posts && posts.map((post, index) => (
      <div key={index} className="relative aspect-w-16 aspect-h-9">
        <img src={post.image} alt={post.title} className="h-[400px] w-full  object-cover" />
        <div className="absolute bottom-8 left-0 bg-black bg-opacity-20 text-white p-3 w-full">
          <h2 className="font-bold sm:text-2xl lg:text-4xl line-clamp-2">{post.title}</h2>
          <p className='text-sm text-gray-400'>{new Date(post.datePosted).toLocaleDateString()}</p>
          <p className='text-sm text-green-200 italic'>{post.category}</p>
        </div>
      </div>
    ))}
  </Carousel>
</div>

    </>
  )
}

export default CarouselPost