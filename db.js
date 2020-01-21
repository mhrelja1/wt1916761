const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19","root","",{host:"localhost",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

db.osoblje = sequelize.import(__dirname+'/osoblje.js');
db.rezervacija = sequelize.import(__dirname+'/rezervacija.js');
db.termin = sequelize.import(__dirname+'/termin.js');
db.sala = sequelize.import(__dirname+'/sala.js');

db.sala.belongsTo (db.osoblje, {foreign_key:'zaduzenaOsoba'});
db.rezervacija.belongsTo (db.termin, {foreign_key:'termin'});
db.osoblje.hasMany (db.rezervacija, {as:'RezervisalaOsoba', foreign_key:'osoba'});
db.sala.hasMany (db.rezervacija, {as:'RezervisanaSala', foreign_key:'sala'});


module.exports=db;