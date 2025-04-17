import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';  // Import Tailwind styles
import App from './App';

/* User Pages */
import CreateAccountPage from './pages/createAccount/page';
import Login from './pages/login/page'; // Import your login page component

/* Student Pages */
import JobPostingDetails from './pages/StudentPages/jobPostDetails/page';
import SearchPage from './pages/StudentPages/searchPage/page';
import TrackApplication from './pages/StudentPages/trackApplication/page';
import EditStudentProfile from './pages/StudentPages/editStudentProfile/page';
import ViewStudentProfile from './pages/StudentPages/viewStudentProfile/page';
import ApplyToPosition from './pages/StudentPages/applyToPosition/page';
import Bookmarked from './pages/StudentPages/Bookmarked/page';

/* Prof. Pages */
import CreateApplication from './pages/ProfessorPages/createApplication/page'
import EditApplication from './pages/ProfessorPages/editApplication/Page';
import EditProfProfile from './pages/ProfessorPages/editProfProfile/page';
import ViewProfProfile from './pages/ProfessorPages/viewProfProfile/page';
import MyApplications from './pages/ProfessorPages/myApplications/page';
import ViewPostedJobs from './pages/ProfessorPages/ViewPostedJobs/page';
import ViewJob from './pages/ProfessorPages/ViewJob/page.jsx';
import ViewStudentApplication from './pages/ProfessorPages/viewStudentApplication/page';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />

      {/* User Pages */}
      <Route path= "/login" element={<Login />} />
      <Route path = "/createAccount" element = {<CreateAccountPage/>} />
      
      {/* Student Pages */}
      <Route path = "/searchPage" element = {<SearchPage/>} />
      <Route path="/jobDetails/:jobId" element={<JobPostingDetails />} />
      <Route path = "/trackApplication" element = {<TrackApplication/>} />
      <Route path = "/editStudentProfile" element = {<EditStudentProfile/>} />
      <Route path = "/viewStudentProfile" element = {<ViewStudentProfile/>} />
      <Route path = "/applyToPosition" element = {<ApplyToPosition/>} />
      <Route path = "/Bookmarked" element = {<Bookmarked/>} />

      {/* Prof. Pages */}
      <Route path = "/createApplication" element = {<CreateApplication/>} />
      <Route path = "/editApplication" element = {<EditApplication/>} />
      <Route path = "/editProfProfile" element = {<EditProfProfile/>} />
      <Route path = "/viewProfProfile" element = {<ViewProfProfile/>} />
      <Route path = "/viewPostedJobs" element = {<ViewPostedJobs/>} />
      <Route path = "/job_id" element = {<ViewJob/>} />
      <Route path = "/job_id/app_id" element = {<ViewStudentApplication/>} />
      <Route path = "/myApplications" element = {<MyApplications/>} />


    </Routes>
  </Router>
);
