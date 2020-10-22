const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
// const { hash, compare } = require("./bc.js");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
// const ses = require("./ses.js");
// const s3 = require("./s3.js"); // this correct?
// const s3Url = "https://s3.amazonaws.com/spicedling/";

const server = require("http").Server(app);
// const io = require("socket.io")(server, { origins: "localhost:8080" });

const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:august:postgres@localhost:5432/bandsite` // database name here at end
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public")); // added by me
app.use(express.json());
app.use(compression());

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// #### FILE UPLOAD BOILER PLATE ###### //

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
// const { Server } = require("http");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(csurf()); // added on 6.7.2020

app.use(function (req, res, next) {
    // added on 6.7.2020
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
// io.use(function (socket, next) {
//     cookieSessionMiddleware(socket.request, socket.request.res, next);
// });

// #### END BOILER PLATE ###### //

// #### ROUTES ###### //

app.post("/email/submit", (req, res) => {
    insertEmail(req.body.email)
        .then((result) => {
            // console.log("result: ", result);
            res.json(result);
        })
        .catch((err) => {
            console.log('app.post("/email/submit") error: ', err);
        });
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080, function () {
    console.log("I'm listening.");
});

// ######## Query Function ######## //

function insertEmail(email) {
    console.log("insertEmail ran!");
    return db.query(
        `
        INSERT INTO emails (email) VALUES ($1) RETURNING email
        `,
        [email]
    );
}
