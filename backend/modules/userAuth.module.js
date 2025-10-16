// userAuth.module.js
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
// Install: npm install otplib qrcode
import otplib from 'otplib'; 
import qrcode from 'qrcode'; 


import { SMTPClient } from 'emailjs';
import emailjs from '@emailjs/nodejs';
import { log } from 'console';


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

// token function generator (FIXED)
export function generateToken(username, email, id_user) {
    console.log("generateToken");
    log("generateToken params:", { username, email, id_user });
    if (!username || !email || !id_user) {
        throw new Error("Username, email, and user ID are required to generate token");
    }

    const payload = { username, email, id_user };
    
    // 💡 FIX: Ensure the token is stored and returned correctly
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });

    console.log("Token generated successfully for user:", username, id_user);
    console.log("Token:", token);

    return token;
}

// Helper function to hash passwords
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// ====== USER MANAGEMENT ======

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
            .prepare("INSERT INTO users (username, email, password, profile_img) VALUES (?, ?, ?, ?)");
        const result = query.run(username, email, hashedPassword, DEFAULT_PROFILE_IMAGE);

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
    console.log("updateUserInfo called with:", request.user);
    const id_user = request.user.id_user;
    console.log("updateUserInfo id_user:", id_user);
    if (!id_user) {
        return reply.code(400).send({
            success: false,
            message: "Missing user ID"
        });
    }
    const {profile_image , username, fullname, email, languages , bio} = request.body; 

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

        const updatedUser = {
            profile_img: typeof profile_image !== 'undefined' ? profile_image : user.profile_img, 
            username: username || user.username,
            fullname: fullname || user.fullname,
            email: email || user.email,
            languages: languages || user.languages,
            bio: bio || user.bio
        };
        
        const userExists = request.server.db
            .prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND id_user != ?")
            .get(updatedUser.username, updatedUser.email, id_user);
        
        if (userExists) {
            return reply.code(409).send({ 
                success: false, 
                message: "Username or email already exists" 
            });
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
            user: { id_user, ...updatedUser }
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
    
    // Removed redundant check for id_user from body
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

// --- update2FA (Handles 2FA flag update only) ---
export async function update2FA(request, reply) {
    const {twofa } = request.body;
    const id_user = request.user.id_user;
    
    if (typeof id_user === 'undefined' || typeof twofa === 'undefined') {
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

        const twofaAsInt = twofa ? 1 : 0; 

        request.server.db
            .prepare("UPDATE users SET twofa_enabled = ? WHERE id_user = ?")
            .run(twofaAsInt, id_user);

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


// ====== LOGIN / AUTH FLOWS ======

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

        // 2FA Check Logic (If implemented)
        if (user.twoFA_enabled) {
            return reply.code(200).send({
                success: true,
                message: "2FA required",
                twoFA_required: true,
                id_user: user.id_user 
            });
        }

        // Regular login success
        const token = generateToken(user.username, user.email, user.id_user);
        
        // Ensure userWithoutPassword is correctly created after token generation
        const { password: _, twoFA_secret: __, ...userWithoutPassword } = user;

        // insert token into database
        request.server.db
            .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
            .run(token, user.id_user);
        
        return reply.code(200).send({ 
            success: true, 
            message: "Login successful",
            user: userWithoutPassword,
            token: token // Send token to frontend
        });

    } catch (error) {
        console.error("Error during login:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Internal server error"
        });
    }
}

// ====== UTILITY FUNCTIONS ======

