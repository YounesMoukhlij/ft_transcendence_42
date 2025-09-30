import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken'

// Constants
const DEFAULT_PROFILE_IMAGE = "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg";
const GOOGLE_CLIENT_ID = "629752026404-2e0sltbkobghdg6mqov2p8gsjtbpu4la.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_REDIRECT_URI = "http://localhost:4444/GoogleAuth";
const FRONTEND_URL = "http://localhost:3000/Auth/signIn";
const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';
const OAUTH42_UID = 'u-s4t2ud-c185832544a20a39ad7b0803b90a5c595a1477d6bdecb423de4e9528bcffaafd';
const OAUTH42_SECRET = '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';
const OAUTH42_CALLBACK = 'http://localhost:4444/42Auth';

// token function gnerator
export function generateToken(username, email) {
    console.log("Generated secret key:", SECRET);

  if (!username || !email) {
    throw new Error("Username and email are required to generate token");
  }

  const payload = { username, email }

  // sign token
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
            .prepare("SELECT id_user, username, email, profile_img FROM users")
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
            .prepare("SELECT id_user, username, email, profile_img FROM users WHERE id_user = ?")
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
            .prepare("SELECT id_user, username, email, profile_img FROM users WHERE email = ?")
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
        } else {
            // Create new user with auth_method = 1 (Google)
            const insertQuery = request.server.db
            .prepare("INSERT INTO users (username, email, profile_img, auth_method) VALUES (?, ?, ?, ?)");
            const result = insertQuery.run(
            googleUser.name, 
            googleUser.email, 
            googleUser.picture,
            1 // auth_method: 1 for Google
            );
            userId = result.lastInsertRowid;
            isNewUser = true;
        }

        // Generate unique session ID
        const sessionId = `google_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Initialize global sessions map
        if (!global.googleAuthSessions) {
            global.googleAuthSessions = new Map();
        }
        
        // Store session data
        global.googleAuthSessions.set(sessionId, {
            id: userId,
            email: googleUser.email,
            username: googleUser.name,
            profile_img: googleUser.picture,
            isNewUser: isNewUser,
            timestamp: Date.now()
        });

        // Clean up expired sessions (older than 5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        for (const [key, value] of global.googleAuthSessions.entries()) {
            if (value.timestamp < fiveMinutesAgo) {
                global.googleAuthSessions.delete(key);
            }
        }

        // Redirect with session ID
        return reply.redirect(`${FRONTEND_URL}?googleAuth=success&sessionId=${sessionId}`);

    } catch (error) {
        console.error('Google auth failed:', error);
        return reply.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
}

export async function getGoogleAuthUser(request, reply) {
    const { sessionId } = request.query;

    if (!sessionId) {
        return reply.code(400).send({
            success: false,
            message: "Session ID required"
        });
    }

    if (!global.googleAuthSessions || !global.googleAuthSessions.has(sessionId)) {
        return reply.code(404).send({
            success: false,
            message: "Session not found or expired"
        });
    }

    const userData = global.googleAuthSessions.get(sessionId);
    
    // Delete session after retrieval (one-time use)
    global.googleAuthSessions.delete(sessionId);

    return reply.code(200).send({
        success: true,
        user: userData
    });
}

export async function get42AuthUser(request, reply) {
    const { sessionId } = request.query;

    if (!sessionId) {
        return reply.code(400).send({
            success: false,
            message: "Session ID required"
        });
    }

    if (!global.fortyTwoAuthSessions || !global.fortyTwoAuthSessions.has(sessionId)) {
        return reply.code(404).send({
            success: false,
            message: "Session not found or expired"
        });
    }

    const userData = global.fortyTwoAuthSessions.get(sessionId);
    
    // Delete session after retrieval (one-time use)
    global.fortyTwoAuthSessions.delete(sessionId);

    return reply.code(200).send({
        success: true,
        user: userData
    });
}

// Route 2: Handle 42 OAuth callback
export async function FortyTwoAuth(request, reply) {
    const { code } = request.query;
   
    if (!code) {
        return reply.redirect(`${FRONTEND_URL}/Auth/signIn?error=no_code`);
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: OAUTH42_UID,
                client_secret: OAUTH42_SECRET,
                code,
                redirect_uri: OAUTH42_CALLBACK,
            }),
        });

        const tokens = await tokenResponse.json();
        
        if (!tokens.access_token) {
            throw new Error('Failed to obtain access token');
        }

        // Get user info from 42
        const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const fortyTwoUser = await userResponse.json();

        // Check if user exists
        const existingUser = request.server.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(fortyTwoUser.email);

        let userId;
        let isNewUser = false;

        if (existingUser) {
            userId = existingUser.id_user;
        } else {
            const result = request.server.db
                .prepare("INSERT INTO users (username, email, profile_img, auth_method) VALUES (?, ?, ?, ?)")
                .run(
                    fortyTwoUser.login, 
                    fortyTwoUser.email, 
                    fortyTwoUser.image_url,
                    2
                );
            userId = result.lastInsertRowid;
            isNewUser = true;
        }

        // Generate session ID
        const sessionId = `42_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Initialize global sessions
        if (!global.fortyTwoAuthSessions) {
            global.fortyTwoAuthSessions = new Map();
        }
        
        // Store user data in session
        global.fortyTwoAuthSessions.set(sessionId, {
            id: userId,
            email: fortyTwoUser.email,
            username: fortyTwoUser.login,
            profile_img: fortyTwoUser.image_url,
            isNewUser: isNewUser,
            timestamp: Date.now()
        });

        // Clean expired sessions (older than 5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        for (const [key, value] of global.fortyTwoAuthSessions.entries()) {
            if (value.timestamp < fiveMinutesAgo) {
                global.fortyTwoAuthSessions.delete(key);
            }
        }

        // Redirect with session ID
        return reply.redirect(`${FRONTEND_URL}/Auth/signIn?fortyTwoAuth=success&sessionId=${sessionId}`);

    } catch (error) {
        console.error('42 auth failed:', error);
        return reply.redirect(`${FRONTEND_URL}/Auth/signIn?error=auth_failed`);
    }
}

