import mongoose from "mongoose";


interface ConnectionObject {
    isConnected?: number;
}


const connection: ConnectionObject = {}


const dbConnect = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("already connected to db");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        console.log(db, "db");
        console.log(db.connections, "db.connection");
        connection.isConnected = db.connections[0].readyState; 
        console.log("db connected ");
    } catch (error) {

    }
}

export default dbConnect; 