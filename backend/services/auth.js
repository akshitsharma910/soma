require("dotenv").config();
const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.SECRET_KEY || "chintu";




const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 


    if (!token) {
        req.user = null; 
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;  
        } else {
            req.user = user;
        }
        
        next();
    });
};

module.exports = { authenticateJWT };








// function authenticateJWT(req, res, next) {
//     const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//         return res.redirect("/user/login")
//     }

//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: "Forbidden: Invalid token" });
//         }

//         req.user = user; 
//         next();
//     });
// }