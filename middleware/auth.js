const privateKey = 'BJ8Hf0HBm%y%6h2'

const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization;
        if(token) {
            const decoded = jwt.verify(token, privateKey);
            if(decoded){
                req.headers["email"] = decoded.email;
                return next();
            }
        }
    } catch(e){ 
        console.log(e)
        return res.status(401).json({message: 'Что-то не так с токеном'});
    }
    return next();
}