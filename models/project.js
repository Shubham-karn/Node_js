const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  project_name: {
    type: String,
    required: true,
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
