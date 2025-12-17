import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import otplib from 'otplib'; 
import { createClient } from 'redis';
import nodemailer from 'nodemailer';
import { text } from 'stream/consumers';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import stream from 'stream';

const pipeline = promisify(stream.pipeline);

export async function me (request, reply) {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
        return reply.code(401).send({ success: false, message: "No token provided" });
    }
    try {
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE access_token = ?")
            .get(token);
        if (!user) {
            return reply.code(401).send({ success: false, message: "Invalid token" });
        }
        const { password, ...safeUser } = user;
        return reply.code(200).send(safeUser);
    } catch (error) {
        console.error("Error fetching user info:", error);
        return reply.code(500).send({ success: false, message: "Error fetching user info" });
    }
}
//leaderboard
export async function leaderboard(request, reply) {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        const offset = (page - 1) * limit;
        const leaderboardUsers = request.server.db
            .prepare("SELECT username, profile_img, xp FROM users ORDER BY xp DESC LIMIT ? OFFSET ?")
            .all(limit, offset);

        return reply.code(200).send({ success: true, leaderboard: leaderboardUsers });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return reply.code(500).send({ success: false, message: "Error fetching leaderboard" });
    }
}

export function generateToken(username, email, id_user) {
    if (!username || !email || !id_user) {
        throw new Error("Username, email, and user ID are required to generate token");
    }

    const payload = { username, email, id_user };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    // console.log(" >> Token generated successfully for user:", username, email, id_user);
    return token;
}

