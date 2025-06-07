import mongoose from 'mongoose';

const connectDatabase = async () => {
    await mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB is connected to the host: ${con.connection.host} `)
    })
}

// module.exports = connectDatabase;
export default connectDatabase;
