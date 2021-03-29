import User from '../models/User'

const isAuth = (req, res, next) => {
  // 클라이언트의 쿠키에서 토큰을 가져옴
  const token = req.cookies.x_auth

  // 토큰을 복호화한 후, 유저를 찾음
  User.findByToken(token, (err, user) => {
    if (err) throw err
    // 유저가 없으면 인증 실패
    if (!user) return res.json({ isAuth: false, error: true })

    // 유저가 존재하면 인증 성공
    req.token = token
    req.user = user
    next()
  })
}

export default isAuth
