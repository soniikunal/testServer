import { connect, set } from 'mongoose';
import * as dotenv from 'dotenv' 
dotenv.config()

const url = process.env.MONGO_URL;
set('strictQuery', true)
connect(url)
.then(()=>console.log(`connected to mongodb on: ${url}`))
.catch((err) => {
    console.log(`ERROR: ${err}`)
});