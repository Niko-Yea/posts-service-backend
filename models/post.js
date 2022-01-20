const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.SchemaTypes;

const PostSchema = new Schema(
  {
    title: {
      type: "string",
      required: true,
    },
    lead: {
      type: "string",
      required: true,
    },
    body: {
      type: "string",
      required: true,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
