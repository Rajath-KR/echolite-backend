import mongoose from 'mongoose';

const postDetSchema = new mongoose.Schema({
  desc: {
    type: String,
  },
  location: {
    type: String,
  },
  postImg: {
    type: String,
  },
});

const PostDetails = mongoose.model('PostLists', postDetSchema);

export default PostDetails;
