const db = require('../../dbConnection.js');

// Controller function to get ALL Jobs
exports.getAllJobs = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`SELECT * FROM Jobs`); // fetch all Jobs from Jobs tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get ALL 'open' or 'filled' Jobs
exports.getAllNonClosedJobs = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`SELECT * FROM Jobs WHERE NOT status = ?`, ['closed']); // fetch all Jobs from Jobs tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get a Job by job_id
exports.getJob = async (req, res) => {
    const { job_id } = req.body;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM Jobs WHERE job_id = ?`, [job_id]); // select all the rows (should only be 1) with the given job_id
        if (rows.length === 0)
            return res.status(404).json({ message: `Job with the id '${job_id}' not found` });

        res.status(200).json(rows) // return the row(s) as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() });  // catch all errors and return the error message as a json
    }
};

// Controller function to add a new Job to the table
exports.addJob = async (req, res) => {
    try {
        const { professor_id, job_title, lab_name, job_description, hours, term, compensation, 
            req_majors, req_grade_level, req_min_gpa, req_skills, application_deadline, reading_materials, status } = req.body;
        await db.promise().beginTransaction(); // start a transaction

        // Insert into Jobs table
        const [jobResult] = await db.promise().query(
            `INSERT INTO Jobs (professor_id, job_title, lab_name, job_description, hours, term, compensation, 
                req_majors, req_grade_level, req_min_gpa, req_skills, application_deadline, reading_materials, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [professor_id, job_title, lab_name, job_description, hours, term, compensation, 
                req_majors, req_grade_level, req_min_gpa, req_skills, application_deadline, reading_materials, status] // pass data in
        );

        // Commit the transaction
        await db.promise().commit();

        res.status(201).json({
            message: `Job ${job_title} added successfully`,
            professor_id: professor_id,
            status: status
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors out
        res.status(400).json({ error: error.toString() });
    }
};

// Controller function to modify fields for an existing Job in the table
exports.modifyJob = async (req, res) => {
    try {
        const { job_id, professor_id, job_title, lab_name, job_description, hours, term, compensation, 
            req_majors, req_grade_level, req_min_gpa, req_skills, application_deadline, reading_materials, status } = req.body;
        await db.promise().beginTransaction(); // start a transaction

        // Modify the Job's info in the Job table
        const [jobResult] = await db.promise().query(
            `UPDATE Jobs SET professor_id = ?, job_title = ?, lab_name = ?, job_description = ?, hours = ?, term = ?, compensation = ?, 
                req_majors = ?, req_grade_level = ?, req_min_gpa = ?, req_skills = ?, application_deadline = ?, reading_materials = ?, status = ? 
                WHERE job_id = ?`,
            [professor_id, job_title, lab_name, job_description, hours, term, compensation, 
                req_majors, req_grade_level, req_min_gpa, req_skills, application_deadline, reading_materials, status, job_id] // pass data in to modify
        );

        if (jobResult.affectedRows < 1) // this means nothing would be modified - so tell the user
            return res.status(404).json({ error: `There is no Job with the given id job_id=${job_id}` })
        
        // Commit the transaction
        await db.promise().commit();

        res.status(200).json({
            message: `Job '${job_title}' modified successfully`,
            professor_id: professor_id,
            status: status
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors
        res.status(400).json({ error: error.toString() });
    }
};