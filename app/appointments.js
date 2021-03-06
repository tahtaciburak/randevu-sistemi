
var express = require("express")
var router = express.Router()
var db = require("../config/db.js")
var crypto = require("crypto")
var moment = require("moment")

router.get("/",isLoggedIn,function (req,res) {
    res.render("create_channel.ejs")

    //Returns all appointments
    //yani burada res.render degil res.json olacak.

})
//get appointment by appointment id
router.get('/my/host/',isLoggedIn,function (req,res) {
	var host_id = req.user.id

	db.query("SELECT * FROM Appointments WHERE HostId=? AND AppointmentStatus!=3",[host_id],function (err,result) {
		if(err){
            console.log(err)
        }

        res.json(result)
	})
})

router.get('/host/:host_id',isLoggedIn,function (req,res) {
	var host_id = req.params.host_id

	db.query("SELECT * FROM Appointments WHERE HostId=?",[host_id],function (err,result) {
		if(err){
            console.log(err)
        }

        res.json(result)
	})
})

router.get('/my/guest/',isLoggedIn,function (req,res) {
	var guest_id = req.user.id;

	db.query("SELECT * FROM Appointments WHERE GuestId=?",[guest_id],function (err,result) {
		if(err)
			return err

		res.json(result)
	})
})

router.get('/guest/:guest_id',isLoggedIn,function (req,res) {
	var guest_id = req.params.guest_id;

	db.query("SELECT * FROM Appointments WHERE GuestId=?",[guest_id],function (err,result) {
		if(err)
			return err
        //burada result degiskeni icerisinde bizim tum randevularimiz donmus olacak
        res.json(result)
	})
})

router.get('/my/all/',isLoggedIn,function (req,res) {
	var user_id = req.user.id;

	db.query("SELECT * FROM Appointments a, users u WHERE (a.GuestId=? AND u.id = a.HostId) OR (a.HostId=? AND u.id = a.GuestId) ORDER BY StartDateTime",[user_id,user_id],function (err,result) {
		if(err)
			throw err
        //burada result degiskeni icerisinde bizim tum randevularimiz donmus olacak
        res.json(result)
	})
})

router.get('/all/:user_id',isLoggedIn,function (req,res) {
	var user_id = req.params.user_id;

	db.query("SELECT * FROM Appointments WHERE GuestId=? OR HostId=?",[user_id,user_id],function (err,result) {
		if(err)
			return err
        //burada result degiskeni icerisinde bizim tum randevularimiz donmus olacak
        res.json(result)
	})
})


router.post("/take", function (req, res) {
  let guest_id = req.user.id
	let AppointmentID = req.body.AppointmentID
	console.log(guest_id," -- ",AppointmentID);
  db.query("select case when (select count(*) from Appointments where AppointmentID = ? and AppointmentStatus = 1) = 0 then 0 else 1 end as count", [AppointmentID], function(err,result) {
    if(result != null){

      if(result[0].count == 1){
        db.query("update Appointments set AppointmentStatus = 2 where AppointmentID = ?", [AppointmentID], function(err,result) {
					if(err) throw err;
					db.query("update Appointments set GuestID = ? where AppointmentID = ?", [guest_id,AppointmentID], function(err,result) {
						if(err) throw err;
						res.json({code:200})
					})
        })
      }else {
        res.send({code:201})
        return err
      }
    }else{
      console.log(err)
    }
  })
})

router.get("/search/:query", function(req,res){
  let query = req.params.query
  let user_id = req.user.id

	db.query("select * from Appointments,users where HostID = id and username LIKE CONCAT('%',?, '%') AND id != ?", [query,user_id], function(err,result) {
			if(err) throw err;
			res.status(200).send(result);
	})
})

router.get("/cancel/:AppointmentID", function(req,res){
  var appointment_ID = req.params.AppointmentID
  db.query("update Appointments set AppointmentStatus = 3 where AppointmentID = ? ", [appointment_ID], function(err,result) {
        if(err){
          res.json({code:400, message:err})
        }else{
          res.send({code:200})
        }
  })
})

