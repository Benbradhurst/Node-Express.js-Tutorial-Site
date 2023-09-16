const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async(req, res)=>{
    const { username, email, password } = req.body;
    console.log("attempting registerUser");
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    };
    
    const userAvailable = await User.findOne({email});
    console.log("attempting to find user existing...");
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!");
    };

    //Hash password
    console.log("Hashing password....")
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: " +hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User Created: ${user}`);
    if(user) {
        res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    };
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res)=>{
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
        console.log(email, password);
    }
    console.log("User Found")
    const user = await User.findOne({ email });
    //compare password with hashed password
    if(user && (await bcrypt.compare(password,user.password))){
        console.log("user found")
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is not valid")
    }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res)=>{
    res.json({message:"Current user information"});
});


module.exports = { registerUser, loginUser, currentUser };