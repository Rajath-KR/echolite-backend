import mongoose from 'mongoose';

const profileDetSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },

  username: {
    type: String,
  },

  mobilenumber: {
    type: String,
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
  },
  dateofbirth: {
    type: String,
  },
  location: {
    type: String,
  },
  profileImg: {
    type: String,
  },
});

const ProfileDetails = mongoose.model('ProductList', profileDetSchema);

export default ProfileDetails;
