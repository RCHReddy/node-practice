const express = require('express');
const connectDB = require('./config/database');
const { adminAuth, userAuth } = require('./middlewares/auth');
const User = require('./models/user');

const app = express();

app.use(express.json());

connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
        console.log('Server started listening on port:3000');
    });
}).catch((error) => {
    console.error('Database connection failed:', error);
});

app.post("/signup",async (req,res)=>{
    console.log('signup route accessed-----',req.body);
    try {
        const user = new User(req.body);
        await user.save();
        res.send('user created successfully!');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user'+error.message);
    }       
});

// get user by email Id
// http://localhost:3000/users/john.doe@example.com
app.get("/users/:email",async (req,res)=>{
    try {
        const user = await User.findOne({email:req.params.email});
        if(!user){
            return res.status(404).send('User not found');
        }   
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
});

// update user by userId
// http://localhost:3000/users/64b8c9f1e5a4c2d3f8a9b0c
app.patch("/users/:id",async (req,res)=>{
    try {
        const ALLOWED_UPDATES = ['name','password','age','photo','about','gender'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => ALLOWED_UPDATES.includes(update));
        if (!isValidOperation) {
            return res.status(400).send('Invalid update fields');
        }
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!user){
            return res.status(404).send('User not found');
        } 
        console.log('updated user:',user);      
        res.send(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

// update user by email Id
// http://localhost:3000/users/email/john.doe@example.com
app.patch("/users/email/:email",async (req,res)=>{
    try {
        const email = decodeURIComponent(req.params.email);
        console.log('req.params.email,req.body-----',email,req.body);
        const user = await User.findOneAndUpdate({email},req.body,{new:true,runValidators:true});
        if(!user){
            return res.status(404).send('User not found');
        } 
        console.log('updated user:',user);      
        res.send(user);
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(400).send({ error: error.message });
    }
}); 

// delete user by userId
// http://localhost:3000/users/64b8c9f1e5a4c2d3f8a9b0c
app.delete("/users/:id",async (req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
}); 

// get all users feed api
// http://localhost:3000/users
app.get("/users",async (req,res)=>{
    try {
        const users = await User.find();
        if(users.length === 0){
            return res.status(404).send('No users found');
        }   
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

// app.use("/admin",adminAuth,(req,res,next)=>{
// console.log('admin route accessed');
// res.send('welcome admin!');
// });

// app.use('/user/getdata',(req,res)=>{
//     throw new Error('Something went wrong while fetching user data!');
//     res.send('welcome user to get data!',{name:'john',age:30});
// });

// app.use("/user",userAuth,(req,res,next)=>{
// console.log('user route accessed');
//     res.send('welcome user!');
// });

// app.use("/",(err,req,res,next)=>{
//     if(err){
//         console.error(err.stack);
//         res.status(500).send('Something went wrong!');
//     } else {
//         next();
//     }
// });

// app.use('/user',[(req,res,next)=>{
//     console.log('first ');
//     next();
// },(req,res,next)=>{
//     console.log('second');
//    next();
// }],(req,res,next)=>{
//     next();
//     console.log('third');
    
//    res.send('hello world! 3rd method');
//    //next();
// },
// (req,res,next)=>{
//     console.log('fourth');
//    res.send('hello world! 4th method');
// }
// );

// app.get('/hello/:name/:id/:city',(req,res)=>{
//     console.log(req.params);
//     res.send('hello world! through get method');
// });

// app.get('/hello',(req,res)=>{
//     console.log(req.query);
// res.send('would like to say hello!1213');
// });

// app.use('/test',(req,res)=>{
// res.send('lets test!');
// });

// app.use('/',(req,res)=>{
// res.send('welcome to home!');
// });

