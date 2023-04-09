import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function login(username, password) {
    console.log("User with Username: (", username, ") trying to login...");
    let success = false;
    let message = "Unbekannter komischer Fehler...";

    try {
        const user = await prisma.user.findUnique({
            where: {
                name: username
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

export async function register(email, username, password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    let success = false;
    let message = "Unknown Error";

    const userCount = await prisma.user.count({
        where: {
            OR: [
                {
                    email: email.toLowerCase(),
                },
                {
                    name: username.toLowerCase(),
                }
            ],
        }
    });

    if (userCount > 0) {
        message = "Choose another username and or E-Mail";
        return { success, message }
    }

    const result = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            name: username,
            passwordHash: encryptedPassword
        },
    });

    success = true;
    message = "That worked!";

    return { success, message };

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