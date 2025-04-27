import User from '../models/userModal.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });

  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: 'User create successfully', data: newUser });
  } catch (error) {
    return res.status(500).send({ message: 'Server error' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).send({ message: 'Email not found' });
    }

    if (validUser.password !== password) {
      return res.status(401).send({ message: 'Incorrect password' });
    }

    return res.status(200).send({
      message: 'Login Successfully',
      token: 'mock_token_value',
    });
  } catch (error) {
    return res.status(500).send({ message: 'Server error' });
  }
};
