import axios from "axios";

//axios to make http requests
export const commonAPI = async (httpRequest,url,reqBody,reqHeader)=>{
  const reqConfig = {
      method:httpRequest,
      url,
      data:reqBody,
      headers:reqHeader?reqHeader:{ "Content-Type":"application/json" }
  }
  return await axios(reqConfig)
  .then((res) => {
    return res;
  })
  .catch((err) => {
    console.error('Error in commonAPI:', err); // This will log the error to the console
    if (err.response) {
      // If the server responded with a status code outside the range of 2xx
      return err.response;
    }
    // If a response was not received from the server
    throw err;
  });
};