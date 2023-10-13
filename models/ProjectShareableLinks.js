const mongoose = require('mongoose');

const projectShareableLinksSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  permission: {
    type: String,
    required: true,
    enum: ['Edit', 'View'],
  },
  expiration_date: {
    type: Date,
  },
});

const ProjectShareableLinks = mongoose.model(
  'ProjectShareableLinks',
  projectShareableLinksSchema
);

module.exports = ProjectShareableLinks;
