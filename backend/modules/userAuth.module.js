import { log } from "console";
import bcrypt from 'bcrypt';

// Helper function to hash passwords
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);
    console.log("Hashed password:", hashedpass);
    console.log('original password:', password);
    return hashedpass;
}

export async function AddUser(request, reply) {
    const { username, email, password } = request.body;
    const defImage = "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg";

    console.log("AddUser called with:", { username, email, password: "***hidden***" });

    // Validate required fields first
    if (!username || !email || !password) {
        return reply
            .code(400)
            .send({ 
                success: false, 
                message: "Missing required fields" 
            });
    }

    try {
        // Check if user already exists
        const userExists = request.server.db.prepare("SELECT * FROM users WHERE username = ? OR email = ?").get(username, email);
        if (userExists) {
            return reply
                .code(409)
                .send({ 
                    success: false, 
                    message: "Username or email already exists" 
                });
        }

        // Hash the password before storing
        const hashedPassword = await hashPassword(password);

        // Insert user with hashed password
        const query = request.server.db.prepare("INSERT INTO users (username, email, password, profile_img) VALUES (?, ?, ?, ?)");
        const result = query.run(username, email, hashedPassword, defImage);

        console.log(`User ${username} added successfully`);

        return reply
            .code(201)
            .send({
                success: true,
                message: `User ${username} added successfully`,
                userId: result.lastInsertRowid
            });

    } catch (error) {
        console.error("Error adding user:", error);

        return reply
            .code(500)
            .send({ 
                success: false,
                message: "Error adding user", 
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
    }
}

export async function login(request, reply) {
    const { username, password } = request.body;
    
    if (!username || !password) {
        return reply
            .code(400)
            .send({ 
                success: false, 
                message: "Missing required fields" 
            });
    }

    try {
        const query = request.server.db.prepare("SELECT * FROM users WHERE username = ?");
        const user = query.get(username);
        
        if (!user) {
            return reply
                .code(401)
                .send({ 
                    success: false, 
                    message: "Invalid username or password" 
                });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("----------------");
        console.log( password, user.password, isPasswordValid);
        console.log("----------------");
        
        if (isPasswordValid) {
            // Remove password from user object before sending
            const { password: _, ...userWithoutPassword } = user;
            
            return reply
                .code(200)
                .send({ 
                    success: true, 
                    message: "Login successful",
                    user: userWithoutPassword 
                });
        } else {
            return reply
                .code(401)
                .send({ 
                    success: false, 
                    message: "Invalid username or password" ,
                    code: 401
                });
        }

    } catch (error) {
        console.error("Error during login:", error);
        
        return reply
            .code(500)
            .send({ 
                success: false,
                message: "Internal server error", 
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
    }
}

export async function getAllUsers(request, reply) {
    try {
        const query = request.server.db.prepare("SELECT * FROM users");
        const users = await query.all();
        reply.send(users).code(200);
    } catch (error) {
        console.error("Error fetching users:", error);
        reply.send({ message: "Error fetching users", error: error.message }).code(500);
    }
}
export async function getUserById(request, reply) {
    const { id } = request.params;
    try {
        const query = request.server.db.prepare("SELECT * FROM users WHERE id_user = ?");
        const user = query.get(id);
        if (user) {
            reply.send(user).code(200);
        } else {
            reply.send({ message: "User not found" }).code(404);
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        reply.send({ message: "Error fetching user", error: error.message }).code(500);
    }
}




// using middleware for hashing password and validating input would be a good idea
// also, using environment variables for database connection details is recommended

// Additional user management functions can be added here, such as Login, Logout, UpdateUser, DeleteUser, GetUsers, GetUserById
// Each function should handle its own database interactions and error handling
// For example:

// methode schema