const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Remote'],
    default: 'Full-time'
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  },
  salaryMin: {
    type: Number
  },
  salaryMax: {
    type: Number
  },
  deadline: {
    type: Date
  },
  interviewDate: {
    type: Date
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);