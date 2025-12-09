// userAuth.module.js
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
// Install: npm install otplib
import otplib from 'otplib'; // <-- Ensure this is imported
import qrcode from 'qrcode'; 


import { createClient } from 'redis';
import emailjs from '@emailjs/nodejs';
import {SMTPClient} from 'emailjs';
// import nodemailer
import nodemailer from 'nodemailer';
import { text } from 'stream/consumers';


// --- Imports for file system handling ---
import fs from 'fs';
import path from 'path'; // <-- ADD THIS LINE
import { promisify } from 'util';
import stream from 'stream';
import pump from 'pump';

const pipeline = promisify(stream.pipeline);

// Constants
const DEFAULT_PROFILE_IMAGE = "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg";
const GOOGLE_CLIENT_ID = "629752026404-2e0sltbkobghdg6mqov2p8gsjtbpu4la.apps.googleusercontent.com";
const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_REDIRECT_URI = "http://localhost:4444/GoogleAuth";
const FRONTEND_URL = "http://localhost:3000/";
const OAUTH42_UID = 'u-s4t2ud-c185832544a20a39ad7b0803b90a5c595a1477d6bdecb423de4e9528bcffaafd';
const OAUTH42_SECRET = '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';
const OAUTH42_CALLBACK = 'http://localhost:4444/42Auth';
const ISSUER_NAME = 'GalaxyPong 42'; // 2FA Issuer Name


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
        // remove sensitive info from user object
        const { password, ...safeUser } = user;
        console.log("\n\n\nme function returning user:", safeUser, "\n\n\n\n");
        return reply.code(200).send(safeUser);
    } catch (error) {
        console.error("Error fetching user info:", error);
        return reply.code(500).send({ success: false, message: "Error fetching user info" });
    }
}


//leaderboard
export async function leaderboard(request, reply) {
    try {
        // 1. Get and validate query parameters
        // request.query parameters are usually strings, so we parse them.
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        
        // 2. Calculate the OFFSET
        // Page 1: offset 0, Page 2: offset 10, etc.
        const offset = (page - 1) * limit;

        // 3. Update SQL query with LIMIT and OFFSET
        // using '?' placeholders prevents SQL injection
        const leaderboardUsers = request.server.db
            .prepare("SELECT username, profile_img, xp FROM users ORDER BY xp DESC LIMIT ? OFFSET ?")
            .all(limit, offset);

        return reply.code(200).send({ success: true, leaderboard: leaderboardUsers });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return reply.code(500).send({ success: false, message: "Error fetching leaderboard" });
    }
}
// token function generator (FIXED)
export function generateToken(username, email, id_user) {
    console.log("generateToken called with:", { username, email, id_user });
    if (!username || !email || !id_user) {
        throw new Error("Username, email, and user ID are required to generate token");
    }

    const payload = { username, email, id_user };
    const token = jwt.sign(payload, SECRET, { expiresIn: '24h' }); // Token valid for 24 hours
    console.log(" >> Token generated successfully for user:", username, email, id_user);
    return token;
}

export function generateRefreshToken(username, email, id_user) {
    console.log("generateRefreshToken called with:", { username, email, id_user });
    if (!username || !email || !id_user) {
        throw new Error("Username, email, and user ID are required to generate refresh token");
    }
    const payload = { username, email, id_user };
    const refreshToken = jwt.sign(payload, SECRET, { expiresIn: '7d' }); // Refresh token valid for 7 days
    console.log(" >> Refresh token generated successfully for user:", { username, email, id_user });
    return refreshToken;
}

// ... (commented out 2FA helper functions)

// Helper function to hash passwords
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// ====== USER MANAGEMENT ======

