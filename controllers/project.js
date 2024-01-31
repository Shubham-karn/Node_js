const { v4: uuidv4 } = require('uuid');
const user = require('../models/user');
const Project = require('../models/project');
const ProjectMembers = require('../models/projectMembers');
const Message = require('../config/message');
const ProjectData = require('../models/projectData');
exports.createProject = async (req, res) => {
  let { project_name, project_description } = req?.body;
  const creator_id = req?.user?._id;

  try {
    if (!project_name || !creator_id)
      return res.status(401).send(Message('Invalid request.'));

    project_name = project_name.trim();
    project_description = project_description.trim();

    // create a unique id for the project
    const project_id = uuidv4();
    const projectData = {
      project_id: project_id,
      project_name: project_name,
      creator_id: creator_id,
      project_description: project_description,
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
      const result = await project.save();
      console.log(result);
      const projectMembersData = {
        project_id: result?._id,
        user_id: creator_id,
        role: 'Creator',
      };
      const projectDataData = {
        project_id: result?._id,
        user_id: creator_id,
        html_content: 'html',
        css_content: 'css',
        js_content: 'js',
      };
      const projectData = new ProjectData(projectDataData);
      const projectMembers = new ProjectMembers(projectMembersData);
      await projectMembers.save();
      await projectData.save();
      return res.send(
        Message('Project Created Successfully.', true, {
          project_id: result?.project_id,
        })
      );
    } catch (err) {
      return res.send(Message(err.message));
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(Message(err.message));
  }
};

exports.addMember = async (req, res) => {
  let { project_id, email } = req?.body;
  console.log(req.body);

  try {
    if (!project_id || !email)
      return res.status(401).send(Message('Invalid request.'));

    // create a unique id for the project

    try {
      const projectExists = await Project.findOne({
        _id: project_id,
      });

      if (!projectExists) {
        return res.status(400).send(Message('Unknown error occurred.'));
      }
    } catch (err) {
      return res.status(400).send(Message('Unknown error occurred.'));
    }

    const userData = await user.findOne({ email: email });
    console.log(user, 'user');

    try {
      const projectMembersData = {
        project_id: project_id,
        user_id: userData._id,
        role: 'Editor',
      };
      const projectMembers = new ProjectMembers(projectMembersData);
      await projectMembers.save();

      return res.send(
        Message('Member added successfully', true, {
          project_id: project_id,
        })
      );
    } catch (err) {
      return res.send(Message(err.message));
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(Message(err.message));
  }
};

exports.joinProject = async (req, res) => {
  let { project_id } = req?.body;
  const user_id = req?.user?._id;
  console.log(project_id, 'projectsdflkjsdflj');
  try {
    if (!project_id || !user_id)
      return res.status(401).send(Message('Invalid request.'));

    // project_name = project_name.trim();

    try {
      const projectExists = await Project.findOne({
        project_id: project_id,
      });

      if (!projectExists) {
        return res.status(400).send(Message('Project doesnot exists.'));
      }
      console.log(projectExists, 'projectexists');

      const projectMembersData = {
        project_id: projectExists?._id,
        user_id: user_id,
      };
      // const projectDataData = {
      //   project_id: result?._id,
      //   user_id: creator_id,
      //   html_content: 'html',
      //   css_content: 'css',
      //   js_content: 'js',
      // };
      // const projectData = new ProjectData(projectDataData);
      const isMember = await ProjectMembers.findOne(projectMembersData);
      console.log(isMember, 'ismember');

      if (!isMember) {
        return res.status(400).send(Message('Not a member of project'));
      }
      return res.send(
        Message('member of project', true, {
          project_id: project_id,
        })
      );
    } catch (err) {
      return res.send(Message(err.message));
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(Message(err.message));
  }
};

exports.getProjectData = async (req, res) => {
  const { project_id } = req.params;
  const { user } = req;
  const user_id = user?._id;

  if (!project_id || !user_id)
    return res.status(401).send(Message('Invalid request.'));
  try {
    const project = await Project.findOne({
      project_id: project_id,
    }).populate('creator_id');
    // console.log(project, 'hello');
    if (!project) return res.status(401).send(Message('No such project.'));
    const projectMembers = await ProjectMembers.find({
      project_id: project._id,
      user_id: user?._id,
    }).populate('user_id');
    console.log(projectMembers);
    if (!projectMembers)
      return res.status(401).send(Message('Not a member of this project.'));
    const projectData = await ProjectData.findOne({
      project_id: project._id,
      user_id: user_id,
    });
    if (!projectData)
      return res.status(401).send(Message('No data found for this project.'));
    return res.send(
      Message('Project Data fetched successfully.', true, {
        projectData,
        project,
      })
    );
  } catch (err) {
    return res.send(Message(err.message));
  }
};

exports.getProjects = async (req, res) => {
  res.send('hello');
  // const { creator_id } = req.body;

  // if (!creator_id) return res.status(401).send(Message('Not logged in.'));

  // try {
  //   const projects = await Project.find({ creator_id: creator_id });
  //   return res.send(Message('', true, projects));
  // } catch (err) {
  //   return res.send(Message(err.message));
  // }
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
