const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('leads').get();
    let leads = [];
    snapshot.forEach(doc => {
      leads.push(doc.data());
    });

    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'New').length,
      qualifiedLeads: leads.filter(l => l.status === 'Qualified').length,
      wonLeads: leads.filter(l => l.status === 'Won').length,
      lostLeads: leads.filter(l => l.status === 'Lost').length,
      totalEstimatedValue: leads.reduce((acc, l) => acc + (Number(l.value) || 0), 0),
      totalWonValue: leads.filter(l => l.status === 'Won').reduce((acc, l) => acc + (Number(l.value) || 0), 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
