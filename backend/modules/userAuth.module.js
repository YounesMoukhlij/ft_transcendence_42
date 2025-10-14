import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';


import { SMTPClient } from 'emailjs';
// Remove the previous emailjs import and add this:
import emailjs from '@emailjs/nodejs';


// Constants
const DEFAULT_PROFILE_IMAGE = "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg";
const GOOGLE_CLIENT_ID = "629752026404-2e0sltbkobghdg6mqov2p8gsjtbpu4la.apps.googleusercontent.com";
const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';
// const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_REDIRECT_URI = "http://localhost:4444/GoogleAuth";
const FRONTEND_URL = "http://localhost:3000/";
const OAUTH42_UID = 'u-s4t2ud-c185832544a20a39ad7b0803b90a5c595a1477d6bdecb423de4e9528bcffaafd';
const OAUTH42_SECRET = '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';
const OAUTH42_CALLBACK = 'http://localhost:4444/42Auth';

// token function generator
export function generateToken(username, email) {
    console.log("generateToken");
    if (!username || !email) {
        throw new Error("Username and email are required to generate token");
    }

    const payload = { username, email };
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
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
    const {id_user, profile_image , username, fullname, email, twofa_enabled , languages , bio} = request.body;

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
        // Update user fields
        const updatedUser = {
            profile_img: profile_image || user.profile_img,
            username: username || user.username,
            fullname: fullname || user.fullname,
            email: email || user.email,
            twofa_enabled: twofa_enabled !== undefined ? twofa_enabled : user.twofa_enabled,
            languages: languages || user.languages,
            bio: bio || user.bio
        };
        // check if username or email already exists for another user
        const userExists = request.server.db
            .prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND id_user != ?")
            .get(updatedUser.username, updatedUser.email, id_user);
        
        if (userExists) {
            return reply.code(409).send({ 
                success: false, 
                message: "Username or email already exists" 
            });
        }
        // prepare and run update query (username and email should be unique)
        const query = request.server.db
            .prepare(`UPDATE users SET 
                profile_img = ?, 
                username = ?, 
                fullname = ?, 
                email = ?, 
                twofa_enabled = ?, 
                languages = ?, 
                bio = ? 
                WHERE id_user = ?`);``
        query.run(
            updatedUser.profile_img,
            updatedUser.username,
            updatedUser.fullname,
            updatedUser.email,
            updatedUser.twofa_enabled,
            updatedUser.languages,
            updatedUser.bio,
            id_user
        );
        return reply.code(200).send({
            success: true,
            message: "User updated successfully",
            //full user object
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


export async function updateUserSecurity(request, reply) {
    const { id_user, current_password, new_password , twofa_enabled } = request.body;
    const twofa = twofa_enabled ? 1 : 0;
    console.log("updateUserSecurity called with:", { id_user, current_password, new_password, twofa_enabled });
    
    if (!id_user || !current_password || !new_password) {
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
            .prepare("UPDATE users SET password = ?, twofa_enabled = ? WHERE id_user = ?")
            .run(hashedNewPassword, twofa, id_user);

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


export async function login(request, reply) {
    const { username, password } = request.body;
    
    if (!username || !password) {
        return reply.code(400).send({ 
            success: false, 
            message: "Missing required fields" 
        });
    }
    // // check if auth method is 0 (local)
    // const userAuthMethod = request.server.db
    //     .prepare("SELECT auth_method FROM users WHERE username = ?")
    //     .get(username);
    
    // if (!userAuthMethod) {
    //     return reply.code(401).send({ 
    //         success: false, 
    //         message: "Invalid username or password" 
    //     });
    // }
    
    // if (userAuthMethod.auth_method !== 0) {
    //     return reply.code(400).send({ 
    //         success: false, 
    //         message: "Use OAuth to log in" 
    //     });
    // }
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

        const { password: _, ...userWithoutPassword } = user;
        
        const token = generateToken(user.username, user.email);
        // insert token into database
        request.server.db
            .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
            .run(token, user.id_user);
        
        return reply.code(200).send({ 
            success: true, 
            message: "Login successful",
            user: userWithoutPassword 
        });

    } catch (error) {
        console.error("Error during login:", error);
        return reply.code(500).send({ 
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getAllUsers(request, reply) {
    try {
        const users = request.server.db
            .prepare("SELECT * FROM users")
            .all();
        return reply.code(200).send(users);
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
        
        return reply.code(200).send(user);
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
        
        return reply.code(200).send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return reply.code(500).send({ 
            message: "Error fetching user" 
        });
    }
}

export async function DeleteUserById(request, reply) {
    console.log("DeleteUserById called");
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
            // User exists - log them in
            userId = existingUser.id_user;
            isNewUser = false;
            // Update access token
            const token = generateToken(existingUser.username, existingUser.email);
            request.server.db
                .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
                .run(token, userId);
        } else {
            const token = generateToken(googleUser.name, googleUser.email);
            const insertQuery = request.server.db
            .prepare("INSERT INTO users (username, fullname, email, profile_img, auth_method, access_token) VALUES (?, ?, ?, ?, ?, ?)");
            const result = insertQuery.run(
            googleUser.name.split(" ")[0] + Math.floor(Math.random() * 1000),
            googleUser.name,
            googleUser.email, 
            googleUser.picture,
            1,
            token
            );
            userId = result.lastInsertRowid;
            isNewUser = true;
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
            const token = generateToken(existingUser.username, existingUser.email);
            request.server.db
                .prepare("UPDATE users SET access_token = ? WHERE id_user = ?")
                .run(token, userId);
        } else {
            const token = generateToken(fortyTwoUser.login, fortyTwoUser.email);
            const insertQuery = request.server.db
                .prepare("INSERT INTO users (username, fullname, email, profile_img, auth_method, access_token) VALUES (?, ?, ?, ?, ?, ?)");
            const result = insertQuery.run(
                fortyTwoUser.login,
                fortyTwoUser.displayname,
                fortyTwoUser.email,
                fortyTwoUser.image.link,
                2,
                token
            );
            userId = result.lastInsertRowid;
            isNewUser = true;
        }

        return reply.redirect(`${FRONTEND_URL}/signIn/?42Auth=success&userId=${userId}&isNewUser=${isNewUser}`);
        // return  reply.redirect(`${FRONTEND_URL}/signIn/?42Auth=success&login=${fortyTwoUser.login}`);

    } catch (error) {
        console.error('42 auth failed:', error);
        return reply.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
}

