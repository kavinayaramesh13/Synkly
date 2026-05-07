const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token;

    // check token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // get token
            token = req.headers.authorization.split(" ")[1];

            // verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // attach user id
            req.user = decoded.id;

            next();

        } catch (error) {
            return res.status(401).json({
                message: "Not Authorized"
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "No Token"
        });
    }
};

module.exports = protect;