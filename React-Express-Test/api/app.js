var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var bodyParser = require("body-parser");
const passport = require("passport");

var app = express();

// Routing
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var gestioneAnnunciRouter = require("./routes/gestioneAnnunci");
var gestionePrenotazioniRouter = require("./routes/gestionePrenotazioni");
var gestionePagamentiRouter = require("./routes/gestionePagamenti");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "images")));
app.use(passport.initialize());
app.use(passport.session());

// App use Routing
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/gestioneAnnunci", gestioneAnnunciRouter);
app.use("/gestionePrenotazioni", gestionePrenotazioniRouter);
app.use("/gestionePagamenti", gestionePagamentiRouter);


// middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.session({ resave: false, saveUninitialized: true, secret: "secretKey123!!" }));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
