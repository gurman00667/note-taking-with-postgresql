var fs = require('fs')
var path = require('path')

function myAuthorizer(knex){
    // fs.readFile(__dirname+path.sep+"users.json",'utf-8' ,(err,data)=>{
        // console.log(users)

        // return (username, password)=>{
        //             return users.username == username && users.password == password;

        // }
        return  function (username, password, cb) {
            let query = knex.select('username')
                .from('users')
                .where('username', username)
                .where('password', password);
    
              query.then((rows) =>{
                    console.log(rows)
                    if(rows.length === 1 ) {
                         cb(null, true);
                        //we have found the user with this username and password.
    
                    } else {
                        cb(null, false);
                        //no such user....
                    }
                }).catch((error)=>{
                    console.log(error);
                })
        }

   // })

   

}

module.exports.myAuthorizer = myAuthorizer;