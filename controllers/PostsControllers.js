const Post = require("../models/post");
const { isValidObjectId } = require("mongoose");

const { NotFound } = require("http-errors");

const checkPost = async (userId, postId) => {
  if (!isValidObjectId(postId)) {
    return false;
  }

  const post = await Post.find({
    owner: userId,
    _id: postId,
  });

  if (post.length === 0) {
    return false;
  }

  return true;
};

module.exports = {
  createPost: async (req, res, next) => {
    const { user } = req;
    const newPost = { ...req.body, owner: user._id };

    const createdPost = await Post.create(newPost);

    res.status(201).json(createdPost);
  },

  getAllPosts: async (req, res, next) => {
    const allPosts = await Post.find()
      .populate("owner", " name avatarURL")
      .sort({ updatedAt: -1 });
    res.status(200).json(allPosts);
  },

  getPostsByUser: async (req, res, next) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      throw new NotFound("Not found");
    }

    const posts = await Post.find({ owner: userId })
      .populate("owner", " name avatarURL")
      .sort({ updatedAt: -1 });

    if (!posts) {
      throw new NotFound("Not found");
    }
    res.json(posts);
  },

  getById: async (req, res, next) => {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
      throw new NotFound("Not found");
    }

    const post = await Post.findById(postId).populate(
      "owner",
      " name avatarURL"
    );

    if (!post) {
      throw new NotFound("Not found");
    }
    res.json(post);
  },

  editPost: async (req, res, next) => {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    const isPostBelongToUser = await checkPost(userId, postId);

    if (!isPostBelongToUser) {
      throw new NotFound("Not found");
    }

    const editedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    }).populate("owner", "name avatarURL");

    if (!editedPost) {
      throw new NotFound("Not found");
    }
    res.status(200).json(editedPost);
  },

  deletePost: async (req, res, next) => {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    const isPostBelongToUser = await checkPost(userId, postId);

    if (!isPostBelongToUser) {
      throw new NotFound("Not found");
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      throw new NotFound("Not found");
    }

    res.status(204).json();
  },
};
