const mongoose = require('mongoose');

const collaborativeEditingDataSchema = new mongoose.Schema({
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
  html_content: {
    type: String,
    required: true,
  },
  css_content: {
    type: String,
    required: true,
  },
  js_content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CollaborativeEditingData = mongoose.model(
  'CollaborativeEditingData',
  collaborativeEditingDataSchema
);

module.exports = CollaborativeEditingData;
