import Jwt from 'jsonwebtoken';

async function verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token) {
        // then we dont have a token
        const userCount = await prisma.user.count();
        if (userCount > 0) {
            return res.status(401).json({ msg: "Kein Token..." });
        }
        // else...
        return next();
    }

    try {
        const decoded = Jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;

        return next();
    }
    catch (e) {
        console.log(e);
        return res.status(403).json({ msg: "Missing authority" });
    }
}

export { verifyToken }