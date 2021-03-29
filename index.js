import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import User from './models/User'
import config from './config'
import isAuth from './middleware/auth'

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(morgan('tiny'))
app.use(cookieParser())

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('😊mongoDB connected!'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/login', async (req, res) => {
  try {
    // 입력받은 email 로 DB에서 사용자 검색
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      // comparePassword() : user document instance method
      user.comparePassword(req.body.password, (isMatch) => {
        if (isMatch) {
          // 비밀번호까지 맞다면, token 을 생성해주기
          user.generateToken((err, user) => {
            if (err) return res.status(400).json({ message: err })

            // 브라우저에 token 을 저장시켜야함 (서버쪽 token은 user DB에 있음)
            // token 은 쿠키, 로컬스토리지, 세션스토리지 등에 저장할 수 있지만, 일단은 쿠키 방식으로 해보자.
            res
              .cookie('x_auth', user.token)
              .status(200)
              .json({ message: 'Token generated', userId: user.id })
          })
        } else {
          res.status(400).json({ message: 'password not correct' })
        }
      })
    }
    // 사용자가 존재하지 않을 때
    else {
      return res.status(400).json({ message: '이메일이 존재하지 않습니다' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/api/users/register', (req, res) => {
  console.log(req.body)
  const user = new User(req.body)

  user
    .save()
    .then((result) =>
      res.status(200).json({
        message: 'register success',
        result
      })
    )
    .catch((err) =>
      res.status(500).json({
        message: 'register failed',
        err
      })
    )
})

app.get('/api/users/auth', isAuth, (req, res) => {
  res.status(200).json(req.user)
})

app.listen(config.PORT, () => {
  console.log(`💟Example app listening at http://localhost:${config.PORT}`)
})
