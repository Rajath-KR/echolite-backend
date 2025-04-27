import ProfileDetails from '../models/profileDetailsModal.js';

export async function handleProfilePost(req, res) {
  const {
    fullname,
    username,
    mobilenumber,
    bio,
    gender,
    dateofbirth,
    location,
  } = req.body;

  const profileImg = req.file ? req.file.filename : null;

  try {
    const data = {
      fullname,
      username,
      mobilenumber,
      bio,
      gender,
      dateofbirth,
      location,
      profileImg,
    };

    const profileInfo = await ProfileDetails.create(data);
    if (profileInfo) {
      res
        .status(201)
        .send({ message: 'Profile created successfully', data: profileInfo });
    } else {
      res.status(400).send({ message: 'Profile creation failed' });
    }
  } catch (e) {
    console.error('Error creating profile:', e);
    res.status(500).send({ message: 'Server error', error: e.message });
  }
}

export async function handleProfileGet(req, res) {
  try {
    const profileInfo = await ProfileDetails.find({});
    res.status(200).send({ data: profileInfo });
  } catch (e) {
    console.error('Error fetching profiles:', e);
    res.status(500).send({ message: 'Server error', error: e.message });
  }
}

export async function handleProfileUpdate(req, res) {
  const profileId = req.params.id;
  console.log('Update request for profile ID:', profileId);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  const { removeImage, ...updateData } = req.body;

  if (req.file) {
    console.log('Setting new profile image:', req.file.filename);
    updateData.profileImg = req.file.filename;
  } else if (removeImage === 'true') {
    console.log('Removing profile image');
    updateData.profileImg = null;
  }

  console.log('Final update data:', updateData);

  try {
    const updatedProfile = await ProfileDetails.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedProfile) {
      console.log('Profile not found with ID:', profileId);
      return res.status(404).send({ message: 'Profile not found' });
    }

    console.log('Profile updated successfully:', updatedProfile);
    return res
      .status(200)
      .send({ message: 'Successfully updated', data: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res
      .status(500)
      .send({ message: 'Server error', error: error.message });
  }
}

export async function handleProfileDelete(req, res) {
  try {
    const deletedProfile = await ProfileDetails.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedProfile) {
      return res.status(404).send({ message: 'Profile not found' });
    }

    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res
      .status(500)
      .send({ message: 'Server error', error: error.message });
  }
}
