import jwt from 'jsonwebtoken'

export const jwtGenerator = (uid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      { uid },
      process.env.SECRET_SING as string,
      { expiresIn: '2h' },
      (err, token) => {
        if (err) reject(err)
        resolve(token as string)
      }
    )
  })
}
