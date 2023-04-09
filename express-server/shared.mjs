import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function login(email, password) {
    console.log("User with email: (", email, ") trying to login...");
    let success = false;
    let message = "Unbekannter komischer Fehler...";

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(),
            }
        });

        if (!user) {
            message = "Dieser Nutzer ist uns nicht bekannt.";
            return { message, success }
        }

        if (!await bcrypt.compare(password, user.passwordHash)) {
            message = "Das Passwort stimmt nicht.";
            return { message, success }
        }

        const jwt = createJSONWebToken(user);
        success = true;
        message = "Erfolgreich angemeldet!";

        return { success, message, jwt }

    } catch (e) {
        console.log(e);
        return { success, message }
    }
}

function createJSONWebToken(user) {
    return Jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "672h",
        }
    );
}