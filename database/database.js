const mongoose=require("mongoose")
const connectionString="mongodb+srv://husenbasnet:eFlNHgLnepw7bYff@newcluster.omtrps1.mongodb.net/?retryWrites=true&w=majority"
async function connectToDatabase(){
    await mongoose.connect(connectionString);
    console.log("connected to database successfully")
}
module.exports=connectToDatabase