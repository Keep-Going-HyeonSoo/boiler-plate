const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

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

app.listen(port, () => {
  console.log(`💟Example app listening at http://localhost:${port}`)
})
