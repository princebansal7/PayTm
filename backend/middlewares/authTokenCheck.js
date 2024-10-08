import { JWT_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const authTokenChecker = (req, res, next) => {
    const { authorization } = req.headers;
    console.log(authorization);

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).send("invalid user");
    }
    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            // console.log(req.userId);
            next();
        } else {
            res.status(403).json({
                msg: "wrong user",
            });
        }
    } catch (err) {
        res.status(403).json({
            msg: "wrong user",
            error: err,
        });
    }
};
