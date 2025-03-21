const MongoClient = require("mongodb").MongoClient;
dotenv.config();

let adminCollection;

const connecttoadminDatabase =async ()=>{
try{
 const client = await MongoClient.connect(process.env.Mongo_URL)
    const db = client.db('Rocubank-Admins')
    console.log("Database connected successfully")
    adminCollection = db.collection('admin')
 }
catch (error){
    console.error(error)
}
}

connecttoadminDatabase();




module.exports ={
    getAdminCollection: ()=> adminCollection
};