import morgan from 'morgan'
import User from './models/User'
import config from './config'

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(morgan('tiny'))

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

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      user.comparePassword(req.body.password, (isMatch) => {
        if (isMatch) {
          res.json({ message: 'success', user })
        } else {
          res.json({ message: 'password not correct' })
        }
      })
    } else {
      return res.json({ message: '이메일이 존재하지 않습니다' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/register', (req, res) => {
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

app.listen(config.PORT, () => {
  console.log(`💟Example app listening at http://localhost:${config.PORT}`)
})
