import express from 'express';
const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // TODO: Get user from database using JWT token
    // const user = await User.findById(req.user.userId);
    
    res.json({
      success: true,
      user: {
        id: 'demo-user',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // TODO: Update user in database
    // const user = await User.findByIdAndUpdate(
    //   req.user.userId,
    //   { name, email },
    //   { new: true }
    // );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: 'demo-user',
        name: name || 'Demo User',
        email: email || 'demo@example.com'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

export default router; 