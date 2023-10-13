const { v4: uuidv4 } = require('uuid');
const Project = require('../models/project');
const Message = require('../config/message');

exports.createProject = async (req, res) => {
  const body = req.body;
  let { project_name, creator_id } = req.body;

  try {
    if (!project_name || !creator_id)
      return res.status(401).send(Message('Invalid request.'));

    project_name = project_name.trim();
    creator_id = creator_id.trim();

    // create a unique id for the project
    const project_id = uuidv4();
    const projectData = {
      project_id: project_id,
      project_name: project_name,
      creator_id: creator_id,
    };
    try {
      const projectExists = await Project.findOne({
        project_name: projectData.project_name,
        creator_id: projectData.creator_id,
      });

      if (projectExists) {
        return res.send(Message('Project already exists.'));
      }
    } catch (err) {
      return res.status(400).send(Message('Unknown error occurred.'));
    }

    const project = new Project(projectData);

    try {
      await project.save();
      return res.send(Message('Project Created Successfully.', true));
    } catch (err) {
      return res.send(Message(err.message));
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(Message(err.message));
  }
};

exports.getProjects = async (req, res) => {
  const { creator_id } = req.body;

  if (!creator_id) return res.status(401).send(Message('Not logged in.'));

  try {
    const projects = await Project.find({ creator_id: creator_id });
    return res.send(Message('', true, projects));
  } catch (err) {
    return res.send(Message(err.message));
  }
};

exports.addProjMember = async (req, res) => {
  const { project_id, member_id } = req.body;
  if (!project_id || !member_id)
    return res.status(401).send(Message('Invalid request.'));

  try {
    const project = await Project.findOne({ project_id: project_id });
    if (!project) return res.status(401).send(Message('No such project.'));

    const members = project.members;
    if (members.includes(member_id))
      return res.status(401).send(Message('Member already exists.'));

    members.push(member_id);
    project.members = members;
    await project.save();
    return res.send(Message('Member added successfully.', true));
  } catch (err) {
    return res.send(Message(err.message));
  }
};
