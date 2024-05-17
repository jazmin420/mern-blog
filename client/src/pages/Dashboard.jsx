import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SidebarDash from '../components/SidebarDash';
import ProfileDash from '../components/ProfileDash';
import PostsDashboard from '../components/PostsDashboard';
import UsersDashboard from '../components/UsersDashboard';
import CommentDashboard from '../components/CommentDashboard';

function Dashboard() {

  const location = useLocation();

  const [tab, setTab] = useState('');
  
  //for each time come to this page
  //work with query string of url - filter data
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    //console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  },[location.search])


  return (
  <>
<div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <SidebarDash />
      </div>
      {/* profile... */}
      {tab === 'profile' && <ProfileDash />}
      {/* posts... */}
      {tab === 'posts' && <PostsDashboard />}
      {/* users */}
      {tab === 'users' && <UsersDashboard />}
      {/* comments  */}
      {tab === 'comments' && <CommentDashboard />}
    </div>
  </>
  )
}

export default Dashboard