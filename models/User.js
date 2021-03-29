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
  const token = jwt.sign(this._id.toHexString(), 'abcd')
  this.token = token
  try {
    const user = await this.save()
    cb(null, user)
  } catch (error) {
    cb(error)
  }
}

userSchema.statics.findByToken = function (token, cb) {
  const user = this
  jwt.verify(token, 'abcd', function (err, decoded) {
    // token 을 'abcd' key 를 이용해서 decode 한다.
    // decode의 결과값인 decoded 값은 user 의 id 임
    // 유저 아이디를 이용해서 유저를 찾기
    user.findOne({ _id: decoded, token }, function (err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
    // 클라에서 가져온 token 과 DB에 저장돼있는 토큰을 비교
  })
}

const User = mongoose.model('User', userSchema)

export default User
