const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fastcsv = require('fast-csv');
const fs = require('fs');
//const ws = fs.createWriteStream("bezkoder_mysql_fastcsv.csv");
//const json2csv = require('json2csv').parse;

app.use(bodyParser.urlencoded({ extended: true }));


//Mysql create connection

const db = mysql.createConnection({
    connectionLimit: 10,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'nodemysql',
    port: '8889'
});

//Connect 

db.connect((err)=>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

//Serve static files . CSS , Img , JS files

app.use(express.static(path.join(__dirname, 'public')));


// Template engine. HBS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//Data Display

app.get('/datadisplay',(req,res) => {
    res.render('index');
})


app.post('/datadisplay',(req,res) => { 
    console.log(req.body.input);
    const a = req.body.input;
    const b = "'" + a.split( "," ).join( "','" ) + "'";
    let sql = `SELECT * FROM customer WHERE CUST_CODE in (${b})`;
    console.log(sql);
    db.query(sql,(err,data,fields) => {
        if(err) throw err; 
        const result = JSON.parse(JSON.stringify(data));
         
        fastcsv
            .write(result, {header: true})
            .on('finish', () => {
                console.log('Write to data.csv successfully!');            
            })
            .pipe(res)
        // res.attachment('bezkoder_mysql_fastcsv.csv');
        //res.status(200).send(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
    })

   
    
});


//Data Display

// app.get('/datadisplay',(req,res) => {
//     let sql = 'SELECT * FROM customer';
//     db.query(sql,(err,data) => {
//         if(err) throw err;
//         const result = JSON.parse(JSON.stringify(data));
//         const field = ['CUST_CODE', 'CUST_NAME'];
//         json2csv({ data: result, fields: field }, function(err, csv) {
//             if (err) throw err; 
//             res.setHeader('Content-disposition', 'attachment; filename=data.csv');
//             res.set('Content-Type', 'text/csv');
//             res.status(200).send(csv);
//           });
//     })
// });



//update the table

// app.get('/updatetable/:code',(req, res) => {
//     let sql = `UPDATE customer SET OPENING_AMT = '4000' WHERE CUST_CODE = '${req.params.code}'`;
//     db.query(sql, (err, result, fields) => {
//         if(err) throw err;
//         const result = JSON.parse(JSON.stringify(result));
//         res.send(result);
//     });
// });

//Port Listening

app.listen(3000, (res)=>{
    console.log('Running in 3000 port');
})