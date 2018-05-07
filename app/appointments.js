
var express = require("express")
var router = express.Router()
var db = require("../config/db.js")
var crypto = require("crypto")

router.get("/",isLoggedIn,function (req,res) {
    res.render("create_channel.ejs")

    //Returns all appointments
    //yani burada res.render degil res.json olacak.

})
//get appointment by appointment id
router.get('/my/host/',isLoggedIn,function (req,res) {
	var host_id = req.user.id

	db.query("SELECT * FROM Appointments WHERE HostId=?",[host_id],function (err,result) {
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

	db.query("SELECT * FROM Appointments WHERE GuestId=? OR HostId=?",[user_id,user_id],function (err,result) {
		if(err)
			return err
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
  var taker_id = req.body.GuestID
  var appointment_date = req.body.StartDateTime
  var giver_id = req.body.HostID

  db.query("select case when (select count(*) from Appointments where HostID = ? and StartDateTime = ? and AppointmentStatus = 1) = 0 then 0 else 1 end as count", [giver_id, appointment_date], function(err,result) {
    if(result != null){

      if(result[0].count == 1){
        db.query("update Appointments set AppointmentStatus = 2 where HostID = ? and StartDateTime = ?", [giver_id, appointment_date], function(err,result) {
          console.log("Giver ID: " + giver_id + " Taker ID: " + taker_id + " Datetime: " + appointment_date);
          res.json({code:200})
        })
        db.query("update Appointments set GuestID = ? where HostID = ? and StartDateTime = ?", [taker_id,giver_id, appointment_date], function(err,result) {
          console.log("Giver ID: " + giver_id + " Taker ID: " + taker_id + " Datetime: " + appointment_date);
          res.json({code:200})
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

router.post("/search", function(req,res){
  var end_date = req.body.EndDateTime
  var start_date = req.body.StartDateTime
  var host_id = req.body.HostID
  var counter = 0;
	if(end_date && start_date)
		db.query("select * from Appointments where HostID = ? and StartDateTime between ? and ? ", [host_id, start_date, end_date], function(err,result) {
					res.send(result)
		})
	else
		db.query("select * from Appointments where HostID = ? ", [host_id], function(err,result) {
			res.send(result)
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

	console.log(start_date+start_time)

    if(rec_pattern=="single"){
		//TODO istenen aralik bos mu dolu mu bunun kontrolu yapilmali
		db.query("INSERT INTO Appointments (HostID,AppointmentHeader,AppointmentDescription,Length,Location,StartDateTime) VALUES(?,?,?,?,?,?)",[host_id,appointment_header,appointment_description,length,location,start_date+" "+start_time],function (err,result) {
			if (err) {
				res.json({code:400,message:err})
			}else{
				res.redirect("/user")
			}
		})
    }else if(rec_pattern=="weekly"){
		//TODO momentjs ile gun gun ekleme yapilabilir bence bu kismi yaparken momentjs i derinlemesine arastir
		for(var i=0;i<reccurrency;i++){

		}
    }else if(rec_pattern=="monthly"){
		//TODO momentjs ile gun gun ekleme yapilabilir bence bu kismi yaparken momentjs i derinlemesine arastir
		for(var i=0;i<reccurrency;i++){

		}
	}
})

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}


module.exports = router
