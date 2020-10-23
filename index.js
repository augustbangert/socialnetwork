const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./public/sql/db.js");
const { hash, compare } = require("./bc.js");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses.js");
const s3 = require("./s3.js"); // this correct?
const s3Url = "https://s3.amazonaws.com/spicedling/";

const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

app.use(express.static("public")); // added by me
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
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// ######## POST ROUTES ######## //

// instructions for how the post listener will post when requested:
app.post("/registration", (req, res) => {
    // need to add an if statement that prevents all fields from not being filled out
    // console.log("app.post /registration req.body: ", req.body);
    hash(req.body.password)
        .then((hashedPassword) => {
            db.createUser(
                // db.createUser to avoid requiring every needed query
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPassword
            )
                .then((databaseResult) => {
                    // console.log("createUser query success: ", databaseResult);
                    req.session.userId = databaseResult.rows[0].id;
                    // console.log("req.session.userId", req.session.userId);
                    // console.log("req.session", req.session);
                })
                .catch((err) => {
                    console.log("createUser query error: ", err);
                });
        })

        .catch((err) => {
            console.log("index.js post route error: ", err);
        });
});

app.post("/login", (req, res) => {
    // console.log("app.post(/login ran");
    db.returnUser(req.body.email)
        .then((result) => {
            if (result.rows.length != 0) {
                return compare(req.body.password, result.rows[0].password).then(
                    (match) => {
                        req.session.userId = result.rows[0].id; // should work
                        res.json(true);
                        // need to set session cookie!!!!
                    }
                );
            } else {
                res.json(false);
            }
        })
        .catch((err) => {
            console.log("db.returnUser error", err);
        });
});

app.post("/resetpassword/email", (req, res) => {
    console.log('"app.post(/resetpassword/email" fired');
    db.returnUser(req.body.email)
        .then((result) => {
            // console.log("req.body.email: ", req.body.email);
            // console.log("/resetpassword/email .then() result: ", result);
            if (result.rows.length == 0) {
                // console.log(
                //     "/resetpassword/email result.rows is 0: ",
                //     result.rows
                // );
                // console.log("result: ", result);
                // display error!!!
                res.json(false);
            } else {
                const code = cryptoRandomString({ length: 6 });
                console.log("code: ", code);
                db.createCode(req.body.email, code)
                    .then((resultId) => {
                        ses.sendEmail(
                            req.body.email,
                            "Here is your reset code, use within 10 minutes",
                            code
                        ).then(() => {
                            res.json(true);
                        });
                    })
                    .catch((err) => {
                        console.log("db.createCode error: ", err);
                    });
            }
        })
        .catch((err) => {
            console.log("/resetpassword/email db.returnUser error: ", err);
        });
});

app.post("/resetpassword/code", (req, res) => {
    // console.log('"app.post(/resetpassword/code" fired');
    // console.log("req.body.email req.body.code", req.body.email, req.body.code);
    db.checkCode(req.body.email, req.body.code)
        .then((result) => {
            // console.log("/resetpassword/code result.rows: ", result.rows);
            if (result.rows != 0) {
                hash(req.body.password)
                    .then((hashedPassword) => {
                        return db
                            .updatePassword(req.body.email, hashedPassword)
                            .then((result) => {
                                // console.log(
                                //     "db.updatePassword success: ",
                                //     result
                                // );
                                res.json(true);
                            })
                            .catch((err) => {
                                console.log("db.updatePassword error: ", err);
                            });
                    })
                    .catch((err) => {
                        console.log("password hashing error", err);
                    });
            }
        })
        .catch((err) => {
            console.log("db.checkCode .catch()", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("req.body", req.body);
    const { filename } = req.file;
    const imageUrl = s3Url + filename;
    // console.log("imageUrl: ", imageUrl);
    db.uploadPic(req.session.userId, imageUrl)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/updatebio", (req, res) => {
    // console.log("req.body.bio: ", req.body.bio);
    db.updateBio(req.session.userId, req.body.bio)
        // console.log("req.body", req.body);
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("/updatebio post error: ", err);
        });
});

// ######## GET ROUTES ######## //

app.get("/logout", (req, res) => {
    // console.log("app.get logout");
    req.session.userId = null;
    res.redirect("/");
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        // if logged in...
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user", (req, res) => {
    console.log("req.session.userId: ", req.session.userId);
    db.returnUserById(req.session.userId)
        .then((result) => {
            // console.log(".get /user result: ", result);
            // console.log(".get /user result.rows: ", result.rows);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log(".get /user err: ", err);
            res.json(false);
        });
});

app.get("/api/user/:id", (req, res) => {
    // console.log("app.get /api/user/:id req.session: ", req.session);
    // console.log("app.get req.params: ", req.params);
    db.returnOtherProfile(req.params.id)
        .then((result) => {
            // console.log("app.get /api/user/:id success");
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("app.get /api/user/:id error", err);
        });
});

// app.get("/newusers", async (req, res) => {
//     let result;
//     try {
//         result = await db.findPeople(req.session.userId);
//     } catch (err) {
//         console.log("app.get /newusers error: ", err);
//         result = false;
//     }
//     res.json(result);
// });

app.get("/findpeople", (req, res) => {
    db.findPeople(req.session.userId)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log("app.get /findpeople error: ", err);
            res.json(false);
        });
});

