const Post = require("../models/postModel");
const { errorHandler } = require("../utilities/error");

//create post by admin
exports.createPost = async (req, res, next) => {

  //console.log(req.body)

  if (req.isAdmin === false) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    //remove anything thats not letters & numbers
    .replace(/[^a-zA-Z0-9-]/g, '');

    //creat new post
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.payload,
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
}

//get posts - for all
exports.getPosts = async (req, res, next) => {
  try {
    //display posts list
    const startIndex = parseInt(req.query.startIndex) || 0;
    //limit the number of posts
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    //create the post
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),

      // ...(req.query.searchTerm && {
        //or - search btwn two places
      //   $or: [
      //     { title: { $regex: req.query.searchTerm, $options: 'i' } },
      //     { content: { $regex: req.query.searchTerm, $options: 'i' } },
      //   ],
      // }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    //last month posts
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
}

//delete post by userid, postid
exports.deletePost = async (req, res, next) => {
  //console.log(req.params.userId)
  //console.log(req.body.isAdmin)
  //console.log(req.payload)
    if (req.isAdmin === false || req.payload !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post has been deleted');
    } catch (error) {
      next(error);
    }
  }

  exports.updatePost = async (req, res, next) => {
    console.log(req.params.postId)
  //console.log(req.body.isAdmin)
  //console.log(req.payload)
  //console.log(req.body)
      if (req.body.isAdmin === false || req.payload !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'));
      }
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.postId,
          {
            $set: {
              title: req.body.title,
              content: req.body.content,
              category: req.body.category,
              image: req.body.image,
              userId: req.body.userId
            },
          },
          //for new result
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        next(error);
      }
    };

//get popular posts - carousel
exports.getPopularPosts = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'postObjectId',
          as: 'comments'
        }
      },
      { $unwind: '$comments' },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          image: { $first: '$image' },
          category: { $first: '$category'},
          datePosted: { $first: '$createdAt' },
          numComments: { $sum: 1 },
        },
      },
      { $sort: { numComments: -1 } },
      { $limit: 3 }, // Get top 3 posts. Adjust as needed.
    ]);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
