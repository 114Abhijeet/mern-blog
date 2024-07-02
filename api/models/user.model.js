import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required:true,
    },
    profilePicture: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
// We don't allow anyone to change this isAdmin inside the frontened,it's not good for security purpose.Database is 
//protected by MongoDB 
      isAdmin: {
        type: Boolean,
        default: false,
      },
    }, {timestamps: true}
);
// If you use timestamps here then you see when you push the data in database during signup we get two more
//  additional attributes createdAt and UpdatedAt
const User = mongoose.model('User', userSchema);

export default User;