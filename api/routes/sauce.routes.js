const { authToken, middlewareUpload } = require("../middlewares")
const controller = require("../controllers/sauce.controller")

module.exports = function(app) {
    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, *, Content-Type, Accept"
        )
        next()
    })
    app.post("/api/sauces", [authToken.verifyToken], middlewareUpload, controller.addsauces)
    app.post("/api/sauces/:id/like", [authToken.verifyToken], controller.likesauces)
    app.put("/api/sauces/:id", [authToken.verifyToken], middlewareUpload, controller.updatesauces)
    app.delete("/api/sauces/:id",[authToken.verifyToken], controller.deletesauces)
    app.get("/api/sauces/:id",[authToken.verifyToken], controller.onesauces)
    app.get("/api/sauces",[authToken.verifyToken], controller.allsauces)

}
