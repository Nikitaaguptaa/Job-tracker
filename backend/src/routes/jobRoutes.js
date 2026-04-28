const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getJobs,
  addJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

router.get('/', auth, getJobs);
router.post('/', auth, addJob);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

module.exports = router;