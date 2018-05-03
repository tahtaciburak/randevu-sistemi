
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
