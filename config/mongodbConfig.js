import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const mongodbConnection = () => {
    mongoose.connect(process.env.MONGO_URL)
}

export default mongodbConnection