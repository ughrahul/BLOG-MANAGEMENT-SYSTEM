const Model = require("./blog.model");
const bookmarkModel = require("../bookmarks/bookmark.model");
const { slugGenerator } = require("../../utils/textParser");

//----------------create blogs--------------------//
const create = (payload) => {
  payload.slug = slugGenerator(payload.title);
  return Model.create(payload);
};

//-----------------get all blogs-----------------//
const getAll = () => {
  return blogModel.find();
};

//-----------------get id blogs-----------------//
const get = (_id) => {
  return blogModel.findById(_id);
};

//----------------edit blogs-------------------//
const updateById = (_id, payload) => {
  return blogModel.findByIdAndUpdate(_id, payload, { new: true });
};

//----------------search blogs-------------------//
//const search = () => {};

//----------------search blogs-------------------//
const removeById = (id) => {};

//----------------search blogs-------------------//
const bookMark = (payload) => {
  const { blogs, user } = payload;
  if (!blogs.length > 0 || !user) throw new Error("Blog or User missing");
  bookmarkModel.create(payload);
};

//-----------author specific blog---------------//
const authorBlogs = (userId) => {
  return blogModel.find({ author: userId });
};

module.exports = {
  create,
  getAll,
  get,
  updateById,
  // search,
  removeById,
  bookMark,
  authorBlogs,
};