// Helper function to hash passwords
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// ====== USER MANAGEMENT ======
// add new user
export async function AddUser(request, reply) {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
        return reply.code(400).send({ 
            success: false, 
            message: "Missing required fields" 
        });
    }

    try {
        const userExists = request.server.db
            .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
            .get(username, email);

        if (userExists) {
            return reply.code(409).send({ 
                success: false, 
                message: "Username or email already exists" 
            });
        }

        const hashedPassword = await hashPassword(password);
        const query = request.server.db
            .prepare("INSERT INTO users (username, fullname, email, password, profile_img) VALUES (?, ?, ?, ?, ?)");
        const result = query.run(username, username, email, hashedPassword, DEFAULT_PROFILE_IMAGE);

        return reply.code(201).send({
            success: true,
            message: "User created successfully",
            userId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("Error adding user:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Error adding user"
        });
    }
}
// delete user
export async function DeleteUserById(request, reply) {
    const { id } = request.params;
    try {
        const result = request.server.db
            .prepare("DELETE FROM users WHERE id_user = ?")
            .run(id);
        if (result.changes === 0) {
            return reply.code(404).send({ message: "User not found" });
        }
        return reply.code(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return reply.code(500).send({
            message: "Error deleting user"
        });
    }
}
//  settings update user info
export async function updateUserInfo(request, reply) {
    const id_user = request.user.id_user;
    
    if (!id_user) {
        return reply.code(400).send({
            success: false,
            message: "Missing user ID"
        });
    }

    let profileImgPath = null; 
    const formData = {};
    
    try {
        const parts = request.parts();
        for await (const part of parts) {
            if (part.type === 'file') {
                if (part.filename) { 
                    const uniqueFilename = `${Date.now()}-${part.filename.replace(/\s/g, '_')}`;
                    const savePath = path.join(process.cwd(), 'uploads', uniqueFilename);
                    const writeStream = fs.createWriteStream(savePath);
                    await pipeline(part.file, writeStream);
                    profileImgPath = `/uploads/${uniqueFilename}`;
                    console.log(`File saved: ${profileImgPath}`);
                }
            } else {
                formData[part.fieldname] = part.value;
            }
        }
        
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE id_user = ?")
            .get(id_user);
        
        if (!user) {
            return reply.code(404).send({
                success: false,
                message: "User not found"
            });
        }

        const updatedUser = {
            profile_img: profileImgPath || user.profile_img, 
            username: formData.username || user.username,
            fullname: formData.fullname || user.fullname,
            email: formData.email || user.email,
            languages: formData.languages || user.languages,
            bio: formData.bio || user.bio
        };
        
        const userExists = request.server.db
            .prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND id_user != ?")
            .get(updatedUser.username, updatedUser.email, id_user);
        
        if (userExists) {
            if (profileImgPath) {
                const newPath = path.join(process.cwd(), profileImgPath);
                fs.unlink(newPath, (err) => {
                    if (err) console.error("Error deleting conflicting upload:", newPath, err);
                });
            }
            return reply.code(409).send({ 
                success: false, 
                message: "Username or email already exists" 
            });
        }
        
        if (profileImgPath && user.profile_img && user.profile_img !== process.env.DEFAULT_PROFILE_IMAGE) {
            const oldPath = path.join(process.cwd(), user.profile_img);
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {
                    if (err) console.error("Failed to delete old image:", oldPath, err);
                    else console.log("Deleted old image:", oldPath);
                });
            }
        }

        const query = request.server.db
            .prepare(`UPDATE users SET 
                profile_img = ?, 
                username = ?, 
                fullname = ?, 
                email = ?, 
                languages = ?, 
                bio = ? 
                WHERE id_user = ?`);
        query.run(
            updatedUser.profile_img,
            updatedUser.username,
            updatedUser.fullname,
            updatedUser.email,
            updatedUser.languages,
            updatedUser.bio,
            id_user
        );

        return reply.code(200).send({
            success: true,
            message: "User updated successfully",
            user: { ...updatedUser }
        });

    } catch (error) {
        console.error("Error updating user:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Error updating user"
        });
    }
}
//  settings update user password
export async function updateUserPassword(request, reply) {
    const id_user = request.user.id_user;
    if (!id_user) {
        return reply.code(400).send({
            success: false,
            message: "Missing user ID"
        });
    }
    const { current_password, new_password } = request.body;
    // console.log("updateUserPassword called with:", { id_user, current_password, new_password });
    
    if (!current_password || !new_password) {
        return reply.code(400).send({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE id_user = ?")
            .get(id_user);

        if (!user) {
            return reply.code(404).send({ 
                success: false, 
                message: "User not found" 
            });
        }

        const isPasswordValid = await bcrypt.compare(current_password, user.password);
        
        if (!isPasswordValid) {
            return reply.code(401).send({ 
                success: false, 
                message: "Current password is incorrect" 
            });
        }

        const hashedNewPassword = await hashPassword(new_password);
        request.server.db
            .prepare("UPDATE users SET password = ? WHERE id_user = ?")
            .run(hashedNewPassword, id_user); 

        return reply.code(200).send({ 
            success: true,
            message: "Password updated successfully" 
        });

    } catch (error) {
        console.error("Error updating password:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Error updating password"
        });
    }
}
//settings update2FA 
export async function update2FA(request, reply) {
    const { twofa } = request.body;
    const id_user = request.user.id_user;
    
    if (typeof id_user === 'undefined' || typeof twofa === 'undefined') {
        return reply.code(400).send({
            success: false,
            message: "Missing required fields"
        });
    }

    if (twofa) {
        return reply.code(400).send({
            success: false,
            message: "Error: To enable 2FA, try the setup flow instead."
        });
    }

    try {
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE id_user = ?")
            .get(id_user);

        if (!user) {
            return reply.code(404).send({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Set to 0 (false) and clear the secret
        request.server.db
            .prepare("UPDATE users SET twofa_enabled = 0, twoFA_secret = NULL WHERE id_user = ?")
            .run(id_user);

        return reply.code(200).send({ 
            success: true,
            message: "2FA setting updated successfully" 
        });

    } catch (error) {
        console.error("Error updating 2FA setting:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Error updating 2FA setting"
        });
    }
}

// ====== 2FA SETUP ======
// Generate Secret & OTP URL
export async function generate2FA(request, reply) {
    const { id_user, email } = request.user;

    try {
        const secret = otplib.authenticator.generateSecret();
        const otpauth = otplib.authenticator.keyuri(email, process.env.ISSUER_NAME, secret);
        request.server.db
            .prepare("UPDATE users SET twoFA_secret = ? WHERE id_user = ?")
            .run(secret, id_user);

        return reply.code(200).send({ success: true, otpauth });

    } catch (error) {
        console.error("Error in generate2FA:", error);
        return reply.code(500).send({ success: false, message: "Error generating 2FA secret" });
    }
}
// Verify Token & Enable 2FA
export async function verifyAndEnable2FA(request, reply) {
    const { token } = request.body; // The 6-digit code
    const { id_user } = request.user;

    if (!token) {
        return reply.code(400).send({ success: false, message: "Code is required." });
    }

    try {
        const user = request.server.db
            .prepare("SELECT twoFA_secret FROM users WHERE id_user = ?")
            .get(id_user);

        if (!user || !user.twoFA_secret) {
            return reply.code(400).send({ success: false, message: "No 2FA secret found. Please start over." });
        }

        const isValid = otplib.authenticator.check(token, user.twoFA_secret);

        if (isValid) {
            request.server.db
                .prepare("UPDATE users SET twoFA_enabled = 1 WHERE id_user = ?")
                .run(id_user);
            
            return reply.code(200).send({ success: true, message: "2FA enabled successfully." });
        } else {
            return reply.code(400).send({ success: false, message: "Invalid verification code. Please try again." });
        }

    } catch (error) {
        console.error("Error in verifyAndEnable2FA:", error);
        return reply.code(500).send({ success: false, message: "Error verifying 2FA token" });
    }
}
// LOGIN
export async function login(request, reply) {
    const { username, password } = request.body;
    
    if (!username || !password) {
        return reply.code(400).send({ 
            success: false, 
            message: "Missing required fields" 
        });
    }
    try {
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE username = ?")
            .get(username);
        
        if (!user) {
            return reply.code(401).send({ 
                success: false, 
                message: "Invalid username or password" 
            });
        }
        if (user.auth_method !== 0) {
            return reply.code(400).send({ 
                success: false, 
                message: "Use OAuth to log in" 
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return reply.code(401).send({ 
                success: false, 
                message: "Invalid username or password"
            });
        }

        if (user.twoFA_enabled) {
            return reply.code(200).send({
                success: true,
                twoFA_required: true,
                userId: user.id_user 
            });
        }
        const token = generateToken(user.username, user.email, user.id_user);
        
        const { password: _, twoFA_secret: __, ...userWithoutPassword } = user;
        request.server.db
            .prepare("UPDATE users SET access_token = ? , WHERE id_user = ?")
            .run(token, user.id_user);
        
        userWithoutPassword.access_token = token;

        return reply.code(200).send({ 
            success: true, 
            message: "Login successful",
            user: userWithoutPassword,
            token: token,
        });

    } catch (error) {
        console.error("Error during login:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Internal server error"
        });
    }
}

// Verify 2FA code during LOGIN
export async function loginVerify2FA(request, reply) {
    const { userId, token } = request.body; // 6-digit code

    if (!userId || !token) {
        return reply.code(400).send({ success: false, message: "User ID and token are required." });
    }

    try {
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE id_user = ?")
            .get(userId);

        if (!user || !user.twoFA_secret || !user.twoFA_enabled) {
            return reply.code(401).send({ success: false, message: "2FA not enabled or user not found." });
        }

        const isValid = otplib.authenticator.check(token, user.twoFA_secret);

        if (!isValid) {
            return reply.code(401).send({ success: false, message: "Invalid 2FA code." });
        }
        const accessToken = generateToken(user.username, user.email, user.id_user);
        
        const { password: _, twoFA_secret: __, ...userWithoutPassword } = user;
        
        request.server.db
            .prepare("UPDATE users SET access_token = ? , WHERE id_user = ?")
            .run(accessToken, user.id_user);
        
        userWithoutPassword.access_token = accessToken;

        return reply.code(200).send({ 
            success: true, 
            message: "Login successful",
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Error in loginVerify2FA:", error);
        return reply.code(500).send({ success: false, message: "Error verifying 2FA token" });
    }
}

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});
// send email with nodemailer of the verification code
async function sendVerificationCode(userEmail, code) {
  const mailOptions = {
    from: `ft_transcendence_42 Support`,
    to: userEmail,
    subject: 'Your Verification Code', 
    html  : `   <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Password Recovery</title>
                <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700;800&display=swap" rel="stylesheet" />
                <style>
                    body {
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    font-family: 'Fira Sans', Arial, Helvetica, sans-serif;
                    color: #2D3A41;
                    -webkit-font-smoothing: antialiased;
                    }
                    .container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0,0,0,0.08);
                    }
                    .header {
                    background-color: #1B1B1B;
                    text-align: center;
                    padding: 40px 20px;
                    }
                    .header span {
                    color: #40be65;
                    font-weight: 500;
                    font-size: 14px;
                    display: block;
                    margin-bottom: 10px;
                    }
                    .header h1 {
                    color: #ffffff;
                    font-weight: 800;
                    font-size: 32px;
                    margin: 0;
                    }
                    .content {
                    padding: 40px 30px;
                    text-align: center;
                    }
                    .content p {
                    color: #555555;
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0 0 20px;
                    }
                    .code-box {
                    background-color: #f4f4f4;
                    display: inline-block;
                    padding: 15px 25px;
                    font-size: 24px;
                    font-weight: 800;
                    color: #c83434;
                    border-radius: 6px;
                    letter-spacing: 2px;
                    margin: 10px 0 25px;
                    }
                    .footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 13px;
                    color: #888888;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">
                    <span>Support</span>
                    <h1>Recover Your Account</h1>
                    </div>
                    <div class="content">
                    <p>Salam Allah Alaykom,</p>
                    <p>We received a request to reset your password for the account:</p>
                    <p>Enter the following verification code to proceed. This code is valid for <strong>60 seconds</strong>:</p>
                    <div class="code-box">${code}</div>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Thanks,<br><strong>The ft_transcendence_42 Team</strong></p>
                    </div>
                    <div class="footer">
                    <p>© 2025 ft_transcendence_42. All rights reserved.</p>
                    </div>
                </div>
                </body>
                </html>` 
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    return { success: true, message: 'Code sent!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send code.' };
  }
}

// password reset steps
export async function forgotPassword(request, reply) {
    const { email } = request.body;
    const redis = request.server.redis;

    if (!email) {
        return reply.code(400).send({ success: false, message: "Email is required." });
    }

    try {
        const authMethod = request.server.db.prepare("SELECT auth_method FROM users WHERE email = ?").get(email);
        if (!authMethod || authMethod.auth_method !== 0) {
            return reply.code(400).send(
                {
                    success: false, 
                    message: "Password reset is only available for standard authentication users. Use OAuth to log in."
                }
            );
        }
        const user = request.server.db.prepare("SELECT username FROM users WHERE email = ?").get(email);
        if (!user) {
            return reply.code(200).send(
                {
                    success: true, 
                    message: "This email does not exist in our databases. :("
                }
            );
        }

        
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`reset:${email}`, code, { EX: 120 });

        sendVerificationCode(email, code);
        return reply.code(200).send({ success: true, message: "A verification code has been sent to your email." });

    } catch (error) {
        console.error("Error in sendVerificationCode:", error.text || error);
        return reply.code(500).send({ success: false, message: "Failed to send verification code." });
    }
}

// Verify the Code and Create a Temporary Token
export async function verifyCode(request, reply) {
    const { email, code } = request.body;
    const redis = request.server.redis;

    if (!email || !code) {
        return reply.code(400).send({ success: false, message: "Email and code are required." });
    }

    try {
        const redisKey = `reset:${email}`;
        const storedCode = await redis.get(redisKey);

        if (!storedCode || storedCode !== code) {
            return reply.code(400).send({ success: false, message: "Invalid or expired code." });
        }
        await redis.del(redisKey);
        const user = request.server.db.prepare("SELECT id_user, username, email FROM users WHERE email = ?").get(email);
        const resetToken = jwt.sign(
            { id_user: user.id_user, email: user.email, purpose: 'password-reset' },
            SECRET,
            { expiresIn: '5m' }
        );

        return reply.code(200).send({ success: true, message: "Code verified.", resetToken: resetToken });

    } catch (error) {
        console.error("Error in verifyCode:", error);
        return reply.code(500).send({ success: false, message: "An error occurred during code verification." });
    }
}

// Reset the Password Using the generated 5 min Token
export async function resetPasswordWithToken(request, reply) {
    const { resetToken, newPassword } = request.body;

    if (!resetToken || !newPassword) {
        return reply.code(400).send({ success: false, message: "Token and new password are required." });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        if (decoded.purpose !== 'password-reset') {
            return reply.code(401).send({ success: false, message: "Invalid token purpose." });
        }

        const hashedPassword = await hashPassword(newPassword);

        const result = request.server.db
            .prepare("UPDATE users SET password = ? WHERE id_user = ?")
            .run(hashedPassword, decoded.id_user);

        if (result.changes === 0) {
            return reply.code(404).send({ success: false, message: "User not found." });
        }

        return reply.code(200).send({ success: true, message: "Password has been reset successfully." });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return reply.code(401).send({ success: false, message: "Invalid or expired token." });
        }
        console.error("Error in resetPasswordWithToken:", error);
        return reply.code(500).send({ success: false, message: "An error occurred while resetting the password." });
    }
}

// ====== GOOGLE OAUTH ======
export async function InitiateGoogleAuth(request, reply) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
    
    return reply.redirect(googleAuthUrl);
}

export async function GoogleAuth(request, reply) {
    const { code } = request.query;
   
    if (!code) {
        return reply.redirect(`${process.env.FRONTEND_URL}/signIn?error=no_code`);
    }
    try {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
        });
        const tokens = await tokenResponse.json();
        if (!tokens.access_token) {
            throw new Error('Failed to obtain access token');
        }
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const googleUser = await userResponse.json();

        let user = request.server.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(googleUser.email);

        let userId;
        let isNewUser = false;

        if (user) {
            // Existing user
            userId = user.id_user;
        } else {
            // New user
            const insertQuery = request.server.db
                .prepare("INSERT INTO users (username, fullname, email, profile_img, auth_method) VALUES (?, ?, ?, ?, ?)");
            const result = insertQuery.run(
                googleUser.name.split(" ")[0] + Math.floor(Math.random() * 1000),
                googleUser.name,
                googleUser.email,
                googleUser.picture.replace('=s96-c', '=s600-c'),
                1,
            );
            userId = result.lastInsertRowid;
            isNewUser = true;
            user = request.server.db.prepare("SELECT * FROM users WHERE id_user = ?").get(userId);
        }
    
        if (user.twoFA_enabled) {
            return reply.redirect(`${process.env.FRONTEND_URL}/signIn?2fa_required=true&userId=${userId}`);
        }
        const token = generateToken(user.username, user.email, user.id_user);
        request.server.db
            .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
            .run(token, userId);

        return reply.redirect(`${process.env.FRONTEND_URL}/signIn?googleAuth=success&userId=${userId}&isNewUser=${isNewUser}&token=${token}`);

    } catch (error) {
        console.error('Google auth failed:', error);
        return reply.redirect(`${process.env.FRONTEND_URL}/signIn?error=auth_failed`);
    }
}

