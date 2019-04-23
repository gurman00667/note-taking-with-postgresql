
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'namers' , password:'123'},
        {id: 2, username: 'namers1' , password:'123'},
        {id: 3, username: 'namers2' , password:'123'}
      ]);
    });
};
