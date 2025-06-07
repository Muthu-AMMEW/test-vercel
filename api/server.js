import app from './app.js';
import connectDatabase from './config/database.js';
import { initializeGridFS } from './utils/gridfs/getStoredImage.js';
import { initializeProductGridFS } from './utils/gridfs/getStoredProductImage.js';
import { initializeUserGridFS } from './utils/gridfs/getStoredUserImage.js';

async function databaseConnections() {
    await connectDatabase();
    await initializeGridFS();
    await initializeUserGridFS();
    await initializeProductGridFS();
}
databaseConnections();

const server = app.listen(process.env.PORT, () => {
    console.log(`My Server listening to the port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
    console.log(`Local: http://localhost:${process.env.PORT}/`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Error: ${err}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(() => {
        process.exit(1);
    })
})

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Error: ${err}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(() => {
        process.exit(1);
    })
})



