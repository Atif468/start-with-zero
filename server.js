import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(path.resolve(), "/public")));
const PORT = 8080;
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
}).then(() => {
    console.log("database connected");
}).catch((error) => {
    console.log("Error occurs to connect with DB", error);
})

const userSchema = mongoose.Schema({
    user: {
        unique: true,
        require: true,
        type: String,
    },
    email: {
        unique: true,
        require: true,
        type: String,
    }
})

const userModel = mongoose.model("userModel", userSchema);

const sendtodb = (data) => {
    userModel.create({
        user: data.name,
        email: data.email,
    }).then(() => {
        console.log("successfully send to db");
    }).catch((error) => {
        console.log("error in sending to db");
    })
}
const checklogin = (req, res, next) => {
    console.log("cookie check");
    const cook = req.cookies.user;
    console.log(cook);
    if( cook )
    {
        res.render("success");
    }
    next();
    
}

app.use(cookieParser());

app.get("/",  checklogin, (req, res) => {
    // console.log(path.resolve());
    // res.sendFile(path.join(path.resolve(), "/index"))
    console.log("home");
    res.render("index");
})

app.get("/logout", (req, res) => {

    res.clearCookie("user");
    console.log("logout");
    res.redirect("/");
})

app.get("/success", (req, res) => {
    res.render("success");
})

app.post("/login", (req, res) => {
    sendtodb(req.body);
    console.log(req.body);
    res.cookie("user", req.body.name);
    res.redirect("/success");
})

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});