export async function getAllUsers(request, reply) {
    try {
        const users = request.server.db
            .prepare("SELECT * FROM users")
            .all();
        // Remove sensitive fields before sending
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
        
        // Remove sensitive fields before sending
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

// EmailJS configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_olzq7jd',
    TEMPLATE_ID: 'template_y4x9xld', 
    PRIVATE_KEY: 'DpuittgIXC3Ppn_kbJCcY'
};

// Keep your existing SMTP client as backup (optional)
const emailClient = new SMTPClient({
    user: 'ft_transcendence-support@gmail.com',
    password: process.env.SMTP_PASS || 'your_email_password',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
});

function sendMail(message) {
    return new Promise((resolve, reject) => {
        emailClient.send(message, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// Update your resetPassword function to use EmailJS
export async function resetPassword(request, reply) {
  const { email } = request.body;

  try {
    const user = request.server.db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in DB
    request.server.db
      .prepare("UPDATE users SET password = ? WHERE email = ?")
      .run(hashedPassword, email);

    // Send email using EmailJS
    const templateParams = {
      to_email: email,
      username: user.username || '',
      password: newPassword,
      from_name: 'Pong Game'
    };

    try {
      // Using EmailJS with the correct package
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_CONFIG.PRIVATE_KEY, // Note: Use publicKey for @emailjs/nodejs
        }
      );
      
      console.log('Password reset email sent successfully via EmailJS');
      
    } catch (err) {
      console.error('Failed to send reset email via EmailJS:', err);
      
      // Fallback to SMTP client if EmailJS fails
      console.log('Trying fallback SMTP method...');
      try {
        const mailMessage = {
          text: `Hey ${user.username || ''}, your new password is: ${newPassword}, you can change it after logging in.\nDon't share it with anyone!`,
          from: process.env.SMTP_FROM || 'Pong Game <ft_transcendence-support@gmail.com>',
          to: email,
          subject: 'Your new password',
        };
        
        await sendMail(mailMessage);
        console.log('Password reset email sent successfully via SMTP fallback');
        
      } catch (smtpErr) {
        console.error('Failed to send reset email via SMTP fallback:', smtpErr);
        return reply.code(500).send({ message: 'Error sending reset email' });
      }
    }

    return reply.code(200).send({
      success: true,
      message: "Password updated successfully. Check your email for the new password."
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return reply.code(500).send({ message: "Error updating password" });
  }
}

// ====== GOOGLE OAUTH ======

export async function InitiateGoogleAuth(request, reply) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
    
    return reply.redirect(googleAuthUrl);
}

export async function GoogleAuth(request, reply) {
    const { code } = request.query;
   
    if (!code) {
        return reply.redirect(`${FRONTEND_URL}?error=no_code`);
    }

    try {
        // Exchange authorization code for access token
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

        // Get user info from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const googleUser = await userResponse.json();

        // Check if user already exists
        const existingUser = request.server.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(googleUser.email);

        let userId;
        let isNewUser = false;

        if (existingUser) {
            console.log("Existing Google user");
            // User exists - log them in
            userId = existingUser.id_user;
            isNewUser = false;
            // Update access token
            console.log("vataar >>>", existingUser);
            const token = generateToken(existingUser.username, existingUser.email, existingUser.id_user); // 💡 FIX: Capture token
            request.server.db
                .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
                .run(token, userId); // 💡 FIX: Use token
        } else {
            console.log("New Google user, creating account");
            // const token = generateToken(googleUser.name, googleUser.email, googleUser.id_user); // 💡 FIX: Capture token
            const insertQuery = request.server.db
            .prepare("INSERT INTO users (username, fullname, email, profile_img, auth_method) VALUES (?, ?, ?, ?, ?)");
            const result = insertQuery.run(
            googleUser.name.split(" ")[0] + Math.floor(Math.random() * 1000),
            googleUser.name,
            googleUser.email, 
            googleUser.picture,
            1,
            );
            userId = result.lastInsertRowid;
            isNewUser = true;
            // console.log("New Google user created:", result.lastInsertRowid);

            // generate token for new user
            const token = generateToken(googleUser.username, googleUser.email, userId);
            // store token in db
            request.server.db
                .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
                .run(token, userId); // 💡 FIX: Use token
        
        }
    
        return reply.redirect(`${FRONTEND_URL}/signIn/?googleAuth=success&userId=${userId}&isNewUser=${isNewUser}`);

    } catch (error) {
        console.error('Google auth failed:', error);
        return reply.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
}
// ====== 42 OAUTH ======

export async function Initiate42Auth(request, reply) {
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${OAUTH42_UID}&redirect_uri=${OAUTH42_CALLBACK}&response_type=code`;
    return reply.redirect(authUrl);
}

export async function FortyTwoAuth(request, reply) {
    const { code } = request.query;
    
    if (!code) {
        return reply.redirect(`${FRONTEND_URL}?error=no_code`);
    }

    // Exchange authorization code for access token
    try {
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

        // Get user info from 42 API
        const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const fortyTwoUser = await userResponse.json();
        // Check if user already exists
        const existingUser = request.server.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(fortyTwoUser.email);

        let userId;
        let isNewUser = false;

        if (existingUser) {
            // User exists - log them in
            userId = existingUser.id_user;
            isNewUser = false;
            // Update access token
            const token = generateToken(existingUser.username, existingUser.email, existingUser.id_user); // 💡 FIX: Capture token
            request.server.db
                .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
                .run(token, userId); // 💡 FIX: Use token
        } else {
            // const token = generateToken(fortyTwoUser.login, fortyTwoUser.email, fortyTwoUser.id_user); // 💡 FIX: Capture token
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
            const token = generateToken(fortyTwoUser.login, fortyTwoUser.email, userId);
            // store token in db
            request.server.db
                .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
                .run(token, userId); // 💡 FIX: Use token
            // console.log("New 42 user created:", result.lastInsertRowid);
        }

        return reply.redirect(`${FRONTEND_URL}/signIn/?42Auth=success&userId=${userId}&isNewUser=${isNewUser}`);
        // return  reply.redirect(`${FRONTEND_URL}/signIn/?42Auth=success&login=${fortyTwoUser.login}`);

    } catch (error) {
        console.error('42 auth failed:', error);
        return reply.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
}