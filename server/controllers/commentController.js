const Comment  = require("../models/commentModel");
const { errorHandler } = require("../utilities/error");
const mongoose = require("mongoose");

exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    // console.log(userId)
    // console.log(req.payload)
    // console.log(req.body)

    if (userId !== req.payload) {
      return next(
        errorHandler(403, 'You are not allowed to create this comment')
      );
    }

    const newComment = new Comment({
      content,
      userId,
      postId: postId,
      postObjectId: mongoose.Types.ObjectId.createFromHexString(postId)
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
}


//get post comments
exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

//get all comments
exports.getAllComments = async (req, res, next) => {
    if (req.isAdmin === false)
      return next(errorHandler(403, 'You are not allowed to get all comments(Admin Only'));
    try {
      //index for pagination
      const startIndex = parseInt(req.query.startIndex) || 0;
      //limit of comments to see
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
      const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalComments = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthComments = await Comment.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
      next(error);
    }
  };


//delete comments - admin

exports.deleteComments = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (req.isAdmin === false) {
      return next(
        errorHandler(403, 'You are not allowed to delete this comment')
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
  };
