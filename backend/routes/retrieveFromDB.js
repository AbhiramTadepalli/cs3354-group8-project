const express = require('express');
const router = express.Router();
const UserController = require('../controllers/Users/UserController.js');
const AdminController = require('../controllers/Users/AdminController.js');
const ProfessorController = require('../controllers/Users/ProfessorController.js');
const StudentController = require('../controllers/Users/StudentController.js');
const JobController = require('../controllers/Applications/JobController.js');
const JobApplicationController = require('../controllers/Applications/JobApplicationController.js');

// Users
router.get('/User/all', UserController.getAllUsers); //This gets executed at http://localhost:5002/GET/User/all
router.get('/User/one', UserController.getUser); //This gets executed at http://localhost:5002/GET/User/one
// Admin
router.get('/Admin/all', AdminController.getAllAdmins); //This gets executed at http://localhost:5002/GET/Admin/all
router.get('/Admin/one', AdminController.getAdmin); //This gets executed at http://localhost:5002/GET/Admin/one
// Professors
router.get('/Professor/all', ProfessorController.getAllProfessors); //This gets executed at http://localhost:5002/GET/Professor/all
router.get('/Professor/one', ProfessorController.getProfessor); //This gets executed at http://localhost:5002/GET/Professor/one
// Students
router.get('/Student/all', StudentController.getAllStudents); //This gets executed at http://localhost:5002/GET/Student/all
router.get('/Student/one', StudentController.getStudent); //This gets executed at http://localhost:5002/GET/Student/one

// Jobs
router.get('/Job/all', JobController.getAllJobs); //This gets executed at http://localhost:5002/GET/Job/all
router.get('/Job/valid', JobController.getAllNonClosedJobs); //This gets executed at http://localhost:5002/GET/Job/valid
router.get('/Job/one', JobController.getJob); //This gets executed at http://localhost:5002/GET/Job/one
// Job Applications
router.get('/JobApplication/job', JobApplicationController.getAllJobApplicationsForAJob); //This gets executed at http://localhost:5002/GET/JobApplication/job
router.get('/JobApplication/student', JobApplicationController.getAllJobApplicationsForAStudent); //This gets executed at http://localhost:5002/GET/JobApplication/student
router.get('/JobApplication/one', JobApplicationController.getJobApplication); //This gets executed at http://localhost:5002/GET/JobApplication/one

// export the router module so that server.js file can use it
module.exports = router;