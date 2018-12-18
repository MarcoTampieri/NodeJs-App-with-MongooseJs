//*******************************
// SET UP
//*******************************
//require('dotenv').config();

let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let port = process.env.PORT || 8080

let url = process.env.DATA_BASE;//'mongodb://io:Lapapera1@ds125422.mlab.com:25422/mcgt1';

console.log(url);

let mongoose = require('mongoose');
mongoose.connect(url, {useNewUrlParser: true}, (err) => {
    if (err) throw err;
    console.log('connected to db')
});

const Bear = require('./app/models/Bear')

//*******************************
// ROUTES FOR API
//*******************************
let router = express.Router();

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});
// TEST TO SEE IF SERVER IS RUNNING

router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
})

// ROUTES THAT DO NOT NEED ID

router.route('/bears')
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err) {
                res.send(err);
            } else {
                res.json(bears);
            }
        })
    })
    .post((req, res) => {
        var bear = new Bear();
        bear.name = req.body.name;

        bear.save(err => {
            console.log("check1");
            if (err) {
                console.log(err);
                res.send(err);

            } else {
                console.log("check2");

                res.json({
                    message: 'Bear created!'
                });
            }
        })
        console.log('Request executed');
    })

// ROUTES THAT NEED ID

router.route('/bears/:bear_id')
    .get(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, Bear) {
            if (err) {
                res.send(err);
            } else {
                res.json(Bear)
                console.log('GET by ID succesful')
            }
        })
    })
    .put(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, Bear) {
            let oldName = Bear.name;

            if (err) {
                res.send(err);
            } else {
                Bear.name = req.body.name;
                Bear.save(function (err) {

                    if (err) {
                        res.send(err)
                    } else {
                        res.json({
                            message: 'Update succesful',
                            "Old name": oldName,
                            "New name": Bear.name,
                        });
                        console.log("PUT Request Succesful")
                    }
                })
            }
        })
    })
    .delete(function (req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function (err, Bear) {
            console.log(Bear.name);
            if (err) {
                res.send(err)
            } else {
                res.json({
                    message: 'DELETE succesful',

                });
                console.log("DELETE Request Succesful")
            }
        })
    })

// ROUTES REGISTER
app.use('/api', router)


//*******************************
// ROUTES FOR API
//*******************************
app.listen(port);
console.log('Do you believe in magic? ' + port);
