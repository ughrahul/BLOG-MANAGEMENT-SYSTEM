------------######BLOG MANAGEMENT SYSTEM#####----------------------
=>USER MANAGEMENT
=>BLOG MANAGEMENT
=>EMAIL MANAGEMENT

-----------------------------##--------------------------------

-----!!!!FEATURES!!!!!!-----

1. USER MANAGEMENT

- login
- register (bcryptjs)
- get profile
- update profile
- logout
- forget password
- reset password (admin)
- change password

2. BLOG MANAGEMENT

- get all blogs
- author specific blog
- add new blog
- delete a blog
- get one blog
- search blog
- bookmark blog
  -------------------------------##------------------------------

----------Login(Authentication)-----------
-> Create login controller
-> Create post route as api/v1/users/login
-> In controller, get req.body (email and password)
-> Check if user exists in the system or not
-> If user exist, get hashedPw from Database
-> Compare user provided password with hashedPe
-> If result false, throw new Error ("Email or Password mismatch)

----------(Authorization)---------
->Install npm jsonwebtoken
-> create a token.js file
->make 2 utility functions in token.js (token genereated / token validate)
-> If user successfully logs in,
->Create the user payloads for the json sign utility for signing
-> Add the roles to the user model
->GEt the token and check the token in (jwt.io), check for expiration and data in JSON object

-> send the token to the user through login API.
-> Send the token for every request in req.headers
-> checkRole middleware update using validate utility function
->If false, permission denied error throw
->If true , next()
