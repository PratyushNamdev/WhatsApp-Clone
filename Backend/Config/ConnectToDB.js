const mongoose = require('mongoose');
const password = process.env.DB_PASSWORD;
async function main(){
    await mongoose.connect(`mongodb+srv://pratyushnamdev140:${password}@cluster0.eq7z7kg.mongodb.net/Whatsapp-Clone?retryWrites=true&w=majority`,
    ).then(()=>{
        console.log("Connected to the DB");
    }).catch((e)=>{
        console.log("Connection to the DB failed ! " + e);
    });
}
module.exports = main;




