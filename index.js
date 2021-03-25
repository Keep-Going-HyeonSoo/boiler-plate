import User from './models/User'

const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

mongoose
  .connect(
    'mongodb+srv://admin:1234@main.ur6bv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  )
  .then(() => console.log('😊mongoDB connected!'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
  console.log(req.body)
  const user = new User(req.body)

  user
    .save()
    .then((result) =>
      res.status(200).json({
        success: true,
        result
      })
    )
    .catch((err) =>
      res.status(500).json({
        success: false,
        err
      })
    )
})

app.listen(port, () => {
  console.log(`💟Example app listening at http://localhost:${port}`)
})
