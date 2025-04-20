const db = require('../../dbConnection.js');
const { getJob } = require('./JobController.js')

// Controller function to get ALL JobApplications for a job_id
exports.getAllJobApplicationsForAJob = async (req, res) => {
    const { job_id } = req.query;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM JobApplications WHERE job_id = ? `, [job_id]); // fetch all JobApplications for a job_id from JobApplications tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get ALL JobApplications for a student_id
exports.getAllJobApplicationsForAStudent = async (req, res) => {
    const { student_id } = req.query;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM JobApplications WHERE student_id = ? `, [student_id]); // fetch all JobApplications for a student_id from JobApplications tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get a Job by job_id
exports.getJobApplication = async (req, res) => {
    const { application_id } = req.query;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM JobApplications WHERE application_id = ?`, [application_id]); // select all the rows (should only be 1) with the given application_id
        if (rows.length === 0)
            return res.status(404).json({ message: `Job Application with the id '${application_id}' not found` });

        res.status(200).json(rows) // return the row(s) as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() });  // catch all errors and return the error message as a json
    }
};

// Controller function to add a new JobApplication for a job_id to the table
exports.addJobApplication = async (req, res) => {
    try {
        const { job_id, student_id, research_experience, hours_per_week, 
            basic_student_response, status, documents_json } = req.body; // status should only be draft or submitted when adding a JobApplication
        await db.promise().beginTransaction(); // start a transaction
        
        // Check if job_id exists
        const mockReq = { query: { job_id } };
        const mockRes = {
            statusCode: null,
            responseData: null,
            status: function (statusCode) {
            this.statusCode = statusCode;
            return this; // Chainable
            },
            json: function (data) {
            this.responseData = data;
            },
        };
        await getJob(mockReq, mockRes)
        if (mockRes.statusCode != '200')
            return res.status(404).json({ message: mockRes.responseData.message });
        
        // Insert into JobApplications table
        const [jobApplicationResult] = await db.promise().query(
            `INSERT INTO JobApplications (job_id, student_id, research_experience, hours_per_week, 
            basic_student_response, status, documents_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [job_id, student_id, research_experience, hours_per_week, 
                basic_student_response, status, documents_json] // pass data in
        );
        const application_id = jobApplicationResult.insertId;

        // Commit the transaction
        await db.promise().commit();

        res.status(201).json({
            message: `Job Application ${application_id} added successfully`,
            job_id: job_id,
            status: status
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors out
        res.status(400).json({ error: error.toString() });
    }
};

// Controller function to modify fields for an existing JobApplication in the table
exports.modifyJobApplication = async (req, res) => {
    try {
        const { application_id, job_id, student_id, research_experience, hours_per_week, 
            basic_student_response, status, documents_json } = req.body; //TODO: probably don't allow changing the job_id in the frontend
        await db.promise().beginTransaction(); // start a transaction

        // Modify the JobApplication's info in the JobApplications table
        const [jobApplicationResult] = await db.promise().query(
            `UPDATE JobApplications SET job_id = ?, student_id = ?, research_experience = ?, hours_per_week = ?, 
            basic_student_response = ?, status = ?, documents_json = ? 
                WHERE application_id = ?`,
            [job_id, student_id, research_experience, hours_per_week, 
                basic_student_response, status, documents_json, application_id] // pass data in to modify
        );

        if (jobApplicationResult.affectedRows < 1) // this means nothing would be modified - so tell the user
            return res.status(404).json({ error: `There is no JobApplication with the given id application_id=${application_id}` })
        
        // Commit the transaction
        await db.promise().commit();

        res.status(200).json({
            message: `JobApplication '${application_id}' modified successfully`,
            student_id: student_id,
            status: status
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors
        res.status(400).json({ error: error.toString() });
    }
};