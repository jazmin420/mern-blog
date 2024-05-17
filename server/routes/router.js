const express = require('express');
const { signup, signin, googleAuth } = require('../controllers/authController');
const { test,updateUser, deleteUser, signOut, getUsers, getUser } = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const {checkBlacklist} = require('../middleware/blacklistMiddleware');
const { createPost, getPosts, deletePost, updatePost, getRandomPosts, getPopularPosts } = require('../controllers/postController');
const { createComment, getPostComments, getAllComments, deleteComments } = require('../controllers/commentController');

const router = express.Router();


//test api routes
router.get('/test', test);

//authentication
router.post('/register', signup);
router.post('/signin', signin);
router.post('/auth/google', googleAuth);

//user info update route
router.put('/update/:userId',jwtMiddleware, updateUser)

//delete user account
router.delete('/delete/:userId', jwtMiddleware, deleteUser)

//signout user
router.post('/signout', checkBlacklist, signOut);

//get users - admin only
router.get('/getusers', jwtMiddleware, getUsers)

//get user 
router.get('/getuser/:userId', getUser)



            // Post
//create a post - admin
router.post('/createpost', jwtMiddleware,  createPost)

//get posts
router.get('/getposts', getPosts);

//delete post
router.delete('/deletepost/:postId/:userId', jwtMiddleware, deletePost)

//update post
router.put('/updatepost/:postId/:userId', jwtMiddleware,updatePost)

//get random posts
router.get('/getpopularposts', getPopularPosts)


                // comment
//comment create
router.post('/createcomment', jwtMiddleware, createComment)

//get comments
router.get('/getPostComments/:postId', getPostComments)

//get all comments - admin dashboard
router.get('/getAllComments', jwtMiddleware, getAllComments)

//delete comment - admin dashboard
router.delete('/deleteComment/:commentId', jwtMiddleware, deleteComments)





module.exports = router;