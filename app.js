const express = require('express');

const app = express();


app.use('/hello',(req,res)=>{
res.send('would like to say hello!1213');
});

app.use('/test',(req,res)=>{
res.send('lets test!');
});

app.use('/',(req,res)=>{
res.send('welcome to home!');
});
app.listen(3000,()=>{
    console.log('server started listening on port:3000');
});
