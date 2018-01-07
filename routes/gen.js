const route = require('express').Router()

const db = require('../configs/db')

const random = require('randomstring')

route.get('/:protocol//:url', (req, res, next) => {
    const db_query = "Select sh_url, url from shrtr_db_main where url = " + db.escape(req.params.url)
    db.query(db_query, (error, results, fields) => {
        if(error){
            res.send(error)
            throw error
        }
        if(results.length > 0)
            res.send("The Short URL Exist for this URL : localhost/" +results[0].sh_url)
        else
        {
            // Recursion 
            function addNewURL() {
                let url = undefined
                if(req.params.protocol !== "http:" || req.params.protocol !== "https:")
                    url = req.params.protocol + "//" + req.params.url
                else
                    url = req.params.url
                let newURL = random.generate(5)
                let u_query = "Insert into shrtr_db_main (sh_url, url) values ("+db.escape(newURL)+", "+db.escape(url)+")";   
                db.query(u_query, (error, results, fields) => {
                    if (error) {
            
                        if (error.code !== 'ER_DUP_ENTRY')
                            throw error
                        return addNewURL();
                    }
                    else {
            
                        return res.send("Shorted URL : "+newURL) // to stop execution
                    }
            
                })
            }
            addNewURL();
        }
    })
})

route.get('/:url', (req, res, next) => {
    const db_query = "Select sh_url, url from shrtr_db_main where url = " + db.escape(req.params.url)
    db.query(db_query, (error, results, fields) => {
        if(error){
            res.send(error)
            throw error
        }
        if(results.length > 0)
            res.send("The Short URL Exist for this URL : localhost/" +results[0].sh_url)
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
            
                        return res.send("Shorted URL : "+newURL) // to stop execution
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