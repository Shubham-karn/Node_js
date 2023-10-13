const mongoose = require('mongoose');

const projectMembersSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Creator', 'Editor', 'Viewer'],
  },
});

const ProjectMembers = mongoose.model('ProjectMembers', projectMembersSchema);

module.exports = ProjectMembers;
