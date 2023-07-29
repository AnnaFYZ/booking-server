const express = require("express");
const cors = require("cors");

const app = express();

const moment = require("moment");
moment().format();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});


  // {
  //   "id": 1,
  //   "title": "Mr",
  //   "firstName": "Jimi",
  //   "surname": "Hendrix",
  //   "email": "jimi@example.com",
  //   "roomId": 2,
  //   "checkInDate": "2017-11-21",
  //   "checkOutDate": "2017-11-23"
  // }

// TODO add your routes and helper functions here
// 1. Create a new booking
app.post("/bookings", (req, res) => {
  let lastId = bookings.length + 1;
  if(!req.body.id || !req.body.title || !req.body.firstName || !req.body.surname || !req.body.email || !req.body.roomId || !req.body.checkInDate || !req.body.checkOutDate) {
    res.status(404).send("missing information, not allowed to proceed")
  } else if(moment(req.body.checkOutDate) < moment(req.body.checkInDate)) {
    res.send("You can't check out before checking in!")
  } else {
    let newBooking = { ...{ id: lastId }, ...req.body };
    bookings.push(newBooking);
    res.send(bookings);
  }
  
})
// 1. Read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings)
})

app.get("/bookings/search", (req, res) => {
  if(req.query.date){
    let searchedDate = moment(req.query.date);
    let result = bookings.filter(
      (booking) =>
        moment(booking.checkInDate) <= 
        searchedDate <=
        moment(booking.checkOutDate)
    );
    result ? res.send(result) : res.send("not found");
  } else if(req.query.term) {
    let searchValue = req.query.term.toLowerCase()
    let result = bookings.filter(booking => booking.firstName.toLowerCase().includes(searchValue) || booking.surname.toLowerCase().includes(searchValue) || booking.email.includes(searchValue))
    result.length !== 0 ? res.send(result) : res.send("not found");
  } else {
    res.send("I don't know what you are looking for")
  }
  
})

// 1. Read one booking, specified by an ID
app.get("/bookings/:id", (req, res)=>{
  let id = Number(req.params.id);
  let booking = bookings.find((booking) => booking.id === id);
  // If the booking to be read cannot be found by id, return a 404.
  booking ? res.send(booking) : res.status(404).send("such booking not found");
})
// 1. Delete a booking, specified by an ID

app.delete("/bookings/:id", (req, res) => {
  let id = Number(req.params.id);
  let indexToDelete = bookings.findIndex((booking) => booking.id === id);
  indexToDelete !== -1 ? (bookings.splice(indexToDelete, 1), res.sendStatus(200)) : res.status(404).send("Could not find to delete")
})

// If the booking for deletion cannot be found by id, return a 404.

// All booking content should be passed as JSON.

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});