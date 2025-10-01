# Demo👈

[https://authentication-secrets-tmdm.onrender.com/](https://authentication-secrets-tmdm.onrender.com/)



# Authentication-Secrets Project Summary

This document summarizes the work done on the **Authentication-Secrets** project today, covering **MongoDB setup**, **Google OAuth configuration**, and **Render deployment**.

------

## 📌 Project Goals

The goal of this project is to create a web app where users can:

- Register and log in with **local accounts** (username + password)
- Log in with **Google OAuth 2.0**
- Submit and view **anonymous secrets** shared by other users
- Deploy the app to **Render** so it can be accessed online

------

## 1. MongoDB Setup

### a) Atlas Cluster

- Used **MongoDB Atlas** free cluster (`Cluster0`).

- Connection string example:

  ```
  mongodb+srv://USERNAME:PASSWORD@cluster0.irgncm5.mongodb.net/?retryWrites=true&w=majority
  ```

- The password must be URL-encoded and stored in `.env`:

  ```
  PASSWORD=your_password_here
  ```

- In code:

  ```
  mongoose.connect(SRV, { dbName: 'userDB' })
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error('Mongo connect error:', err));
  ```

### b) User Schema

- Fields: `email`, `password`, `googleId`, `username`, `secret` (array of strings).
- Plugins:
  - `passport-local-mongoose` for local login/register (handles hashing).
  - Custom `findOrCreate` logic for Google users (since `mongoose-findorcreate` broke with Mongoose v8).

### c) Session Store

- Used **connect-mongodb-session** to store Express sessions in MongoDB.

- Session config:

  ```
  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
  }));
  ```

------

## 2. Google OAuth Setup

### a) Google Cloud Console

1. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.

2. Type: **Web Application**.

3. Add these **redirect URIs**:

   ```
   http://localhost:3000/auth/google/secrets
   https://authentication-secrets-tmdm.onrender.com/auth/google/secrets
   ```

4. Save, and get `CLIENT_ID` and `CLIENT_SECRET`.

### b) Code Integration

- Configured `GoogleStrategy`:

  ```
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/google/secrets`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { doc: user } = await User.findOrCreate({
        googleId: profile.id,
        username: profile.emails?.[0]?.value,
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
  ```

- `BASE_URL` is auto-switched:

  - Local: `http://localhost:3000`
  - Production: `https://authentication-secrets-tmdm.onrender.com`

------

## 3. Passport Local Auth

- Local strategy from `passport-local-mongoose`:

  ```
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  ```

- Register:

  ```
  User.register({ username }, password, callback);
  ```

- Login:

  ```
  passport.authenticate('local')(req, res, () => res.redirect('/secrets'));
  ```

- Logout:

  ```
  req.logout();
  req.session.destroy(() => res.redirect('/'));
  ```

------

## 4. Render Deployment

### a) Node.js & Port Binding

- Must listen on `process.env.PORT`:

  ```
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
  });
  ```

- Otherwise Render will say: *“Detected service running on port 10000”*.

### b) Environment Variables on Render

- Set the following in Render Dashboard:

  ```
  BASE_URL=https://authentication-secrets-tmdm.onrender.com
  CLIENT_ID=xxxx
  CLIENT_SECRET=xxxx
  PASSWORD=xxxx
  SECRET=xxxx
  ```

### c) Deploy Logs

- Build logs:

  - `npm install`
  - `npm audit fix` if needed

- Runtime logs:

  - Should show:

    ```
    Google OAuth callbackURL = https://authentication-secrets-tmdm.onrender.com/auth/google/secrets
    Mongo connected
    Your service is live 🎉
    ```

------

## 5. Issues Faced Today & Fixes

| Issue                                                 | Cause                                                   | Fix                                                          |
| ----------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| `redirect_uri_mismatch`                               | Redirect URI not matching Google console                | Added correct URIs (local + production)                      |
| `Query.prototype.exec() no longer accepts a callback` | Mongoose v7+ changed API                                | Removed old plugin versions, upgraded to compatible `passport-local-mongoose` |
| `TypeError: reading 'ES6'`                            | `mongoose-findorcreate` not compatible with Mongoose v8 | Wrote a custom `findOrCreate` static method                  |
| `SyntaxError: Unexpected end of input`                | Incomplete code block in `app.js`                       | Closed all braces/parentheses properly                       |
| `Detected service running on port 10000`              | Hardcoded port `3000`                                   | Switched to `process.env.PORT`                               |
| `E11000 duplicate key error`                          | Duplicate username/email on Google login                | Improved `findOrCreate` logic to check existing user first   |

------

## 6. Next Steps

- Improve Google login logic → link accounts instead of duplicate key errors.
- Add **better error handling** (show error messages to users).
- Enhance **UI/UX** (success/failure feedback).
- Add features like editing/deleting secrets.
- Strengthen **security**: CSRF, input validation, secure cookies.
