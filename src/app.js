const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv/config");

require("./db/mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const multer = require("multer");
const morgan = require("morgan");
const path = require("path");
const hbs = require("hbs");
//load routes
const homeRouter = require("../routes/client/home");
const adminRouter = require("../routes/admin/admin");
const postRouter = require("../routes/admin/post");
const categoriesRouter = require("../routes/admin/categories");
const userRouter = require("../routes/client/user");
//load helpers
const hbsHelpers = require("../helpers/hbs-helpers");

// create express application
const app = express();
//create absolute path
const pubPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
//

const port = process.env.PORT;
// serving up statics
//everthing inside of the public directory was made available via the web server
app.use(express.static(pubPath));

//display request info in the console
// app.use(morgan("dev"));

//
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   secure: true,
    // },
  })
);
app.use(flash());

// local variables using middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.error = req.flash("error");
  app.locals.success_message = req.flash("success_message");
  app.locals.location = req.originalUrl;
  app.locals.error_message = req.flash("error_message");
  next();
});

//setup body parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

//method override
// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(methodOverride("__method"));

// setup hbs
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//
hbs.registerHelper("isPublic", hbsHelpers.isPublic);
hbs.registerHelper("isPrivate", hbsHelpers.isPrivate);
hbs.registerHelper("isDraft", hbsHelpers.isDradt);
hbs.registerHelper("convertTime", hbsHelpers.convertTime);
hbs.registerHelper("breadcrumb", hbsHelpers.breadcrumb);
hbs.registerHelper("generateDate", hbsHelpers.generateDate);

// routes
app.use("/", homeRouter);
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/admin/posts", postRouter);
app.use("/admin/categories", categoriesRouter);

//runnig application by listening to a specific port
app.listen(port, () => {
  console.log("server is runnig on port " + port);
});
//
