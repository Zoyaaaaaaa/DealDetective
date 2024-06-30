import mongoose from 'mongoose';

let isConnected = false;// Variable to track the connection status
const MONGODB_URI= 'mongodb+srv://aliaenterprises26:zrDfoo5rUUNUjz01@cluster0.egmc5yj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);
 await mongoose.connect(MONGODB_URI);
  if(!MONGODB_URI) return console.log('MONGODB_URI is not defined');

  if(isConnected) return console.log('=> using existing database connection');

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error)
  }
}

