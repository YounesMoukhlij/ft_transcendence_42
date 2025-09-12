import { log } from "console";

export async function AddUser(request, reply) {
    const { username, email, password } = request.body;
    // const defImage = "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png";
    const defImage = "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg";
    // check if user or email already exists
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
        reply.send("User added successfully").code(201);
    } catch (error) {
        console.error("Error adding user:", error);
        reply.send("Error adding user").code(500);
    }
}

export async function getAllUsers(request, reply) {
    try {
        const query = request.server.db.prepare("SELECT * FROM users");
        const users = await query.all();
        reply.send(users).code(200);
    } catch (error) {
        console.error("Error fetching users:", error);
        reply.send("Error fetching users").code(500);
    }
}



// using middleware for hashing password and validating input would be a good idea
// also, using environment variables for database connection details is recommended

// Additional user management functions can be added here, such as Login, Logout, UpdateUser, DeleteUser, GetUsers, GetUserById
// Each function should handle its own database interactions and error handling
// For example:

// methode schema 