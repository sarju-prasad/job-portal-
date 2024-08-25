import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookie.token;
        if (!token) {
            return res.status(401).json({
                message: 'User is not Authenticated',
                success: false,
            })
        }
        const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);
        if (!tokenDecode) {
            return res.status(401).json({
                message: 'Token is not find',
                success: false,
            })
        }
        req.id = tokenDecode.userId;
        next();

    } catch (error) {
        console.log(`find the error when user authenticate ${error}`)
    }
}
export default isAuthenticated;