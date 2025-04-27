import User from '../models/userModal.js';
import Follow from '../models/followModal.js';
import PostDetails from '../models/PostDetModal.js';

const authMiddleware = async (req, res, next) => {
  const userId = req.body.currentUserId || req.query.currentUserId; 
  if (!userId) {
    return res.status(401).send({ message: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

export async function followUser(req, res) {
  const { userId } = req.params;
  const followerId = req.body.followerId;

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(userId);

    if (!follower || !following) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (followerId === userId) {
      return res.status(400).send({ message: 'Cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId
    });

    if (existingFollow) {
      return res.status(400).send({ message: 'Already following this user' });
    }

    await Follow.create({
      follower: followerId,
      following: userId
    });

    await User.findByIdAndUpdate(followerId, {
      $push: { following: userId }
    });
    await User.findByIdAndUpdate(userId, {
      $push: { followers: followerId }
    });

    res.status(200).send({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
}

export async function unfollowUser(req, res) {
  const { userId } = req.params;
  const followerId = req.body.followerId;

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(userId);

    if (!follower || !following) {
      return res.status(404).send({ message: 'User not found' });
    }

    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: userId
    });

    if (!follow) {
      return res.status(400).send({ message: 'Not following this user' });
    }

    await User.findByIdAndUpdate(followerId, {
      $pull: { following: userId }
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: followerId }
    });

    res.status(200).send({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
}

export async function getUserProfile(req, res) {
  const { username } = req.params;
  const currentUserId = req.query.currentUserId; 

  try {
    const user = await User.findOne({ username })
      .populate('followers', 'username')
      .populate('following', 'username')
      .populate('profile');

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const posts = await PostDetails.find({ username }).sort({ createdAt: -1 });

    const isFollowing = currentUserId
      ? await Follow.exists({ follower: currentUserId, following: user._id })
      : false;

    res.status(200).send({
      user: {
        _id: user._id,
        username: user.username,
        followers: user.followers,
        following: user.following,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        profile: user.profile
      },
      posts,
      isFollowing
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
}

export { authMiddleware };