const express = require('express');
const redis = require('redis');
const authenticate = require('../../middleware/authenticate');
const {
  createProject,
  joinProject,
  getProjects,
  getProjectData,
  addMember,
} = require('../../controllers/project');
let redisClient;
const router = express.Router();

(async () => {
  redisClient = redis.createClient();

  redisClient.on('error', (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

router.post('/create', authenticate, createProject);
router.post('/addmember', authenticate, addMember);
router.post('/join', authenticate, joinProject);
router.get('/get', authenticate, getProjects);
router.get('/getdata/:project_id', getProjectData);
router.post;
router.get('/test', (req, res) => {
  res.send('hello');
});

module.exports = router;
