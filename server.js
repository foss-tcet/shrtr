const express = require('express')

const app = express()

// Homepage
app.use("/", express.static(__dirname + "/static"));

app.use('/includes', express.static(__dirname + '/includes'));

app.use((req, res, next) => {
    res.status('404')
    res.send("404 Error!")
})

app.listen(8080);