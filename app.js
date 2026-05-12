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
    const user = new User(req.body);
    await user.save();
    res.send('user created successfully!');
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

