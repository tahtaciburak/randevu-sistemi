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
		//burada result degiskeni icerisinde bizim tum randevularimiz donmus olacak
	})
})

router.get('/host/:host_id',isLoggedIn,function (req,res) {
	var host_id = req.params.host_id

	db.query("SELECT * FROM Appointments WHERE HostId=?",[host_id],function (err,result) { 
		if(err){
            console.log(err)            
        }        

        res.json(result)
		//burada result degiskeni icerisinde bizim tum randevularimiz donmus olacak
	})
})

router.get('/my/guest/',isLoggedIn,function (req,res) {
	var guest_id = req.user.id;

	db.query("SELECT * FROM Appointments WHERE GuestId=?",[guest_id],function (err,result) { 
		if(err)
			return err
        //burada result degiskeni icerisinde bizim tum randevularimiz donmus olacak
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



router.post("/new",isLoggedIn,function (req,res) {
    var host_id = req.user.id
    var appointment_header = req.body.appointment_header
    var appointment_description = req.body.appointment_description
    var length = req.body.length //dakika cinsinden
    var start_date = req.body.start_date
    var period = req.body.period

    if(period=="single"){

    }else if(period=="weekly"){

    }else if(period=="monthly"){

    }

	db.query("INSERT INTO Appointments (owner_id,name,description,created_at,image_url) VALUES(?,?,?,NOW(),?)",[owner_id,channel_name,channel_description,image_url],function (err,result) {
		if (err) {
			res.json({code:400,message:"DB_ERROR"})
		}else{
			res.redirect("/profile")
		}
	})
        utilities.createChannel(
            {
                channel_name: req.body.channel_name,
                channel_description: req.body.channel_description,
                image_url: req.body.img_url,
                owner_id: req.user.id
            },
            function(err, id)
            {
                if(err)
                {
                    return utilities.printError(res, err)
                }

                //utilities.printSuccess(res, {channel_id: id})
				res.redirect("/channels/" + id)
            }
        )
})
/*
router.get("/delete",isLoggedIn,function (req,res) {
	var id = req.query.id

	db.query("DELETE FROM data WHERE channel_id = ? ",[id],function (err,result) {
		if (err) {
			res.json({code:400,message:"DB_ERROR_here"})
		}else{
			db.query("DELETE FROM api_keys WHERE channel_id=?",[id],function (err,result) {
				if(err){
					res.json(err)
				}else{
					db.query("DELETE FROM components WHERE channel_id=?",[id],function (err,result) {
						if (err) {
							res.json(err)
						}else{
							db.query("DELETE FROM channels WHERE id=?",[id],function (err,result) {
								if(err){
									res.json({code:400,message:"DB_ERROR"})
								}else{
									res.redirect("/profile")
								}
							})
						}
					})
				}
			})
		}
	})

})


router.get("/components/delete/:component_id",isLoggedIn,function (req,res) {
	var component_id = req.params.component_id
	var channel_id
	db.query("SELECT * FROM components WHERE id=?",[component_id],function (err,result) {
		if(err){
			res.json(err)
		}else{
			channel_id=result[0].channel_id
		}
	})
	db.query("DELETE FROM data WHERE component_id=?",[component_id],function (err,result) {
		if(err){
			res.json(err)
		}else{
			db.query("DELETE FROM api_keys WHERE component_id=?",[component_id],function (err,result) {
				if(err){
					res.json(err)
				}else{
					db.query("DELETE FROM components WHERE id=?",[component_id],function (err,result) {
						res.redirect("/channels/"+channel_id+"#home")
					})
				}
			})
		}
	})
})
*/
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


module.exports = router
