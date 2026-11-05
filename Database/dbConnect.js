import mongoose from "mongoose"

const Db=async()=>{
    try {
        const URI=process.env.MONGO_URI;
        await mongoose.connect(URI);
        console.log("Mongo db is ready");
    } catch (error) {
        console.log("error in the database",error);
    }
}

export default Db;