import products from '../data/products.json' assert { type: 'json' };
import Product from '../models/productModel.js';
import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';

dotenv.config({ path: `server/config/.env.${process.env.NODE_ENV}` });
connectDatabase();

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('Products deleted!')
        await Product.insertMany(products);
        console.log('All products added!');
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

seedProducts();