const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const mongoose = require("mongoose");
// let alert = require('alert'); 
const notifier = require('node-notifier');


//database work
mongoose.connect("mongodb://localhost:27017/user_info");

const user_schema = new mongoose.Schema({
    email : String,
    Password : String
});

const User_data = mongoose.model("User_data",user_schema);


app.get("/",(req,res)=>{
    res.render("register.ejs",{
        
    });
})

app.post("/",(req,res)=>{
    const a = req.body.email;
    const b = req.body.Password;

    User_data.findOne({email : a})
    .then((foundUser)=>{
        if(foundUser){
            notifier.notify({
                title: 'Salutations!',
                message: 'User already exists',
                // icon: path.join(__dirname, 'icon.jpg'),
                sound: true,
                wait: true
              });
            res.redirect("/");
        }else{
            const user = new User_data({
                email : a,
                Password : b,
            });
            user.save();
            res.redirect("/");
        }
    });
});


app.get("/login",(req,res)=>{
    res.render("login.ejs",{

    });
});


app.post("/login",(req,res)=>{
    var a = req.body.email;
    var b = String(req.body.Password);
    User_data.find({email:a})
    .then((founded_)=>{
        if(founded_[0]){
            if(founded_[0].Password===b){
                res.render("secret_page.ejs");
            }else{
                notifier.notify({
                    title: 'Salutations!',
                    message: 'Please enter correct password',
                    // icon: path.join(__dirname, 'icon.jpg'),
                    sound: true,
                    wait: true
                  });
                  res.redirect("/login");
            }
        }else{
            notifier.notify({
                title: 'Salutations!',
                message: 'Please register first',
                // icon: path.join(__dirname, 'icon.jpg'),
                sound: true,
                wait: true
              }),
            res.redirect("/login");
        }
    })
    .catch((err)=>{
            console.log(err);
    });
})




app.listen(3000,(req,res)=>{
    console.log("app is listening at port 3000");
})