import fetch from 'node-fetch';

export async function googleOAuthHandler(request, reply) {
  const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
  // Fetch user info from Google
  const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  }).then(res => res.json());
  // Here, insert or update user in DB using userInfo
  // ...
  reply.send({ user: userInfo });
}

export async function fortyTwoOAuthHandler(request, reply) {
  const { token } = await this.fortyTwoOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
  // Fetch user info from 42 API
  const userInfo = await fetch('https://api.intra.42.fr/v2/me', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  }).then(res => res.json());
  // Here, insert or update user in DB using userInfo
  // ...
  reply.send({ user: userInfo });
}

export async function handleGoogleAuthUser(request, reply) {
  const db = request.server.db;
  const { email, name, image, provider } = request.body;
  if (!email) {
    return reply.status(400).send({ error: 'Email is required' });
  }
  // Check if user exists
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    // Create new user
    db.prepare(`INSERT INTO users (username, fullname, profile_img, email, google_auth) VALUES (?, ?, ?, ?, ?);`).run(
      name || email.split('@')[0],
      name || '',
      image || '',
      email,
      'true'
    );
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  } else {
    // Update user info if needed
    db.prepare(`UPDATE users SET fullname = ?, profile_img = ?, google_auth = ? WHERE email = ?`).run(
      name || user.fullname,
      image || user.profile_img,
      'true',
      email
    );
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }
  return reply.send({ success: true, user });
}

export async function handleDefaultLogin(request, reply) {
  const db = request.server.db;
  const { email, username, password } = request.body;
  if (!(email || username) || !password) {
    return reply.status(400).send({ error: 'Email/Username and password are required' });
  }
  // Try to find user by email or username
  let user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email || '', username || '');
  if (!user) {
    // Optionally, create a new user (signup)
    db.prepare(`INSERT INTO users (username, email, password) VALUES (?, ?, ?);`).run(
      username || email.split('@')[0],
      email || '',
      password // In production, hash the password!
    );
    user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email || '', username || '');
  } else {
    // Check password
    if (user.password !== password) {
      return reply.status(401).send({ error: 'Invalid password' });
    }
  }
  return reply.send({ success: true, user });
}
