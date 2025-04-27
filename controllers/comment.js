import Comment from '../models/commentmodal.js';

export const addComment = async (req, res) => {
  const { postId, userId, text } = req.body;
  
  if (!postId || !userId || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    const newComment = new Comment({
      postId,
      userId,
      text
    });
    
    const savedComment = await newComment.save();
    
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('userId', 'username profileImg fullname');
    
    res.status(201).json({ 
      message: 'Comment added successfully', 
      data: populatedComment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  
  try {
    const comments = await Comment.find({ postId })
      .populate('userId', 'username profileImg fullname')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};