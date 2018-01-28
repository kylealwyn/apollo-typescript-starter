exports.up = async knex =>
  knex.schema
    .createTable('authors', table => {
      table.increments('id');
      table.string('firstName');
      table.string('lastName');
    })
    .createTable('books', table => {
      table.increments('id');
      table.string('title');
      table
        .integer('authorId')
        .unsigned()
        .references('authors.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });

exports.down = async knex => knex.schema.dropTableIfExists('books').dropTableIfExists('authors');
