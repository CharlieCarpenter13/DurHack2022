const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data.sql');



// db.all("SELECT * FROM bars", [], (err, rows) => {
//     console.log(rows) 
// });

//function Add

const app = express();
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let d = require('./distances.js');
let sp = require("./shortest_paths.js");
const { array } = require('assert-plus');

app.get('/bar/get', (req, res) => {
    console.log(req.query.bar);
    db.all("SELECT * FROM bars WHERE name=?", [req.query.bar], (err, rows) => {
        if (err) {console.log(err)}
        res.end(JSON.stringify(rows))
    });
});

app.get('/bar/getAll', (req, res) => {
    db.all("SELECT name, coords FROM bars", [], (err, rows) => {
        if (err) {console.log(err)}
        res.end(JSON.stringify(rows))
    });
});

app.post('/bar/order', (req, res) => {
    let matrix = [];
    for (let i=0; i<req.body.bars.length; i++) {
        matrix.push(new Array(req.body.bars.length).fill(0))
    }
    db.all("SELECT * FROM distances", [], (err, rows) => {
        if (err) {console.log(err)}
        for (let i=0;i<req.body.bars.length;i++) {
            for (let j=0; j<rows.length; j++) {
                if (rows[j].bar1 === req.body.bars[i] && req.body.bars.indexOf(rows[j].bar2) !== -1) {
                    matrix[req.body.bars.indexOf(rows[j].bar2)][i] = rows[j].duration;
                } else if (rows[j].bar2 === req.body.bars[i] && req.body.bars.indexOf(rows[j].bar1) !== -1) {
                    matrix[req.body.bars.indexOf(rows[j].bar1)][i] = rows[j].duration;
                }
            }
        }
        //run python
        console.log(matrix)
        let shortestBars = sp.shortest(matrix)
        // let shortestBars = sp.bruit_force(matrix);

            let orderedBars = []
            for (let i=0; i<shortestBars.length; i++) {
                console.log(shortestBars)
                console.log(matrix)
                db.all("SELECT coords FROM bars WHERE name=?", [req.body.bars[i]], (err, coords) => {
                    db.all("SELECT duration FROM distances WHERE (bar1=? AND bar2=?) OR (bar2=? AND bar1=?)", [req.body.bars[i], req.body.bars[i+1], req.body.bars[i], req.body.bars[i+1]], (err, duration) => {
                        if (duration[0]) {
                            orderedBars.push({name: req.body.bars[i], coords: coords[0].coords, time: duration[0].duration})
                        } else {
                            orderedBars.push({name: req.body.bars[i], coords: coords[0].coords, time: null})
                            console.log(orderedBars)
                            res.end(JSON.stringify(orderedBars))
                            
                        }
                    })
                })
            }
        })
    });



app.post('/bar/new', function (req, res) {
    let new_bar = req.body.new_bar;

    // this adds the new bar to the table.
    db.run(`INSERT INTO bars(name, coords) VALUES(?,?)`, [new_bar.name, new_bar.coords], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });

    db.all("SELECT * FROM bars", [], (err, rows) => {
        console.log(rows);
        d.work_out_all(new_bar, rows);

    });
    
    res.end("Hello World")
});
app.listen(3000);