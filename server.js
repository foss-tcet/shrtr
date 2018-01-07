const express = require('express')

const app = express()

const gen = require('./routes/gen')

const db = require('./configs/db')

const SERVER_PORT = process.env.PORT || 3333

app.set('view engine', 'hbs')
app.set('views', 'templates')

app.use("/", express.static(__dirname + "/static"));

app.use('/includes', express.static(__dirname + '/includes'));

app.use('/g', gen)

function concatHTTP(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

app.get('/favicon.ico', function(req, res) {
    res.status(204);
})

app.get('/:url', (req, res, next) => {
    const db_query = "Select sh_url, url from shrtr_db_main where sh_url = " + db.escape(req.params.url)
    db.query(db_query, (error, results, fields) => {
        if (error){
            res.send(error)
            throw error
        }
        let url = results[0].url
        db.query("UPDATE shrtr_db_main SET accessed = accessed + 1 WHERE sh_url = " + db.escape(url), (error, results, fields) => {
            if (error){
                res.send(error)
                throw error
            }
            res.redirect(concatHTTP(url))
        })
    })
    
})

app.use((req, res, next) => {
    console.log("Throwing 404 Error for " +req.url)
    res.status('404')
    res.send("404 Error!")
})

app.listen(8080);