router.post("/getAppointmentInformation", function(req, res) {
  var appointment_id = req.body.AppointmentID
  var query = "select AppointmentID, AppointmentDescription, AppointmentHeader, Giver, GuestID, Length, Location," +
    "Taker, statusString as AppointmentStatus from (select AppointmentID, AppointmentDescription, AppointmentHeader, Giver," +
    "GuestID, AppointmentStatus, Length, Location, username as Taker from " +
    "(select AppointmentID, AppointmentDescription, AppointmentHeader, username as Giver, GuestID, " +
    "AppointmentStatus, Length, Location from Appointments inner join users on Appointments.HostID = users.id " +
    "where AppointmentID = ?) tablo inner join users on users.id = tablo.GuestID) tablo2 inner join " +
    "AppointmentStatus on tablo2.AppointmentStatus = AppointmentStatus.appointmentStatus"

    console.log("Query: ", query);

  db.query("SELECT * FROM Appointments WHERE AppointmentID = ?", [appointment_id],
    function (err, result) {
        if(err){
          res.json({code:400, message:err})
        }else{
          res.json(result)
        }
    })
})

router.post("/getRelations",function(req,res){
  let host_id = req.body.host_id
  let guest_id = req.body.guest_id
  console.log(host_id)
  console.log(guest_id)

  db.query("SELECT * FROM Appointments WHERE GuestID = ? AND HostID = ?",[guest_id,host_id],function(err,result){
    if(err){
      throw err
      res.json({code:400,msg: "something went wrong"})
    }else{
      console.log(result)
      res.json(result)
    }
  })
})

router.post("/new",function (req,res) {
	var host_id = req.user.id
  var appointment_header = req.body.appointment_header
  var appointment_description = req.body.appointment_description
  var length = req.body.length //dakika cinsinden
	var start_date = req.body.start_date
	var start_time = req.body.start_time
	var reccurrency = req.body.reccurrency
	var location = req.body.location
	var rec_pattern = req.body.rec_pattern
  
  let full_date = start_date+" "+start_time
  if(rec_pattern=="single"){
  //TODO istenen aralik bos mu dolu mu bunun kontrolu yapilmali
  db.query("INSERT INTO Appointments (HostID,AppointmentHeader,AppointmentDescription,Length,Location,StartDateTime,AppointmentStatus) VALUES(?,?,?,?,?,?,1)",[host_id,appointment_header,appointment_description,length,location,full_date],function (err,result) {
    if (err) {
      throw err
      res.json({code:400,message:err})
    }else{
      res.redirect("/user")
    }
  })
  }else if(rec_pattern=="weekly"){
    for(var i=0;i<reccurrency;i++){
      db.query("INSERT INTO Appointments (HostID,AppointmentHeader,AppointmentDescription,Length,Location,StartDateTime,AppointmentStatus) VALUES(?,?,?,?,?,?,1)",[host_id,appointment_header,appointment_description,length,location,full_date],function (err,result) {
        if (err) {
          throw err
          res.json({code:400,message:err})
        }else{
        }
      })
      full_date = moment(moment(full_date).add(1,"week")).format("")
    }
    res.redirect("/user")
  }else if(rec_pattern=="monthly"){
    for(var i=0;i<reccurrency;i++){
      db.query("INSERT INTO Appointments (HostID,AppointmentHeader,AppointmentDescription,Length,Location,StartDateTime,AppointmentStatus) VALUES(?,?,?,?,?,?,1)",[host_id,appointment_header,appointment_description,length,location,full_date],function (err,result) {
        if (err) {
          throw err
          res.json({code:400,message:err})
        }else{
        }
      })
      full_date = moment(moment(full_date).add(1,"month")).format("")
    }
    res.redirect("/user")
}
})

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

function rotate(day){
  if (day != 1){
    return day-1;
  }else{
    return 7;
  }
}

module.exports = router
