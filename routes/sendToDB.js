const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Users/AdminController.js');
const ProfessorController = require('../controllers/Users/ProfessorController.js');
const StudentController = require('../controllers/Users/StudentController.js');
const JobController = require('../controllers/Applications/JobController.js')
const JobApplicationController = require('../controllers/Applications/JobApplicationController.js')

// Admin
router.post('/Admin/add', AdminController.addAdmin); //This gets executed at http://localhost:5002/POST/Admin/add
router.post('/Admin/modify', AdminController.modifyAdmin); //This gets executed at http://localhost:5002/POST/Admin/modify
// Professor
router.post('/Professor/add', ProfessorController.addProfessor); //This gets executed at http://localhost:5002/POST/Professor/add
router.post('/Professor/modify', ProfessorController.modifyProfessor); //This gets executed at http://localhost:5002/POST/Professor/modify
// Student
router.post('/Student/add', StudentController.addStudent); //This gets executed at http://localhost:5002/POST/Student/add
router.post('/Student/modify', StudentController.modifyStudent); //This gets executed at http://localhost:5002/POST/Student/modify

// Job
router.post('/Job/add', JobController.addJob); //This gets executed at http://localhost:5002/POST/Job/add
router.post('/Job/modify', JobController.modifyJob); //This gets executed at http://localhost:5002/POST/Job/modify
// Job Applications
router.post('/JobApplication/add', JobApplicationController.addJobApplication); //This gets executed at http://localhost:5002/POST/JobApplication/add
router.post('/JobApplication/modify', JobApplicationController.modifyJobApplication); //This gets executed at http://localhost:5002/POST/JobApplication/modify

// export the router module so that server.js file can use it
module.exports = router;