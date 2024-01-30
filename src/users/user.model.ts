import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: addressSchema, // one to one
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
