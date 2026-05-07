const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Get all leads (with basic filtering and search)
router.get('/', async (req, res) => {
  try {
    const { status, source, salesperson, search } = req.query;
    
    let leadsRef = db.collection('leads');
    const snapshot = await leadsRef.orderBy('createdAt', 'desc').get();
    
    let leads = [];
    snapshot.forEach(doc => {
      leads.push({ id: doc.id, ...doc.data() });
    });

    // In-memory filtering because Firestore doesn't support full-text search natively
    if (status) leads = leads.filter(l => l.status === status);
    if (source) leads = leads.filter(l => l.source === source);
    if (salesperson) leads = leads.filter(l => l.assignedTo === salesperson);
    
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l => 
        l.name?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q)
      );
    }

    res.json(leads);
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single lead
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('leads').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create lead
router.post('/', async (req, res) => {
  try {
    const newLead = {
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('leads').add(newLead);
    res.status(201).json({ id: docRef.id, ...newLead });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('leads').doc(req.params.id).update(updateData);
    res.json({ message: 'Lead updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('leads').doc(req.params.id).delete();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notes for a lead
router.get('/:id/notes', async (req, res) => {
  try {
    const snapshot = await db.collection('leads').doc(req.params.id).collection('notes')
                             .orderBy('createdAt', 'desc').get();
    let notes = [];
    snapshot.forEach(doc => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note to a lead
router.post('/:id/notes', async (req, res) => {
  try {
    const newNote = {
      content: req.body.content,
      createdBy: req.user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('leads').doc(req.params.id).collection('notes').add(newNote);
    res.status(201).json({ id: docRef.id, ...newNote });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
