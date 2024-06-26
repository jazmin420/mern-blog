import React from 'react'
import { Sidebar } from 'flowbite-react';
import {HiUser,HiArrowSmRight,
 HiDocumentText,HiOutlineUserGroup,HiAnnotation,HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signOutSuccess } from '../../redux/Slices/userSlice';
import { signOutAPI } from '../services/allAPI';
import { IoIosCreate } from "react-icons/io";

function SidebarDash() {

  const dispatch = useDispatch();
  const location = useLocation();
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
<Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {/* {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )} */}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={
              currentUser.isAdmin ? 'Admin' :
               'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
          <Link to='/createpost'>
                 <Sidebar.Item
                   active={tab === 'Create Post'}
                   icon={IoIosCreate }
                   as='div'
                 >
                  Create Post
                 </Sidebar.Item>
               </Link>
          )}

           {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

           {currentUser.isAdmin && (
             <>
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Users
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=comments'>
                 <Sidebar.Item
                   active={tab === 'comments'}
                   icon={HiAnnotation}
                   as='div'
                 >
                   Comments
                 </Sidebar.Item>
               </Link>

             </>
           )} 
          <Sidebar.Item
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </>
  )
}

export default SidebarDash