import PostDetails from '../models/PostDetModal.js';

export async function handlePostDet(req, res) {
  const { desc, location } = req.body;
  const postImg = req.file ? req.file.filename : null;

  try {
    const data = {
      desc,
      location,
      postImg,
    };

    const postInfo = await PostDetails.create(data);
    if (postInfo) {
      res
        .status(201)
        .send({ message: 'Post created successfully', data: postInfo });
    } else {
      res.status(400).send({ message: 'Post creation failed' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function handlePostDetGet(req, res) {
  try {
    const postInfo = await PostDetails.find({});
    res.send({ data: postInfo });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: 'Error fetching posts' });
  }
}