app.get("/findnewpeople", (req, res) => {
    // console.log("app.get /findnewpeopleran");
    // console.log("req.body", req.body);
    // console.log("req.query.search", req.query.search);
    db.findNewPeople(req.session.userId, req.query.search)
        .then((result) => {
            console.log("app.get findnewpeople success result: ", result);
            res.json(result);
        })
        .catch((err) => {
            console.log("app.get findnewpeople error: ", err);
            res.json(false);
        });
});

app.get("*", function (req, res) {
    // the "*" is a sort of "catch all" in case no other routes run
    if (!req.session.userId) {
        // if not logged in...
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
}); // change to server.listen for part 10!

io.on("connection", function (socket) {
    console.log(`socket id ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    // db.getLastTenMsgs().then((data) => {
    //     console.log(data.rows);
    //     io.sockets.emit("chatMessages", data.rows);
    // });
});

// ######## POSTGRESQL COMMANDS ######## //
// MANY COMMANDS ONLY WORK WHEN RUN OUTSIDE OF POSTGRES //
// ######## POSTGRESQL COMMANDS ######## //
// psql // login into postgresql
// \l tables // lists databases
// \q // quits postgresql
// createdb databasename // creates database (run outside of psql)
// psql -d databasename // opens database
// psql -d databasename -f tablename.sql // creates a table in the specified database
// \c databasename // opens database
// \dt // lists the table in the current database
// sudo -u postgres psql -U postgres // login as desired user
// sudo su postgres // login as postgres user
// DROP DATABASE [IF EXISTS] databasename; // deletes database
// DROP USER [IF EXISTS] username; // deletes user
// DROP DATABASE databasename; // deletes database
// SELECT * FROM tablename; // displays (in psql) the contents of the table
// psql databasename -f /full-file-path-here/file-name-here.sql // runs sql file script
// sudo service postgresql start // starts Postgres

// ######### NODE COMMANDS ######### //
// node . // same as node index.js
// nvm ls // lists available node versions
// node -v // prints the node version that is currently in use
// nvm use 12.18.1 // switches to a different node version
// node bundle-server.js // starts bundle server

// ###### DO ON STARTUP ###### //
// sudo service postgresql start
// node bundle-server.js
// node index.js

// ######### DONE ######## //
// ask about uninstalling node 14: set node to switch to v12 upon opening terminal
// why can't I see the session storage after my req.session is successfully set: need to look in cookies
// I am unsure if I completed the last 2 steps: send a response back to React that indicates everything went according to plan
// IF an error occurs, we need to send a response back to React that indicates something went wrong: need to render the state error on screen
// is the dot in node . the same as git add . ? no
// send emails!!!
// fix login!!!! session ids!!!
// when do I use res.json(true) and res.json(false) ? // cleint side recevies this because .json sends it
// why does nothing happen after my login? HAVING TROUBLE WITH ROUTING!!!!

// ####### EXTRA WORK TO DO ###### //
// constructor and prototype excersizes

// ####### TO ASK ###### //

// style with css in React
// is prettier disabled? shows in lower-right corner, but seems turned off
// having trouble getting ONLY the login element to render on screen!!!!!
// how do I get the profile pic of a user to always display when logged in?
// (not just upon upload)
// why are the axios and server routes just made-up file paths? Shouldn't they reflect a file structure?

// how do i do a log out feature?
// why am I automatically logged in as the user in row 1 of my database?
// start.js must be modified still
// when I log in as dill0@example.com my profile is empty
// to log out, create an anchor tag <a> with href path to /logout, then set a server route to make the session id equal null
