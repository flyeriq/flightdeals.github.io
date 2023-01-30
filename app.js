

const express = require('express');
// const bodyParser = require('body-parser');
const bodyParser = require('body-parser');
// const ObjectId = require('mongodb').ObjectId
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId

const app = express();


app.use(express.static("./public/"));
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json());
app.set('view engine', 'ejs');

//MongoDb connection
mongoose.connect("mongodb+srv://admin-prashant:prashant1601@cluster0.fpopc.mongodb.net/SAFAR", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// mongoose.connect("mongodb://localhost:27017/SAFAR", {useNewUrlParser: true,useUnifiedTopology: true});

const flightSchema = new mongoose.Schema({
  origin:String,
  ocode:String,
  destination:String,
  dcode:String,
  category:String,
  duration:String,
  ddate:String,
  refund:String,
  amount:String,
  flname:String

});

const Flight = mongoose.model("Flight", flightSchema);

// app.get('/', (req, res) => res.render('index'));
// app.get('/admin', (req, res) => res.render('admin'));

app.get("/admin", function(req, res) {
  Flight.find({}, function(err, flight) {
    res.render("admin", {
      flight: flight,
    });
  });
});

app.post("/admin",  function(req, res) {
  const newFlight = new Flight({
    origin:req.body.origin1,
    ocode:req.body.ocode1,
    destination:req.body.destination1,
    dcode:req.body.dcode1,
    category:req.body.category1,
    duration:req.body.duration1,
    ddate:req.body.ddate1,
    refund:req.body.refund1,
    amount:req.body.amount1,
    flname:req.body.flname1
  });
  newFlight.save(function(err) {
    if (err) {

      console.log("Error is here.");
      console.log(err);

    } else {
      // req.flash('success_msg', 'Massege Sent successfully!')
      res.redirect('/admin');
      console.log("Pass From here to redirect admin");
    }
  });
});

app.get("/", function(req, res) {
  Flight.find({}, function(err, flight) {
    res.render("index", {
      flight: flight,
    });
  });
});

app.get("/usersearch", function(req, res) {
  Flight.find({}, function(err, flight) {
    res.render("search", {
      flight: flight,
    });
  });
});

app.get('/search', (req, res) => {
  try {

    Flight.find({
        $and: [{
            origin: {
              '$regex': req.query.origin2
            }
          },
          {
            destionation: {
              '$regex': req.query.destination2
            }
          },
          {
            ddate: {
              '$regex': req.query.ddate2
            }
          },
          // {
          //   status: {
          //     '$regex': "Active"
          //   }
          // }
        ]
      },
      (err, flight) => {
        if (err) {
          // req.flash('error', ' Worng Input .')
          res.redirect('/admin');
          console.log(err);
          console.log('Finding book');
        } else {
          res.render('admin', {
            flight: flight
          })
        }
      })
  } catch (error) {
    console.log(error);
  }
});

app.get('/usersearch2', (req, res) => {
  try {

    Flight.find({
        $and: [{
            origin: {
              '$regex': req.query.origin2
            }
          },
          {
            destionation: {
              '$regex': req.query.destination2
            }
          },
          {
            ddate: {
              '$regex': req.query.ddate2
            }
          },
          // ,
          // {
          //   address: {
          //     '$regex': req.query.freesearch
          //   }
          // },
          // {
          //   status: {
          //     '$regex': "Active"
          //   }
          // }
        ]
      },
      (err, flight) => {
        if (err) {
          // req.flash('error', ' Worng Input .')
          res.redirect('/usersearch');
          console.log(err);
          console.log('Finding book');
        } else {
          res.render('search', {
            flight: flight
          })
        }
      })
  } catch (error) {
    console.log(error);
  }
});

// DELETE USER
app.post('/admin1/(:id)', function(req, res, next) {
  var o_id = new ObjectId(req.params.id)
  Flight.deleteOne({
    "_id": o_id
  }, function(err, result) {
    if (err) {
      console.log(err);
      // req.flash('error', err)
      // redirect to users list page
      res.redirect('/admin')
    } else {
      console.log('User deleted successfully! id = ' + req.params.id);
      // req.flash('success', 'User deleted successfully! id = ' + req.params.id)
      // redirect to users list page
      res.redirect('/admin')
    }
  })
})

app.get('/edit/(:id)', function(req, res, next) {
  var o_id = new ObjectId(req.params.id)
  Flight.find({
    "_id": o_id
  }, (function(err, result) {
    if (err) return console.log(err)
    if (!result) {
      res.redirect('/')
    } else { // if user found
      res.render('edit', {
        id: result[0]._id,
        origin:result[0].origin,
        ocode:result[0].ocode,
        destination:result[0].destination,
        dcode:result[0].dcode,
        category:result[0].category,
        duration:result[0].duration,
        ddate:result[0].ddate,
        refund:result[0].refund,
        amount:result[0].amount,
        flname:result[0].flname
      })
    }
  }))
})


app.post('/edit/(:id)', function(req, res, next) {

  const o_id = new ObjectId(req.params.id)
  Flight.updateOne({
    "_id": o_id
  }, {
    $set: {
      origin:req.body.origin1,
      ocode:req.body.ocode1,
      destination:req.body.destination1,
      dcode:req.body.dcode1,
      category:req.body.category1,
      duration:req.body.duration1,
      ddate:req.body.ddate1,
      refund:req.body.refund1,
      amount:req.body.amount1,
      flname:req.body.flname1

    }
  }, function(err, result) {
    if (err) {
      // req.flash('error', err)

      res.render('edit', {
        id: req.params.id,
        origin:req.body.origin1,
        ocode:req.body.ocode1,
        destination:req.body.destination1,
        dcode:req.body.dcode1,
        category:req.body.category1,
        duration:req.body.duration1,
        ddate:req.body.ddate1,
        refund:req.body.refund1,
        amount:req.body.amount1,
        flname:req.body.flname1

      })

    } else {
      // req.flash('success_msg', 'Profile updated successfully!')
      res.redirect('/admin');
    }
  });
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 1000;
}
app.listen(port, function() {
  console.log("server has started on port localhost:1000.");
});