export async function AddUser(request, reply) {
    // ... (This function is unchanged)
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

//  update user info
export async function updateUserInfo(request, reply) {
    // ... (This function is unchanged)
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
        
        if (profileImgPath && user.profile_img && user.profile_img !== DEFAULT_PROFILE_IMAGE) {
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

export async function updateUserPassword(request, reply) {
    // ... (This function is unchanged)
    const id_user = request.user.id_user;
    if (!id_user) {
        return reply.code(400).send({
            success: false,
            message: "Missing user ID"
        });
    }
    console.log("updateUserPassword called with id_user:", id_user);
    const { current_password, new_password } = request.body;
    console.log("updateUserPassword called with:", { id_user, current_password, new_password });
    
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

// --- update2FA (Handles DISABLING 2FA) ---
export async function update2FA(request, reply) {
    const { twofa } = request.body; // This should be `false` or 0
    const id_user = request.user.id_user;
    
    if (typeof id_user === 'undefined' || typeof twofa === 'undefined') {
        return reply.code(400).send({
            success: false,
            message: "Missing required fields"
        });
    }

    // This endpoint should only be used to DISABLE 2FA
    if (twofa) {
        return reply.code(400).send({
            success: false,
            message: "To enable 2FA, please use the /2fa/generate and /2fa/verify endpoints."
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


// ====== 2FA SETUP FLOW ======

// --- NEW FUNCTION 1: Generate Secret & OTP URL ---
export async function generate2FA(request, reply) {
    const { id_user, email } = request.user; // Get from auth decorator

    try {
        // 1. Generate a new secret
        const secret = otplib.authenticator.generateSecret();
        
        // 2. Create the otpauth URL for the QR code
        const otpauth = otplib.authenticator.keyuri(email, ISSUER_NAME, secret);

        // 3. Save this *unverified* secret to the database
        request.server.db
            .prepare("UPDATE users SET twoFA_secret = ? WHERE id_user = ?")
            .run(secret, id_user);

        // 4. Send the URL to the frontend
        return reply.code(200).send({ success: true, otpauth });

    } catch (error) {
        console.error("Error in generate2FA:", error);
        return reply.code(500).send({ success: false, message: "Error generating 2FA secret" });
    }
}

// --- NEW FUNCTION 2: Verify Token & Enable 2FA ---
export async function verifyAndEnable2FA(request, reply) {
    const { token } = request.body; // The 6-digit code from the user
    const { id_user } = request.user;

    if (!token) {
        return reply.code(400).send({ success: false, message: "Token is required." });
    }

    try {
        // 1. Get the user's secret from the database
        const user = request.server.db
            .prepare("SELECT twoFA_secret FROM users WHERE id_user = ?")
            .get(id_user);

        if (!user || !user.twoFA_secret) {
            return reply.code(400).send({ success: false, message: "No 2FA secret found. Please start over." });
        }

        // 2. Verify the token against the secret
        const isValid = otplib.authenticator.check(token, user.twoFA_secret);

        if (isValid) {
            // 3. Success! Mark 2FA as fully enabled
            request.server.db
                .prepare("UPDATE users SET twoFA_enabled = 1 WHERE id_user = ?")
                .run(id_user);
            
            return reply.code(200).send({ success: true, message: "2FA enabled successfully." });
        } else {
            // 4. Failed verification
            return reply.code(400).send({ success: false, message: "Invalid verification code. Please try again." });
        }

    } catch (error) {
        console.error("Error in verifyAndEnable2FA:", error);
        return reply.code(500).send({ success: false, message: "Error verifying 2FA token" });
    }
}


// ====== LOGIN / AUTH FLOWS ======

// --- MODIFIED --- login function
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

        // --- NEW 2FA Check Logic ---
        if (user.twoFA_enabled) {
            return reply.code(200).send({
                success: true,
                twoFA_required: true, // Tell frontend to ask for 2FA code
                userId: user.id_user 
            });
        }
        // --- END 2FA Check ---

        // Regular login success (2FA is OFF)
        const token = generateToken(user.username, user.email, user.id_user);
        const refreshToken = generateRefreshToken(user.username, user.email, user.id_user);
        
        const { password: _, twoFA_secret: __, ...userWithoutPassword } = user;
        request.server.db
            .prepare("UPDATE users SET access_token = ? , refresh_token = ? WHERE id_user = ?")
            .run(token, refreshToken, user.id_user);
        
        userWithoutPassword.access_token = token;
        userWithoutPassword.refresh_token = refreshToken;
        console.log("user from login:", userWithoutPassword);

        return reply.code(200).send({ 
            success: true, 
            message: "Login successful",
            user: userWithoutPassword,
            token: token,
            refreshToken: refreshToken
        });

    } catch (error) {
        console.error("Error during login:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Internal server error"
        });
    }
}

// --- NEW FUNCTION 3: Verify 2FA code during LOGIN ---
export async function loginVerify2FA(request, reply) {
    const { userId, token } = request.body; // 6-digit code

    if (!userId || !token) {
        return reply.code(400).send({ success: false, message: "User ID and token are required." });
    }

    try {
        // 1. Get user and their secret
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE id_user = ?")
            .get(userId);

        if (!user || !user.twoFA_secret || !user.twoFA_enabled) {
            return reply.code(401).send({ success: false, message: "2FA not enabled or user not found." });
        }

        // 2. Verify the code
        const isValid = otplib.authenticator.check(token, user.twoFA_secret);

        if (!isValid) {
            return reply.code(401).send({ success: false, message: "Invalid 2FA code." });
        }

        // 3. SUCCESS! Grant login
        // Generate tokens and send full user object
        const accessToken = generateToken(user.username, user.email, user.id_user);
        const refreshToken = generateRefreshToken(user.username, user.email, user.id_user);
        
        const { password: _, twoFA_secret: __, ...userWithoutPassword } = user;
        
        request.server.db
            .prepare("UPDATE users SET access_token = ? , refresh_token = ? WHERE id_user = ?")
            .run(accessToken, refreshToken, user.id_user);
        
        userWithoutPassword.access_token = accessToken;
        userWithoutPassword.refresh_token = refreshToken;

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


export async function refreshToken(request, reply) {
    // ... (This function is unchanged)
    console.log("refreshToken function called");
    const { refreshToken } = request.body;

    if (!refreshToken) {
        console.log("No refresh token provided in request body");
        return reply.code(401).send({ success: false, message: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, SECRET);
        const user = request.server.db.prepare("SELECT * FROM users WHERE id_user = ?").get(decoded.id_user);

        if (!user) {
            console.log(`No user found for id_user: ${decoded.id_user}`);
            return reply.code(401).send({ success: false, message: "Invalid refresh token" });
        }

        console.log("Token from DB:      ", user.refresh_token);
        console.log("Token from Request: ", refreshToken);

        if (user.refresh_token !== refreshToken) {
            console.log("Tokens do NOT match!");
            return reply.code(401).send({ success: false, message: "Invalid refresh token" });
        }

        console.log("Tokens match. Generating new access token for user:", user.username);
        const newAccessToken = generateToken(user.username, user.email, user.id_user);

        request.server.db
            .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
            .run(newAccessToken, user.id_user);

        console.log("New access token generated and sent");
        return reply.code(200).send({ success: true, accessToken: newAccessToken });

    } catch (error) {
        console.error("Error refreshing token:", error.message);
        return reply.code(401).send({ success: false, message: `Invalid or expired refresh token: ${error.message}` });
    }
}


// ====== UTILITY FUNCTIONS ======
// ... (getAllUsers, getUserById, getUserByEmail, DeleteUserById are unchanged)
export async function getAllUsers(request, reply) {
    try {
        const users = request.server.db
            .prepare("SELECT * FROM users")
            .all();
        const safeUsers = users.map(user => {
            const { password, twoFA_secret, ...safeUser } = user;
            return safeUser;
        });
        return reply.code(200).send(safeUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return reply.code(500).send({ 
            message: "Error fetching users" 
        });
    }
}
export async function getUserById(request, reply) {
    const { id } = request.params;
    try {
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE id_user = ?")
            .get(id);
        if (!user) {
            return reply.code(404).send({ message: "User not found" });
        }
        const { password, twoFA_secret, ...safeUser } = user;
        return reply.code(200).send(safeUser);
    } catch (error) {
        console.error("Error fetching user:", error);
        return reply.code(500).send({ 
            message: "Error fetching user" 
        });
    }
}
export async function getUserByEmail(request, reply) {
    const { email } = request.params;
    try {
        const user = request.server.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email);
        if (!user) {
            return reply.code(404).send({ message: "User not found" });
        }
        const { password, twoFA_secret, ...safeUser } = user;
        return reply.code(200).send(safeUser);
    } catch (error) {
        console.error("Error fetching user:", error);
        return reply.code(500).send({ 
            message: "Error fetching user" 
        });
    }
}
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


// ====== PASSWORD RESET (EMAILJS) ======
// ... (forgotPassword, verifyCode, resetPasswordWithToken are unchanged, as is the email setup)
// ... (transporter and sendVerificationCode function)
const EMAIL_USER='mini.9liliwi@gmail.com'
const EMAIL_PASS='aufg lsjj pxds bnqs'
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: EMAIL_USER, 
    pass: EMAIL_PASS, 
  },
});



async function sendVerificationCode(userEmail, code) {
  console.log(`Preparing to send verification code to ${userEmail}`);
  console.log(`Generated code: ${code}`);
  const mailOptions = {
    from: `Zmoumni`,
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
                    <img src="https://postimg.cc/8FV14g5K" alt="User Avatar"  style="border-radius: 50%; margin-bottom: 20px;" />
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
                </html>
` 
  };

  // 4. Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, message: 'Code sent!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send code.' };
  }
}


// ====== PASSWORD RESET (EMAILJS) ======
export async function forgotPassword(request, reply) {
    const { email } = request.body;
    const redis = request.server.redis;

    if (!email) {
        return reply.code(400).send({ success: false, message: "Email is required." });
    }

    try {
        // check if auth_method is 0 (normal auth)
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
            // This is a good security practice to prevent email enumeration.
            console.log(`Password reset attempt for non-existent email: ${email}`);
            return reply.code(200).send(
                {
                    success: true, 
                    message: "This email does not exist in our databases. :("
                }
            );
        }

        
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated code for ${email}: ${code}`);
        await redis.set(`reset:${email}`, code, { EX: 120 });

        sendVerificationCode(email, code);
        
        console.log(`Verification code sent to ${email}`);
        return reply.code(200).send({ success: true, message: "A verification code has been sent to your email." });

    } catch (error) {
        console.error("Error in sendVerificationCode:", error.text || error);
        return reply.code(500).send({ success: false, message: "Failed to send verification code." });
    }
}

// --- STEP 2: Verify the Code and Create a Temporary Token ---
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

        // Generate a short-lived JWT token that gives the user permission to change their password.
        const user = request.server.db.prepare("SELECT id_user, username, email FROM users WHERE email = ?").get(email);
        const resetToken = jwt.sign(
            { id_user: user.id_user, email: user.email, purpose: 'password-reset' },
            SECRET,
            { expiresIn: '5m' } // This token is only valid for 5 minutes
        );

        return reply.code(200).send({ success: true, message: "Code verified.", resetToken: resetToken });

    } catch (error) {
        console.error("Error in verifyCode:", error);
        return reply.code(500).send({ success: false, message: "An error occurred during code verification." });
    }
}

// --- STEP 3: Reset the Password Using the Temporary Token ---
export async function resetPasswordWithToken(request, reply) {
    const { resetToken, newPassword } = request.body;

    if (!resetToken || !newPassword) {
        return reply.code(400).send({ success: false, message: "Token and new password are required." });
    }

    try {
        // Verify the temporary token.
        const decoded = jwt.verify(resetToken, SECRET);

        // Extra check to ensure this token was for password reset.
        if (decoded.purpose !== 'password-reset') {
            return reply.code(401).send({ success: false, message: "Invalid token purpose." });
        }

        const hashedPassword = await hashPassword(newPassword);

        // Update the password in the database.
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
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
    
    return reply.redirect(googleAuthUrl);
}

// --- MODIFIED --- GoogleAuth
export async function GoogleAuth(request, reply) {
    const { code } = request.query;
   
    if (!code) {
        return reply.redirect(`${FRONTEND_URL}/signIn?error=no_code`);
    }

    try {
        // ... (tokenResponse and userResponse logic unchanged)
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
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

        // Check if user already exists
        let user = request.server.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(googleUser.email);

        let userId;
        let isNewUser = false;

        if (user) {
            // User exists
            userId = user.id_user;
        } else {
            // New user, create them
            console.log("New Google user, creating account");
            const insertQuery = request.server.db
                .prepare("INSERT INTO users (username, fullname, email, profile_img, auth_method) VALUES (?, ?, ?, ?, ?)");
            const result = insertQuery.run(
                googleUser.name.split(" ")[0] + Math.floor(Math.random() * 1000),
                googleUser.name,
                googleUser.email, 
                // bigger profile image from google
                googleUser.picture.replace('=s96-c', '=s600-c'),
                1,
            );
            userId = result.lastInsertRowid;
            isNewUser = true;

            // Fetch the newly created user to check their 2FA status (which will be false)
            user = request.server.db.prepare("SELECT * FROM users WHERE id_user = ?").get(userId);
        }
    
        // --- NEW 2FA Check ---
        if (user.twoFA_enabled) {
            // 2FA is ON. Redirect to frontend to ask for code.
            return reply.redirect(`${FRONTEND_URL}/signIn?2fa_required=true&userId=${userId}`);
        }
        // --- END 2FA Check ---

        // 2FA is OFF. Proceed with normal login.
        // We only generate tokens here if 2FA is off.
        const token = generateToken(user.username, user.email, user.id_user);
        const refreshToken = generateRefreshToken(user.username, user.email, user.id_user);
        request.server.db
            .prepare("UPDATE users SET access_token = ?, refresh_token = ? WHERE id_user = ?")
            .run(token, refreshToken, userId);

        return reply.redirect(`${FRONTEND_URL}/signIn?googleAuth=success&userId=${userId}&isNewUser=${isNewUser}&token=${token}`);

    } catch (error) {
        console.error('Google auth failed:', error);
        return reply.redirect(`${FRONTEND_URL}/signIn?error=auth_failed`);
    }
}
// ====== 42 OAUTH ======

export async function Initiate42Auth(request, reply) {
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${OAUTH42_UID}&redirect_uri=${OAUTH42_CALLBACK}&response_type=code`;
    return reply.redirect(authUrl);
}

// --- MODIFIED --- FortyTwoAuth
export async function FortyTwoAuth(request, reply) {
    const { code } = request.query;
    
    if (!code) {
        return reply.redirect(`${FRONTEND_URL}/signIn?error=no_code`);
    }

    try {
        // ... (tokenResponse and userResponse logic unchanged)
        console.log("42 Auth code:", code);
        const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: OAUTH42_UID,
                client_secret: OAUTH42_SECRET,
                code,
                redirect_uri: OAUTH42_CALLBACK,
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
            // New user, create them
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

            // Fetch the newly created user
            user = request.server.db.prepare("SELECT * FROM users WHERE id_user = ?").get(userId);
        }

        // --- NEW 2FA Check ---
        if (user.twoFA_enabled) {
            // 2FA is ON. Redirect to frontend to ask for code.
            return reply.redirect(`${FRONTEND_URL}/signIn?2fa_required=true&userId=${userId}`);
        }
        // --- END 2FA Check ---

        // 2FA is OFF. Proceed with normal login.
        const token = generateToken(user.username, user.email, user.id_user);
        const refreshToken = generateRefreshToken(user.username, user.email, user.id_user);
        request.server.db
            .prepare("UPDATE users SET access_token = ?, refresh_token = ? WHERE id_user = ?")
            .run(token, refreshToken, userId);

        return reply.redirect(`${FRONTEND_URL}/signIn/?42Auth=success&userId=${userId}&isNewUser=${isNewUser}&token=${token}`);

    } catch (error) {
        console.error('42 auth failed:', error);
        return reply.redirect(`${FRONTEND_URL}/signIn?error=auth_failed`);
    }
}