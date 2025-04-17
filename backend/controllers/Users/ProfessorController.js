const db = require('../../dbConnection.js');

// Controller function to get ALL Professors' data
exports.getAllProfessors = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`SELECT * FROM 
            Professors INNER JOIN Users ON Professors.user_id = Users.user_id`); // fetch all Professors from both Professors and Users tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get a Professor's data by professor_id
exports.getProfessor = async (req, res) => {
    const { professor_id } = req.query;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM
            Professors INNER JOIN Users ON Professors.user_id = Users.user_id 
            WHERE professor_id = ?`, [professor_id]); // select all the rows (should only be 1) with the given professor_id
        if (rows.length === 0)
            return res.status(404).json({ message: `Professor with the id '${professor_id}' not found` });

        res.status(200).json(rows) // return the row(s) as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() });  // catch all errors and return the error message as a json
    }
};

// Controller function to add a new Professor to the table
exports.addProfessor = async (req, res) => {
    try {
        const { email, password, first_name, last_name, net_id, department, phone_no } = req.body;
        await db.promise().beginTransaction(); // start a transaction

        // Insert into Users table
        const [userResult] = await db.promise().query(
            'INSERT INTO Users (email, password_hash, first_name, last_name, user_type) VALUES (?, ?, ?, ?, ?)',
            [email, password, first_name, last_name, 'professor'] // pass data in. user_type is 'professor'
        );

        // Insert into Professors table
        const user_id = userResult.insertId; // need this to link a Professor entry with a User entry
        const [professorResult] = await db.promise().query(
            'INSERT INTO Professors (user_id, net_id, department, phone_no) VALUES (?, ?, ?, ?)',
            [user_id, net_id, department, phone_no]
        );

        // Commit the transaction
        await db.promise().commit();

        res.status(201).json({
            message: `Professor ${first_name} ${last_name} added successfully`,
            professor_id: professorResult.insertId,
            user_id: user_id
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors out
        res.status(400).json({ error: error.toString() });
    }
};

// Controller function to modify fields for an existing Professor in the table
exports.modifyProfessor = async (req, res) => {
    try {
        const { user_id, professor_id, email, password, first_name, last_name, net_id, department, phone_no } = req.body;
        await db.promise().beginTransaction(); // start a transaction

        // Modify the professor's info in the Users table
        const [userResult] = await db.promise().query(
            'UPDATE Users SET email = ?, password_hash = ?, first_name = ?, last_name = ? WHERE user_id = ?',
            [email, password, first_name, last_name, user_id] // pass data in to modify
        );

        // Modify the entry in the Professors table
        const [professorResult] = await db.promise().query(
            'UPDATE Professors SET net_id = ?, department = ?, phone_no = ? WHERE professor_id = ?',
            [net_id, department, phone_no, professor_id]
        );

        if (userResult.affectedRows < 1 || professorResult.affectedRows < 1) // this means nothing would be modified - so tell the user
            return res.status(404).json({ error: `There is no Professor with the given combination of user_id=${user_id} & professor_id=${professor_id}` })
        
        // Commit the transaction
        await db.promise().commit();

        res.status(200).json({
            message: `Professor '${first_name} ${last_name}' modified successfully`,
            professor_id: professor_id,
            user_id: user_id
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors
        res.status(400).json({ error: error.toString() });
    }
};