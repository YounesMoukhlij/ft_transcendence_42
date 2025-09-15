import { log } from "console";

// import bcrypt from 'bcrypt';

// async function hashPassword(password) {
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedpass = await bcrypt.hash(password, salt);
//     return hashedpass;
// }

export async function AddUser(request, reply) {
    const { username, email, password } = request.body;
    // const defImage = "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png";
    const defImage = "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg";

    // await new Promise(resolve => setTimeout(resolve, 9000));

    const userExists = request.server.db.prepare("SELECT * FROM users WHERE username = ? OR email = ?").get(username, email);
    if (userExists) {
        reply.code(409).send("Username or email already exists");
        return;
    }

    console.log("AddUser called with:", { username, email, password });
    if (!username || !email || !password) {
        reply.send("Missing required fields").code(400);
        return;
    }
    try {
        const query = request.server.db.prepare("INSERT INTO users (username, email, password ,profile_img) VALUES (?, ?, ?, ?)");

        const result = await query.run(username, email, password, defImage);

        log(`User ${username} added successfully `);

        reply.send({
            message: `User ${username} added successfully`
        }).code(201);

    } catch (error) {
        console.error("Error adding user:", error);

        reply.send({ message: "Error adding user", error: error.message }).code(500);


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

export async function login(request, reply) {
    const { username, password } = request.body;
    if (!username || !password) {
        reply.send("Missing required fields").code(400);
        return;
    }
    try {
        const query = request.server.db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        const user = query.get(username, password);
        if (user) {
            reply.send({ user }).code(200);
        } else {
            reply.send({ message: "Invalid username or password" }).code(401);
        }

    } catch (error) {
        console.error("Error during login:", error);
        reply.send({ message: "Error during login", error: error.message }).code(500);
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