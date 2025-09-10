import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token. Access denied.' });
    }

    req.userId = decoded.userId; // or `decoded._id`, depending on what you used
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};

export default isAuth;

