import mongoose,{Schema} from "mongoose";

const askSchema=new Schema({

    ask:{
        type:String,
        require:true
    },
    answer:{
        type:String,
        require:true,
    },
    duration:{
        type:Number,
        require:true,
    }

})

const askModel=mongoose.model("ask",askSchema);

export default askModel;