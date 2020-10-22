// const spicedPg = require("spiced-pg");
// const db = spicedPg(
//     process.env.DATABASE_URL ||
//         `postgres:august:postgres@localhost:5432/socialnetwork` // database name here at end
// );

// module.exports.createUser = (first, last, email, password) => {
//     return db.query(
//         `INSERT INTO users (first, last, email, password)
//         VALUES ($1, $2, $3, $4) RETURNING id`,
//         [first, last, email, password]
//     );
// };

// module.exports.createCode = (email, code) => {
//     return db.query(
//         `
//         INSERT INTO resetcodes (email, code)
//         VALUES ($1, $2) RETURNING id
//         `,
//         [email, code]
//     );
// };

// module.exports.returnUser = (email) => {
//     return db.query(
//         `
//         SELECT * FROM users WHERE email = $1
//         `,
//         [email]
//     );
// };

// module.exports.returnUserById = (email) => {
//     return db.query(
//         `
//         SELECT * FROM users WHERE id = $1
//         `,
//         [email]
//     );
// };

// module.exports.checkCode = (email, code) => {
//     return db.query(
//         `
//         SELECT * FROM resetcodes
//         WHERE
//             email = $1
//             AND code = $2
//             AND created_at > CURRENT_TIMESTAMP - INTERVAL '10 minutes'
//         `,
//         [email, code]
//     );
// };

// module.exports.updatePassword = (email, password) => {
//     return db.query(
//         `
//         UPDATE users
//         SET password = $2
//         WHERE email = $1
//         `,
//         [email, password]
//     );
// };

// module.exports.uploadPic = (id, file) => {
//     return db.query(
//         `
//         UPDATE users
//         SET profilepic = $2
//         WHERE id = $1
//         RETURNING profilepic
//         `,
//         [id, file]
//     );
// };

// module.exports.updateBio = (id, bio) => {
//     return db.query(
//         `
//         UPDATE users
//         SET bio = $2
//         WHERE id = $1
//         RETURNING bio
//         `,
//         [id, bio]
//     );
// };

// module.exports.returnOtherProfile = (id) => {
//     return db.query(
//         `
//         SELECT id, first, last, profilepic, bio
//         FROM users
//         WHERE id = $1
//         `,
//         [id]
//     );
// };

// module.exports.findPeople = () => {
//     return db.query(
//         `
//         SELECT * FROM users ORDER BY id DESC LIMIT 3
//         `
//     );
// };

// module.exports.findNewPeople = (id, search) => {
//     return db.query(
//         `
//         SELECT * FROM users
//         WHERE first ILIKE $2
//         AND id != $1
//         ORDER BY id DESC LIMIT 3
//         `,
//         [id, search + "%"]
//     );
// };

// module.exports.insertNamesAndSignature = (first, last, signature) => {
//     console.log("insertNamesAndSignature ran!");
//     return db.query(
//         `INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id`,
//         [first, last, signature]
//     );
// };
