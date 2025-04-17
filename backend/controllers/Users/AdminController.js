const db = require('../../dbConnection.js');

// Controller function to get ALL Admins' data
exports.getAllAdmins = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`SELECT * FROM 
            Admins INNER JOIN Users ON Admins.user_id = Users.user_id`); // fetch all Admins from both Admins and Users tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get a Admin's data by admin_id
exports.getAdmin = async (req, res) => {
    const { admin_id } = req.query;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM
            Admins INNER JOIN Users ON Admins.user_id = Users.user_id 
            WHERE admin_id = ?`, [admin_id]); // select all the rows (should only be 1) with the given admin_id
        if (rows.length === 0)
            return res.status(404).json({ message: `Admin with the id '${admin_id}' not found` });

        res.status(200).json(rows) // return the row(s) as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() });  // catch all errors and return the error message as a json
    }
};

// Controller function to add a new Admin to the table
exports.addAdmin = async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        await db.promise().beginTransaction(); // start a transaction

        // Insert into Users table
        const [userResult] = await db.promise().query(
            'INSERT INTO Users (email, password_hash, first_name, last_name, user_type) VALUES (?, ?, ?, ?, ?)',
            [email, password, first_name, last_name, 'admin'] // pass data in. user_type is 'admin'
        );

        // Insert into Admins table
        const user_id = userResult.insertId; // need this to link a Admin entry with a User entry
        const [adminResult] = await db.promise().query(
            'INSERT INTO Admins (user_id) VALUES (?)',
            [user_id]
        );

        // Commit the transaction
        await db.promise().commit();

        res.status(201).json({
            message: `Admin ${first_name} ${last_name} added successfully`,
            admin_id: adminResult.insertId,
            user_id: user_id
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors out
        res.status(400).json({ error: error.toString() });
    }
};

// Controller function to modify fields for an existing Admin in the table
exports.modifyAdmin = async (req, res) => {
    try {
        const { user_id, admin_id, email, password, first_name, last_name } = req.body;
        await db.promise().beginTransaction(); // start a transaction

        // Modify the admin's info in the Users table
        const [userResult] = await db.promise().query(
            'UPDATE Users SET email = ?, password_hash = ?, first_name = ?, last_name = ? WHERE user_id = ?',
            [email, password, first_name, last_name, user_id] // pass data in to modify
        );

        // // Modify the entry in the Admins table
        // const [adminResult] = await db.promise().query(
        //     'UPDATE Admins SET net_id = ?, major = ?, graduation_year = ? gpa = ? WHERE admin_id = ?',
        //     [net_id, major, graduation_year, gpa, admin_id]
        // );

        if (userResult.affectedRows < 1 || adminResult.affectedRows < 1) // this means nothing would be modified - so tell the user
            return res.status(404).json({ error: `There is no Admin with the given combination of user_id=${user_id} & admin_id=${admin_id}` })
        
        // Commit the transaction
        await db.promise().commit();

        res.status(200).json({
            message: `Admin '${first_name} ${last_name}' modified successfully`,
            admin_id: admin_id,
            user_id: user_id
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors
        res.status(400).json({ error: error.toString() });
    }
};