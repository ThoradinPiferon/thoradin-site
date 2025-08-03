import express from 'express';
const router = express.Router();

// Get sample data
router.get('/sample', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'Hello from the backend!',
        timestamp: new Date().toISOString(),
        items: [
          { id: 1, name: 'Item 1', description: 'First item' },
          { id: 2, name: 'Item 2', description: 'Second item' },
          { id: 3, name: 'Item 3', description: 'Third item' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data'
    });
  }
});

// Create new data item
router.post('/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // TODO: Save to database
    // const item = new Item({ name, description });
    // await item.save();
    
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item: {
        id: Date.now(),
        name,
        description,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create item'
    });
  }
});

// Get all items
router.get('/items', async (req, res) => {
  try {
    // TODO: Get from database
    // const items = await Item.find();
    
    res.json({
      success: true,
      items: [
        { id: 1, name: 'Item 1', description: 'First item' },
        { id: 2, name: 'Item 2', description: 'Second item' },
        { id: 3, name: 'Item 3', description: 'Third item' }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items'
    });
  }
});

export default router; 