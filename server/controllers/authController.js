const User = require("../models/userModel");
//secure pasword
const bcryptjs = require('bcryptjs');
const { errorHandler } = require("../utilities/error");
const jwt = require('jsonwebtoken');

//create signup async function(take some time to wait)
exports.signup = async(req,res, next) => {
  //console.log(req.body);
  const { username, email, password } = req.body;

  if ( !username || !email || !password || username === '' || email === '' || password === '') {
    // return res.status(400).json({ error: 'Please add all the fields' });
    next(errorHandler(400, "Please add all the fields"))
  }

  const hashedpassword = bcryptjs.hashSync(password, 10)

  //create user
  const newUser = new User({
    username,
    email,
    password: hashedpassword,
  })

  try {
    //save user to db
    await newUser.save();
    //res.json("Registered Successfully")
    res.status(200).json(newUser)
  } catch (error) {
    next(error);
    
  }
 
}

//create signin
exports.signin = async(req, res, next) => {9
  const { email, password } = req.body;
  //console.log(email,password)

  if(!email || !password || email === '' || password === ''){
    next(errorHandler(400, 'All fields are required!!'))
  }

  try {
    //check email and password
    const validUser = await User.findOne({ email})
    if (!validUser) {
      return next(errorHandler(401, 'User not found!!'))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(401, 'Invalid Password!!'))
    }

    //encryption
    const token = jwt.sign({ _id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET_KEY)

    //excluding password from sending to client, _doc- mongoose built in property of raw data
    const {password: pass, ...rest} = validUser._doc

    // res.status(200).cookie('access_token', token,{
    //   httpOnly: true,
    // }).json(rest)

    res.status(200).json({ token, ...rest });

  } catch (error) {
    next(error)
   }

}

//google authorization
exports.googleAuth = async(req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email});
    if(user) {
      const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET_KEY)
      const {password, ...rest} =user._doc
      // res.status(200).cookie('access_token', token,{
      //   //to make it secure
      //   httpOnly: true,
      //   sameSite: 'none',
      //   //secure: true,
      // }).json(rest)

      res.status(200).json({ token, ...rest });
     } 
    else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      // const token = jwt.sign(
      //   { id: newUser._id },
      //   process.env.JWT_SECRET_KEY
      // );
      // const { password, ...rest } = newUser._doc;
      // res
      //   .status(200)
      //   .cookie('access_token', token, {
      //     httpOnly: true,
      //     sameSite: 'none',
      // //secure: true,
      //   })
      //   .json(rest);

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password, ...rest } = newUser._doc;
      res.status(200).json({ token, ...rest });      
    }
  } catch (error) {
    next(error);
  }
}