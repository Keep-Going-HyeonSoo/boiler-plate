import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const saltRounds = 10

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: {
    type: String
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashPW = await bcrypt.hash(this.password, saltRounds)
      this.password = hashPW
      next()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
})

const User = mongoose.model('User', userSchema)

export default User
