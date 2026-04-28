const Job = require('../models/Job');

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add job
exports.addJob = async (req, res) => {
  try {
    const { company, position, status, jobType, location, notes } = req.body;

    const job = new Job({
      user: req.user.id,
      company,
      position,
      status,
      jobType,
      location,
      notes
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};