// ============================================
// FASTIFY ROUTES
// ============================================
// fastify.get('/auth/42', Initiate42Auth);        // Redirects to 42 OAuth
// fastify.get('/auth/42/callback', FortyTwoAuth);  // Handles callback
// fastify.get('/auth/42/user', get42AuthUser);     // Gets user data


// ============================================
// FRONTEND CODE (SignInForm.tsx)
// ============================================
// Add this to your SignInForm component:

const handle42Callback = useCallback(async () => {
    if (hasProcessedOAuth) return

    const fortyTwoAuthStatus = searchParams.get('fortyTwoAuth')
    const sessionId = searchParams.get('sessionId')
    const authError = searchParams.get('error')

    const hasOAuthParams = fortyTwoAuthStatus || (sessionId && fortyTwoAuthStatus) || authError

    if (!hasOAuthParams) return

    setHasProcessedOAuth(true)
    router.replace('/Auth/signIn')

    if (authError) {
      const errorMessages: Record<string, string> = {
        'no_code': '42 authentication failed: No authorization code',
        'auth_failed': '42 authentication failed. Please try again.'
      }
      toast.error(errorMessages[authError] || 'An error occurred during authentication')
      return
    }

    if (fortyTwoAuthStatus === 'success' && sessionId) {
      try {
        const response = await fetch(`${API_URL}/auth/42/user?sessionId=${sessionId}`)
        
        const data = await response.json()

        if (!data.success || !data.user) {
          toast.error('Invalid user data received')
          return
        }

        const user = data.user
        localStorage.setItem('user', JSON.stringify(user))
        
        const message = user.isNewUser 
          ? `Welcome ${user.username}! Account created successfully.`
          : `Welcome back, ${user.username}!`
        
        toast.success(message)
        
        setTimeout(() => {
          router.push('/')
        }, 1500)
        
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        toast.error('Failed to complete authentication')
      }
    }
  }, [searchParams, router, hasProcessedOAuth])

  // Add to useEffect
  useEffect(() => {
    handleGoogleCallback()
    handle42Callback()  // Add this line
  }, [handleGoogleCallback, handle42Callback])