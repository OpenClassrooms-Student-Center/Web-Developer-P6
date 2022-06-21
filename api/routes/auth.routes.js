const { middlewareSignup } = require("../middlewares")
const controller = require("../controllers/auth.controller")
module.exports = function(app) {
    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, *, Content-Type, Accept"
        )
        next()
    })
    app.post(
        "/api/auth/signup",
        /*[
            middlewareSignup.duplicateEmailChecker
        ],*/
        controller.signup
    )
    app.post("/api/auth/login", controller.signin)
}