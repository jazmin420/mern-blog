import React, { useEffect, useState } from 'react'
import { getPostsNineAPI } from '../services/allAPI';
import { Link } from 'react-router-dom';

function Projects() {
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
    <>
      <div className='flex flex-wrap'>
  {posts.map((post) => (
    <div className='group relative w-full border border-rose-600 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all m-4'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full  object-cover
          group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  ))}
</div>

    </>
  )
}  

export default Projects