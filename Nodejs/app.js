const mysql = require("mysql");
const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const exp = require("constants");

const app = express();
const server = http.createServer(app);

 //create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "karen1424@@",
    database: "demo_db"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuts
    max: 100 // limit ip
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"./public")));
app.use(helmet());
app.use(limiter);

// Add
app.post("/add", (req,res) => {
    console.log("Connected!!!");  
    console.log(req.body);
    let stmt = `INSERT INTO Users(userID,name,lastName,email,title) VALUES(?,?,?,?,?)`;
    let values = [req.body.id,req.body.name,req.body.lastName,req.body.email,req.body.title];
        
    // sends queries and receives results
    db.query(stmt, values, (err, result) => {
        if (err) {
         console.error(err.message);
        }
        console.log(result);
    });
    res.send("Entry displayed successfully");
});

// View
app.post("/view", (req,res) => {
    
  db.query(`SELECT * FROM Users WHERE userID = ${id} `,(err,row) => {
        if(err) {
            res.send("Error encountered while displaying");
            return  console.error(err.message);
        }
        res.send(row);
        console.log("Entry displayed successfully");
    });
});

// Update
app.post("/update", (req,res) => {    
    
  db.query('UPDATE Users SET name = (?) WHERE userID = (?)',[req.body.name,req.body.id], (err) => {
        
     if(err) {
            res.send("Error encountered while displaying");
            return  console.error(err.message);
        }       
        res.send("Entry updated successfully");
        console.log("Entry updated successfully");
    }); 
});
   
// Delete 
app.post("/delete", (req,res) => {
        
    db.query('DELETE FROM Users WHERE uesrID = ?',[req.body.id], (err) => {
        res.send("Error encountered while deleting");
        return console.error(err.message);
    });
    res.send("Entry deleted");
    console.log("Entry deleted");
});

db.end();

server.listen(3000,() => {
    console.log("server is listenning on port 3000 !!!!");
});
