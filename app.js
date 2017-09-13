var express= require("express"),
    User = require("./models/user"),
    app = express(),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    Local = require("passport-local"),
    LocalMongo = require("passport-local-mongoose"),
    mongoose= require("mongoose")
    

mongoose.connect("mongodb://localhost/auth",{useMongoClient: true});    
app.set("view engine",'ejs');

app.use(require("express-session")({
    secret:"Mama mia",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());//For passport
app.use(passport.session());//for 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new Local(User.authenticate));



app.get("/", function(req,res){
    res.render('home');
});

app.get("/secret", isLoggedIn ,function(req,res){
    res.render("secret");
});


app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
    
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){
    
});

app.get("/logout", function(req, res) {
   req.logout();
   res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});
