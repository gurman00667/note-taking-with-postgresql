class NoteService {
    constructor(knex){
        this.knex = knex;
    }

    add(note, user){
        let query = this.knex
            .select('id')
            .from('users')
            .where('users.username', user);

                return query.then((rows)=>{
                    if(rows.length === 1){
                        return this.knex.insert({
                            content: note,
                            user_id: rows[0].id
                        }).into('notes');
                    } else {
                        throw new Error (`Cannot add a note to a user that doesn't exist!`);
                    }
                });
    };

    list(user){
        if(typeof user !== 'undefined'){
            let query = this.knex.select('notes.id', 'notes.content')
                .from('notes')
                .innerJoin('users', 'notes.user_id', 'users.id')
                .where('users.username', user)
                .orderBy('notes.id', 'asc')

                    return query.then((rows)=>{
                        console.log(rows, 'pp');
                        return rows.map(row => ({
                            id: row.id,
                            content: row.content
                        }));
                    });
        } else {
            let query = this.knex.select('users.username', 'notes.id', 'content')
                .from('notes')
                .innerJoin('users', 'notes.user_id', 'users.id');
                
                    return query.then((rows)=>{
                        console.log(rows)
                        const result = {};
                        rows.forEach(row => {
                            if(typeof result[row.username] === 'undefined'){
                                result[row.username] = [];
                            }
                            result[row.username].push({
                                id: row.id,
                                content: row.content
                            });
                        });
                        return result;
                    });
        }
    }

    update(id, note, user){
        let query = this.knex
            .select('id')
            .from('users')
            .where('users.username', user);

                return query.then((rows =>{
                    if(rows.length === 1){
                        return this.knex('notes')
                            .where('id', id)
                            .update({
                                content: note
                            });
                    } else {
                        throw new Error(`Cannot update a note if the user doesn't exist!`)
                    }
                }));
    };

    remove(id, user){
        let query = this.knex  
            .select('id')
            .from('users')
            .where('users.username', user);

                return query.then((rows)=>{
                    if(rows.length === 1){
                        return this.knex('notes')
                            .where('id', id)
                            .del()
                    } else {
                        throw new Error (`Cannot remove a note when the user doesn't exist!`)
                    }
                });
    };
};

module.exports = NoteService;

// const fs = require('fs');

// class NoteService {
//     constructor(knex){
//         this.knex = knex;
//         this.initPromise = null;

//         this.init()
//     }

//     init(){
//         if (this.initPromise === null){
//             this.initPromise = new Promise ((resolve, reject)=> {
//                 this.read()
//                     .then(()=>{
//                         resolve();
//                     })
//                     .catch(()=>{
//                         this.notes = {};
//                         this.write()
//                             .then(resolve)
//                             .catch(reject);
//                     });
//             });
//         }
//         return this.initPromise;
//     }

//     read(){
//         return new Promise ((resolve, reject)=>{
//             fs.readFile(this.knex, 'utf-8', (err, data)=>{
//                 if(err){
//                     reject(err)
//                 }
//                 try{
//                     this.notes = JSON.parse(data);
//                 } catch (e) {
//                     return reject(e)
//                 }
//                 return resolve(this.notes);
//             });
//         });

//     }

//     write(){
//         return new Promise((resolve, reject) => {
//             fs.writeFile(this.knex, JSON.stringify(this.notes), (err)=>{
//                 if(err){
//                     return reject(err);
//                 }
//                 resolve(this.notes);
//             });
//         });
//     }

//     list(user){
//         if(typeof user !== 'undefined'){
//             return this.init()
//                 .then(()=> this.read())
//                 .then(()=>{
//                     if(typeof this.notes[user] === 'undefined'){
//                         return [];
//                     } else {
//                         return this.notes[user];
//                     }
//                 });
//         } else {
//             return this.init().then(()=>{
//                 return this.read();
//             });
//         }
//     };

//     add(note, user){
//         return this.init().then(() => {
//             if(typeof this.notes[user] === 'undefined'){
//                 this.notes[user] = [];
//             }
//             this.notes[user].push(note);
//             return this.write();
//         });
//     };

//     update(index, note, user){
//         return this.init().then(()=>{
//             if(typeof this.notes[user] === 'undefined'){
//                 throw new Error("Cannot update a note, if the user doesn't exist");
//             }
//             if(this.notes[user].length <= index ){
//                 throw new Error("Cannot update a note that doesn't exist");
//             }
//             this.notes[user][index] = note
//             return this.write();
//         });
//     }

//     remove(index, user){
//         return this.init().then(()=>{
//             if(typeof this.notes[user] === 'undefined'){
//                 throw new Error("Cannot remove a note, if the user doesn't exist");
//             }
//             if(this.notes[user].length <= index){
//                 throw new Error("Cannot remove a note that doesn't exist");
//             }
//             this.notes[user].splice(index, 1);
//             return this.write();
//         });
//     }
// }

// module.exports = NoteService;