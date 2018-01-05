const express = require('express');
const bodyparser = require('body-parser');
let ejs = require('ejs');
let mongojs = require('mongojs');
let db = mongojs("mongodb://akhil1672:akhil1672@ds239587.mlab.com:39587/members1672", ['members']);
//let mongoc = require('mongodb').MongoClient;
//var uri = "mongodb://akhil1672:akhil1672@ds239587.mlab.com:39587/members1672";
let uname,age,password='';
let app = express();
app.set('view engine','.ejs');
app.use(bodyparser());
let agevalidate = function(req,res,next){
    uname=req.body.uname;
    pass1=req.body.pass1;
    pass2=req.body.pass2;
    age=req.body.age;
    let obj = 
        {
            uname:uname,
            pass:pass1,
            age:age
        }
    //console.log(age);
    //console.log(uname);
    if(age<18 || !uname || !pass1 || !pass2 || (pass1!=pass2))
    {
        res.render('./events/ageerr');
    }
    else
    {
            db.members.save(obj, function (err1, res1) {
                if (err1) {
                    res.render('./events/loginerr');
                }
                else{
                    console.log("inserted into db");
                    res.render('./events/success',{name:''});
                          }    
            })
    }
    next();
}
let loginvalidate = function(req,res,next)
{
    let uname=req.body.userid;
    let pass=req.body.password;
    if(!uname || !pass)
    {
        res.render('./events/loginerr');
    }
    else{
            db.members.findOne({uname:uname},function(err1,result){
                let obj1=result;
                //console.log(result);
                //console.log(uname);
                if(err1)
                {
                    res.render("./events/loginerr");
                }
                else
                {
                    if(result.uname==uname && result.pass==pass)
                        res.render('./events/success',{name:uname});
                    else
                        res.render('./events/loginerr');
                }
            })
        
        //res.render('./events/home');
    }
    next();
}
app.get('/',function(req,res){
    res.render('./events/home');
})

app.get('/login',function(req,res){
    res.render('./events/login');
})

app.post('/login',loginvalidate,function(req,res){

})

app.get('/signup',function(req,res){
    res.render('./events/signup');
})

app.post('/signup', agevalidate, function (req1, res1) {

})
app.listen(process.env.PORT||3000,console.log("Listening on 3000 "));
