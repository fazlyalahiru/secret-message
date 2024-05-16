import mongoose, { Schema } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: [true, "message can not be null"]
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"],

    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true
    },
    messages: [messageSchema]
})


const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))


export default userModel; 