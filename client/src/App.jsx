import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Projects from './pages/Projects'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Post from './pages/Post'
import UpdatePost from './pages/UpdatePost'
import ShowPost from './pages/ShowPost'
import ScrollTop from './components/ScrollTop'

function App() {

  return (
    <>
    <BrowserRouter>
    <ScrollTop/>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminRoute/>}>
        <Route path="/createpost" element={<Post />} />
        <Route path="/updatepost/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path='/post/:postSlug' element={<ShowPost />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
