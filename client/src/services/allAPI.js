
import { commonAPI } from "./commonAPI"
import { SERVER_URL } from "./serverUrl"

//register api - component register
export const registerAPI = async (reqBody)=>{
  return await commonAPI("POST",`${SERVER_URL}/register`,reqBody)
}

// login api - component signin

export const loginAPI = async (reqBody)=>{
  return await commonAPI("POST",`${SERVER_URL}/signin`,reqBody)
}

 //google oAuth
export const googleAuthAPI = async (reqBody)=>{
  return await commonAPI("POST",`${SERVER_URL}/auth/google`,reqBody)
}

//  export const googleAuthAPI = async (reqBody) => {
//   try {
//     console.log('Sending request to server...');
//     const response = await commonAPI("POST",`${SERVER_URL}/auth/google`,reqBody);
//     console.log('Received response from server:', response);
//     return response;
//   } catch (error) {
//     console.log('Error in googleAuthAPI:', error);
//     throw error;
//   }
// };

//update user

export const updateUserAPI = async (reqBody,userId, reqHeader)=>{
  //console.log(userId)
  return await commonAPI("PUT",`${SERVER_URL}/update/${userId}`,reqBody, reqHeader)
}

//delete user account
export const deleteUserAPI = async ( userId, reqHeader)=>{
  //console.log(userId)
  return await commonAPI("DELETE",`${SERVER_URL}/delete/${userId}`,{}, reqHeader)
}

//signout user
export const signOutAPI = async (reqHeader)=>{
  return await commonAPI("POST",`${SERVER_URL}/signout`,{},reqHeader)
}

//get users

export const getUsersAPI = async (reqHeader)=>{
  return await commonAPI("GET",`${SERVER_URL}/getusers`,{}, reqHeader)
}

//show more users

export const showMoreUsersAPI = async (startIndex, reqHeader) => {
  return await commonAPI("GET",`${SERVER_URL}/getusers?startIndex=${startIndex}`,{}, reqHeader);
};

//get commented users

export const getCommentedUsersAPI = async (userId) => {
  return await commonAPI("GET",`${SERVER_URL}/getuser/${userId}`,{});
};




//display posts

export const fetchPostAPI = async (postSlug) => {
  return await commonAPI("GET",`${SERVER_URL}/getposts?slug=${postSlug}`);
};

//create a post - admin

export const createPostAPI = async (reqBody, reqHeader)=>{
  return await commonAPI("POST",`${SERVER_URL}/createpost`,reqBody, reqHeader)
}
//get posts - home

export const getPostsNineAPI = async ()=>{
  return await commonAPI("GET",`${SERVER_URL}/getposts`,{})
}

//get posts - admin

export const getPostsAPI = async (userId,reqHeader)=>{
  return await commonAPI("GET",`${SERVER_URL}/getposts?userId=${userId}`,{}, reqHeader)
}

//get post - show more posts
export const ShowMorePostsAPI = async (userId, startIndex)=>{
  return await commonAPI("GET",`${SERVER_URL}/getposts?userId=${userId}&startIndex= ${startIndex}`,{})
}

//delete post
export const deletePostAPI = async (postId, userId, reqHeader)=>{
  //console.log(postId);
  //console.log(userId);
  return await commonAPI("DELETE",`${SERVER_URL}/deletepost/${postId}/${userId}`,{}, reqHeader)
}

//get post to edit

export const getPostToEditAPI = async (postId) => {
  return await commonAPI("GET",`${SERVER_URL}/getposts?postId=${postId}`,{})
}

//edit post
export const updatePostAPI = async (postId,userId, reqBody, reqHeader) => {
  return await commonAPI("PUT",`${SERVER_URL}/updatepost/${postId}/${userId}`, reqBody, reqHeader)
}

//get recent posts

export const getRecentPostsAPI = async () => {
  return await commonAPI("GET",`${SERVER_URL}/getposts?limit=3`,{})
}

//get popular posts

export const getPopularPostsAPI = async () => {
  return await commonAPI("GET",`${SERVER_URL}/getPopularPosts`,{})
}




//comments

// create comment
export const createCommentAPI = async (reqBody, reqHeader) => {
  return await commonAPI("POST", `${SERVER_URL}/createcomment`, reqBody, reqHeader);
};


//get post comments
export const getPostCommentsAPI = async(postId)=>{
  return await commonAPI("GET", `${SERVER_URL}/getpostcomments/${postId}`,{})
}

//get all comments

export const getAllCommentsAPI = async (reqHeader) => {
  return await commonAPI("GET", `${SERVER_URL}/getAllComments`, {}, reqHeader);
};

//delete comment - admin only

export const deleteCommentAPI = async (commentId, reqHeader) => {
  return await commonAPI("DELETE", `${SERVER_URL}/deletecomment/${commentId}`, {}, reqHeader);
};

//show more comments - dashboard

export const showMoreCommentAPI = async (startIndex, reqHeader) => {
  return await commonAPI("GET", `${SERVER_URL}/getAllComments?startIndex=${startIndex}`, {}, reqHeader);
};



