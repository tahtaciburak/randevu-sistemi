var express = require("express")
var router = express.Router()
var db = require("../config/db.js")
var crypto = require("crypto")

router.get("/",function (req,res) {
    res.render("user_index.ejs",{
        user : getSecureUserInfo(req.user)
    })

})
router.get("/take",function (req,res) {
    res.render("user_take.ejs",{
        user : getSecureUserInfo(req.user)
    })

})
router.get("/give",function (req,res) {
    res.render("user_give.ejs",{
        user : getSecureUserInfo(req.user)
    })

})
router.get("/calendar",function (req,res) {
    res.render("user_calendar.ejs",{
        user : getSecureUserInfo(req.user)
    })

})

router.get('/appointments/detail/:appointment_id',isLoggedIn,function(req,res){
    let appointment_id =req.params.appointment_id;
    res.render("appointment_detail.ejs",{
        user : getSecureUserInfo(req.user),
        a : appointment_id
    })
  })

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}
// Delete user password from user object
function getSecureUserInfo(user){
	if (user)  delete user.Password;
    return user;
}


module.exports = router;