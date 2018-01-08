const route = require('express').Router()

const db = require('../configs/db')

const hbs = require('handlebars')

const random = require('randomstring')

route.get('/:url(*)', (req, res, next) => {
    const db_query = "Select sh_url, url from shrtr_db_main where url = " + db.escape(req.params.url)
    db.query(db_query, (error, results, fields) => {
        if(error){
            res.send(error)
            throw error
        }
        if(results.length > 0)
        {
            function concatHTTP(url) {
                if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
                    url = "http://" + url;
                }
                return url;
            }

            data = {
                "url":concatHTTP(results[0].url), 
                "sh_url": results[0].sh_url, 
                "host": req.get('host'),
                "protocol": req.protocol
            }
            return res.render('gen', {data})
        }
        else
        {
            // Recursion 
            function addNewURL() {
                let url = req.params.url
                let newURL = random.generate(5)
                let u_query = "Insert into shrtr_db_main (sh_url, url) values ("+db.escape(newURL)+", "+db.escape(url)+")";   
                db.query(u_query, (error, results, fields) => {
                    if (error) {
            
                        if (error.code !== 'ER_DUP_ENTRY')
                            throw error
                        return addNewURL();
                    }
                    else {
                        function concatHTTP(url) {
                            if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
                                url = "http://" + url;
                            }
                            return url;
                        }

                        data = {
                            "url":concatHTTP(url), 
                            "sh_url": newURL, 
                            "host": req.get('host'),
                            "protocol": req.protocol
                        }
                        return res.render('gen', {data})
                    }
            
                })
            }
            addNewURL();
            /*
            Not Working, using Recursion instead
            let unique = true
            while(unique)
            {
                let newURL = random.generate(5)
                let u_query = "Insert into shrtr_db_main (sh_url, url) values ("+db.escape(newURL)+", "+db.escape(req.params.url)+")";
                db.query(u_query, (error, results, fields) => {
                    if(error)
                    {
                        if(error.code === 'ER_DUP_ENTRY')
                        {           
                        }
                        else
                            throw error
                    }
                    else
                    {   break
                        res.send("Shorted URL : "+newURL)
                    }
                })
                
            }*/
        }
    })
})

module.exports = route