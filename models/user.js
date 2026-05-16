const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
// add validations to fields as needed, e.g. email format, password strength, etc.
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [4, 'First name must be at least 4 characters long'],
    maxlength: [100, 'First name cannot exceed 100 characters']
  },
  lastName: {
    type: String,
    required: true,
    minlength: [4, 'Last name must be at least 4 characters long'],
    maxlength: [100, 'Last name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        return validator.isEmail(value);    
      },
      message: 'Please enter a valid email address'
    }
  },
      // match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
      password: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        });
      },
      // match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
      
message: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol'
    }
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot exceed 120'],
    default: 18
  },
  photo: {
    type: String,
    default: 'https://www.pngkey.com/maxpic/u2q8r5t4i1t4o0q8/' // replace with actual default photo URL
  },
  about:{
    type: String,
    maxlength: [500, 'About section cannot exceed 500 characters'],
    default: 'default about description'
  },
  gender: {
  type: String,
  enum: {
    values: ['Male', 'Female', 'Other'],
    message: 'Please enter a valid gender from Male, Female, Other'
  },
  default: 'Other',
  
 },
},{timestamps: true});

// add getJwt method to userSchema to generate JWT token for authentication
userSchema.methods.getJwt = function() {
  const payload = { id: this._id };
  return jwt.sign(payload, "myjwtsecret", { expiresIn: '8h' });
}
// add validate password method to userSchema to compare provided password with stored encrypted password
userSchema.methods.validatePassword = function(passwordEnteredByUser) {
  return bcrypt.compare(passwordEnteredByUser, this.password);
};
module.exports = mongoose.model('User', userSchema);
