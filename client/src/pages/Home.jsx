import React, { useEffect, useState } from 'react'
import CarouselPost from '../components/CarouselPost'
import womanImg from'../assets/woman.png'
import NewsLetter from '../components/NewsLetter'
import { getPostsNineAPI } from '../services/allAPI'
import PostCard from '../components/PostCard'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'

function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
        const result = await getPostsNineAPI()
        //console.log(result)
        const data = await result.data;
        //console.log(data)
        //console.log(result.data)
        if (result.status === 200) {
          setPosts(data.posts);
    };
  }
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex items-center sm:flex-col md:flex-row justify-center min-h-screen p-4 border-b border-rose-600">
      <div className='w-1/2'>
        <h1 className="text-4xl font-bold text-rose-600">Welcome to My Blog</h1>
        <p className="text-lg">
          This is a space where I share my thoughts, experiences, and knowledge. I hope you find the content interesting and helpful.Check out my <a href="https://www.weavingthreads.in" className="text-rose-600 hover:underline">Weaving Threads</a> blog for more.
        </p>
        <Button className='bg-rose-600 mt-3 hover:underline btn'><Link to = {'/projects'}>Start To Explore</Link></Button>
      </div>
      <img className="w-1/2" src={womanImg} alt="Blog logo" />
    </div>
    <CarouselPost/>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center text-rose-600'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/projects'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all
            </Link>
          </div>
        )}
      </div>


      <div className='border border-rose-600'><NewsLetter/></div>

    </div>



  )
}

export default Home