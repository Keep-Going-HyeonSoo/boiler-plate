import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
  } else {
    next()
  }
})

userSchema.methods.comparePassword = async function (plainPassword, cb) {
  try {
    const result = await bcrypt.compare(plainPassword, this.password)
    cb(result)
  } catch (error) {
    console.log(error)
  }
}

userSchema.methods.generateToken = async function (cb) {
  // console.log('this', this._id.toHexString())
  // this.id 로 하면 안되고, this._id 로 해야 한다.

  // json web token 을 이용해서 token 을 생성하기

  // token 은 this.id (user.id) + 'secretKey' 가 합쳐져서 생성된다.
  // 나중에 'secretKey' 를 이용해서 token 을 decode 하면 user.id 를 얻게 된다.
  const token = jwt.sign(this._id.toHexString(), 'secretKey')
  this.token = token
  try {
    const user = await this.save()
    cb(null, user)
  } catch (error) {
    cb(error)
  }
}

const User = mongoose.model('User', userSchema)

export default User
