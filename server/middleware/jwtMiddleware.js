const jwt = require('jsonwebtoken')
const {errorHandler} = require('../utilities/error');

const jwtMiddleware = (req,res,next)=>{
    //console.log("Inside JWT Middleware!!!");
    //console.log(req.headers["authorization"])
    //get verify token
    const token = req.headers["authorization"].split(" ")[1]
    if(token){
        //console.log(token);
            //steps verify token
        try{
            const jwtResponse = jwt.verify(token, process.env.JWT_SECRET_KEY)
            //console.log(jwtResponse);
            req.payload = jwtResponse._id
            req.isAdmin = jwtResponse.isAdmin
            //req.user = {id : jwtResponse._id };
            //console.log(req.user);
             next()
            }
        catch(err){
            res.status(401).json("Authorization failed... Please login!!!")
        }

    }else{
        res.status(406).json("Please provide token")
    }
}

module.exports = jwtMiddleware