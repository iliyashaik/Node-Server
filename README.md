Install packages 
-----------------
npm install

Start server
------------
node .

## Running Server

(NOTE: In windows use set instead of export)

		export NODE_ENV=development
		export DB_USER=postgres
		export DB_HOST=localhost
		export DB_NAME=mydb
		export DB_PASS=************
		export DB_PORT=5432
		export DB=postgres

## Sequelizer
	sequelize init:models

Remove "config.json" fron config folder and add "db.config.js" and add db credentials.
