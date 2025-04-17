const db = require('../../dbConnection.js');

// Controller function to get ALL Users' data
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`SELECT * FROM Users`); // fetch all Users from Users tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get a User's data by user_id
exports.getUser = async (req, res) => {
    const { user_id } = req.query;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM Users WHERE user_id = ?`, [user_id]); // select all the rows (should only be 1) with the given user_id
        if (rows.length === 0)
            return res.status(404).json({ message: `User with the id '${user_id}' not found` });

        res.status(200).json(rows) // return the row(s) as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() });  // catch all errors and return the error message as a json
    }
};