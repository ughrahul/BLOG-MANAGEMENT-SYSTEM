const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true }, //("this-is-an-example-title")
  content: { type: String, required: true },
  author: { type: ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model("Blog", blogSchema);
