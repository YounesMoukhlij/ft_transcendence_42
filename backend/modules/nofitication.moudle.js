import fastify from "fastify";


export async function GetNotification(request, reply) {
  const username = request.query.user;

  if (!username) {
    return reply.code(400).send({ error: "missing username" });
  }

  try {
    const query = request.server.db.prepare(`
      SELECT 
        n.*,
        u.profile_img AS sender_profile_img
      FROM notification n
      JOIN users u ON n.sender_user = u.username
      WHERE n.getter_user = ?
    `);

    const notifications = query.all(username);
    return reply.send(notifications);

  } catch (err) {
    console.error("GetNotification error:", err);
    reply.code(500).send({ error: "internal server error" });
  }
}



export async function sendRequestFriend(request , reply){
  const {sender , friend , title} = request.body;

  const socket = request.server.users_socket.get(friend);


  try{
      const query = request.server.db.prepare("INSERT INTO notification (getter_user, title, sender_user , notifyBody) VALUES (?, ?, ? ,?)");
      query.run(friend, title, sender, "test");

      // if (socket){
      //   console.log("here");
      //   const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE username = ?");
      //   const result = await query1.get(sender);
      //   const object = {
      //     getter_user: friend,
      //     sender_user: sender,
      //     title: title,
      //     sender_profile_img: result.profile_img
      //   }
      //     socket.send(JSON.stringify({
      //     type: "notify",
      //     data: `${object}`
      //   }));
      // }
      return reply.send("ok");

  }catch(err){
    console.log(err)
    reply.code(500).send({ error: "Internal server error" });
  }
}

