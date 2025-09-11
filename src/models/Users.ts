import mongoose  , {Schema , Document} from "mongoose";

export interface Message extends Document{
    content : string , 
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema ({
    content : {
        type: String,
    },
    createdAt: {
        type: Date,
        default : Date.now()
    }

})

export interface User extends Document {
    username : string , 
    email : string, 
    password : string, 
    verificationCode : string , 
    verificationExpiry : Date, 
    isverified : boolean, 
    isAcceptingMessage: boolean, 
    message : [Message];
}


const UserSchema:Schema<User> = new Schema({
    username : {
        type : String, 
        required: [true , "Username is required"],
        unique: true,

    },
    email : {
        type: String , 
        required: true, 
        unique : true, 
        match:[/.+\@.+\..+/ ,  "Enter valid Email "  ],
    },

    password:{
        type:String , 
        required:true,
    },

    verificationCode:{
        type:String,
        required:true,

    },

    verificationExpiry:{
        type: Date,
        required:true,
    },

    isverified:{
        type:Boolean,
    },
    isAcceptingMessage:{
        type:Boolean,
    }, 
    message:[MessageSchema]
})


const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User" , UserSchema);
