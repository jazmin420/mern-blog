import React from 'react'
import { Dropdown, Navbar, TextInput, Avatar } from "flowbite-react";
import { HiOutlineSearch } from "react-icons/hi";
import { Button } from "flowbite-react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/Slices/themeSlice';
import { signOutSuccess } from '../../redux/Slices/userSlice';
import { signOutAPI } from '../services/allAPI';


function Header() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const location = useLocation().pathname;

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
    <Navbar fluid rounded className='border-b-2'>
      <Navbar.Brand href="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white text-black  '>
      <span className='font-Rubik'>Weaving</span>
        <span className="px-2 py-1 bg-rose-600 rounded-lg text-black font-creepster dark:text-white">Threads</span>
      </Navbar.Brand>
      <form action="">
      <TextInput id="email1" type="text" placeholder="Search...." rightIcon={HiOutlineSearch} className='hidden lg:inline'/>
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <HiOutlineSearch/>
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={()=>dispatch(toggleTheme())}>
          {theme === 'light' ? <FaSun/> :  <FaMoon/> }
          </Button>

          {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button className='bg-rose-600 btn' outline>
              Sign In
            </Button>
          </Link>
        )}
      <Navbar.Toggle/>
      </div>
      <Navbar.Collapse>
        {/* nav link for styling, link is for navigation */}
        <Navbar.Link active={location === "/"} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={location === "/about"} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={location === "/projects"} as={'div'}>
          <Link to='/projects'>Blogs</Link>

          </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    </>
  )
}

export default Header