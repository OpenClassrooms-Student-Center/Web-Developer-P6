const authToken = require('./auth.token')
const middlewareSignup = require('./middleware.signup')
const middlewareUpload = require('./middleware.upload')

module.exports = {
    authToken,
    middlewareSignup,
    middlewareUpload
}