// ====== 42 OAUTH ======
export async function Initiate42Auth(request, reply) {
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.OAUTH42_UID}&redirect_uri=${process.env.OAUTH42_CALLBACK_URL}&response_type=code`;
    return reply.redirect(authUrl);
}

export async function FortyTwoAuth(request, reply) {
    const { code } = request.query;
    
    if (!code) {
        return reply.redirect(`${process.env.FRONTEND_URL}/signIn?error=no_code`);
    }

    try {
        const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.OAUTH42_UID,
                client_secret: process.env.OAUTH42_SECRET,
                code,
                redirect_uri: process.env.OAUTH42_CALLBACK_URL,
            }),
        });
        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            throw new Error('Failed to obtain access token');
        }
        const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const fortyTwoUser = await userResponse.json();

        // Check if user already exists
        let user = request.server.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(fortyTwoUser.email);

        let userId;
        let isNewUser = false;

        if (user) {
            // User exists
            userId = user.id_user;
        } else {
            // New user
            const insertQuery = request.server.db
                .prepare("INSERT INTO users (username, fullname, email, profile_img, auth_method) VALUES (?, ?, ?, ?, ?)");
            const result = insertQuery.run(
                fortyTwoUser.login,
                fortyTwoUser.displayname,
                fortyTwoUser.email,
                fortyTwoUser.image.link,
                2,
            );
            userId = result.lastInsertRowid;
            isNewUser = true;
            user = request.server.db.prepare("SELECT * FROM users WHERE id_user = ?").get(userId);
        }

        if (user.twoFA_enabled) {
            return reply.redirect(`${process.env.FRONTEND_URL}/signIn?2fa_required=true&userId=${userId}`);
        }

        const token = generateToken(user.username, user.email, user.id_user);
        request.server.db
            .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
            .run(token, userId);

        return reply.redirect(`${process.env.FRONTEND_URL}/signIn/?42Auth=success&userId=${userId}&isNewUser=${isNewUser}&token=${token}`);

    } catch (error) {
        console.error('42 auth failed:', error);
        return reply.redirect(`${process.env.FRONTEND_URL}/signIn?error=auth_failed`);
    }
}