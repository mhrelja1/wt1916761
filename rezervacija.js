const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Rezervacija = sequelize.define("rezervacija",{

        //termin:Sequelize.INTEGER,
        //sala:Sequelize.INTEGER,
		//osoba:Sequelize.INTEGER
    })
    return Rezervacija;
};