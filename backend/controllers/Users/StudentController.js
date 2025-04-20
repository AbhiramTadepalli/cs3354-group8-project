const db = require('../../dbConnection.js');

// Controller function to get ALL Students' data
exports.getAllStudents = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`SELECT * FROM 
            Students INNER JOIN Users ON Students.user_id = Users.user_id`); // fetch all Students from both Students and Users tables
        
        res.status(200).json(rows) // return the rows as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() }); // catch all errors and return the error message as a json
    }
};

// Controller function to get a Student's data by student_id
exports.getStudent = async (req, res) => {
    const { student_id } = req.query;
    try {
        const [rows] = await db.promise().query(`SELECT * FROM
            Students INNER JOIN Users ON Students.user_id = Users.user_id 
            WHERE student_id = ?`, [student_id]); // select all the rows (should only be 1) with the given student_id
        if (rows.length === 0)
            return res.status(404).json({ message: `Student with the id '${student_id}' not found` });

        res.status(200).json(rows) // return the row(s) as a json. OK status
    } catch (error) {
        res.status(400).json({ error: error.toString() });  // catch all errors and return the error message as a json
    }
};

// Controller function to add a new Student to the table
exports.addStudent = async (req, res) => {
    try {
        const { email, password, first_name, last_name, net_id, major, graduation_year, gpa } = req.body;
        await db.promise().beginTransaction(); // start a transaction

        // Insert into Users table
        const [userResult] = await db.promise().query(
            'INSERT INTO Users (email, password_hash, first_name, last_name, user_type) VALUES (?, ?, ?, ?, ?)',
            [email, password, first_name, last_name, 'student'] // pass data in. user_type is 'student'
        );

        // Insert into Students table
        const user_id = userResult.insertId; // need this to link a Student entry with a User entry
        const [studentResult] = await db.promise().query(
            'INSERT INTO Students (user_id, net_id, major, graduation_year, gpa) VALUES (?, ?, ?, ?, ?)',
            [user_id, net_id, major, graduation_year, gpa]
        );

        // Commit the transaction
        await db.promise().commit();

        res.status(201).json({
            message: `Student ${first_name} ${last_name} added successfully`,
            student_id: studentResult.insertId,
            user_id: user_id
        });
    } catch (error) {
        await db.promise().rollback(); // don't push the changes if it errors out
        res.status(400).json({ error: error.toString() });
    }
};

// Controller function to modify fields for an existing Student in the table
exports.modifyStudent = async (req, res) => {
    try {
      const { user_id, student_id, email, password, first_name, last_name, net_id, major, graduation_year, gpa } = req.body;
      
      console.log("Received data:", req.body); // Debug log
      
      await db.promise().beginTransaction(); // start a transaction
      
      // Build dynamic queries to handle optional password update
      let userUpdateFields = 'email = ?, first_name = ?, last_name = ?';
      let userUpdateValues = [email, first_name, last_name];
      
      // Only update password if it's provided and not empty
      if (password && password !== '' && password !== undefined) {
        userUpdateFields += ', password_hash = ?';
        userUpdateValues.push(password);
      }
      
      userUpdateValues.push(user_id);
      
      // Modify the student's info in the Users table
      const [userResult] = await db.promise().query(
        `UPDATE Users SET ${userUpdateFields} WHERE user_id = ?`,
        userUpdateValues
      );
      
      // Modify the entry in the Students table
      const [studentResult] = await db.promise().query(
        'UPDATE Students SET net_id = ?, major = ?, graduation_year = ?, gpa = ? WHERE student_id = ?',
        [net_id, major, graduation_year, gpa, student_id]
      );
      
      if (userResult.affectedRows < 1 || studentResult.affectedRows < 1) // this means nothing would be modified - so tell the user
        return res.status(404).json({ error: `There is no Student with the given combination of user_id=${user_id} & student_id=${student_id}` });
      
      // Commit the transaction
      await db.promise().commit();
      
      res.status(200).json({
        message: `Student '${first_name} ${last_name}' modified successfully`,
        student_id: student_id,
        user_id: user_id
      });
    } catch (error) {
      await db.promise().rollback(); // don't push the changes if it errors
      console.error("Error in modifyStudent:", error); // Debug log
      res.status(400).json({ error: error.toString() });
    }
  };