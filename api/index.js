//import core npm module
const express = require('express')
const cors = require('cors')
const path = require('path');
require('dotenv').config()

//setting env const
const PORT = process.env.PORT || 3000;

//setting express app
const app = express()
app.use(cors());

//setting express app
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.get("/api", (req,res) => {
    res.json({ message: "api is working"})
})

app.use('/images', express.static(path.join(__dirname, 'images')));

//adding routes
require('./routes/auth.routes')(app)
require('./routes/sauce.routes')(app)

//init mongoose
const db = require("./models")
const dbConfig = require("./config/db.config")
console.log(dbConfig)
db.mongoose
  .connect(`${dbConfig.STRING_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("api is connect to mongodb");
  })
  .catch(err => {
    console.error("api connection to mongodb error", err);
    process.exit();
  });

//open app on env PORT
app.listen(PORT, () => {
    console.log(`api is running ${PORT}`)
})