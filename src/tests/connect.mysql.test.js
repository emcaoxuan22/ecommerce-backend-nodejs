const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '123456',
    // database: 'test'
    

})

// perform a sample operation
pool.query('select 1 + 1 As solution', function(err, results) {
    if (err) {
        console.log(err);
    };
    console.log(results);
    // close pool connections
    pool.end(err => {
        if (err) {
            throw err;
        }
        console.log('Error closing pool connections');
    })
})