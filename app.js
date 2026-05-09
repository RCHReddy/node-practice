const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

app.use("/admin",adminAuth,(req,res,next)=>{
console.log('admin route accessed');
res.send('welcome admin!');
});

app.use("/user",userAuth,(req,res,next)=>{
console.log('user route accessed');
    res.send('welcome user!');
});

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
app.listen(3000,()=>{
    console.log('server started listening on port:3000');
});
