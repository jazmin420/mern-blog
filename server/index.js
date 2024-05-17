require('dotenv').config()
const express = require('express');
const router = require('./routes/router')
const cors = require('cors')

require('./connection')

// create express appn
const blogserver = express();

blogserver.use(cors());

blogserver.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

//allow json as input of backend
blogserver.use(express.json());


blogserver.use(router);

const PORT = process.env.PORT || 3000;


blogserver.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})

blogserver.get("/",(req,res)=>{
  res.status(200).send(`Server Started and waiting for client request!!!`)
})

//error handling middleware
blogserver.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error';
  res.status(statusCode).json({
     success : false,
     statusCode,
     message
    });
}
)