const express = require('express');
const redis = require('redis');
const authenticate = require('../../middleware/authenticate');
const { createProject, getProjects } = require('../../controllers/project');
let redisClient;
const router = express.Router();

(async () => {
  redisClient = redis.createClient();

  redisClient.on('error', (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

router.post('/create', authenticate, createProject);
router.post('/get', authenticate, getProjects);
router.get('/test', (req, res) => {
  res.send('hello');
});
router.get('/code', async (req, res) => {
  data = {
    htmlCode: await redisClient.get('htmlCode'),
    cssCode: await redisClient.get('cssCode'),
    jsCode: await redisClient.get('jsCode'),
  };
  console.log(data);
  res.json(data);
});
module.exports = router;
