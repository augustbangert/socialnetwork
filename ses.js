const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

// exports.sendEmail = function(to, subject, message) {
//     return ses.sendEmail({
//         Source: 'Augy <bangert.august@gmail.com>', // where the email is being sent from
//         Destination: {
//             ToAddresses: [to] // send to email address goes in the array
//         },
//         Message: {
//             Body: {
//                 Text: {
//                     Data: message
//                 }
//             },
//             Subject: {
//                 Data: subject
//             }
//         }
//     }).promise()
//     .then(()=>{console.log("ses.js .then()")}).catch(()=>{console.log("ses.js .catch()")});
// }

// class ResetPassword extends React.Component {
//     constructor() {
//         super();
//         this.state = {};
//     }

//     getCurrentDisplay() {
//         // we want to put something in state that indicates which display we want to show
//         // we'll have to update this property in state whenever we want to show the next display. where in our code should we update this property in state???
//         if () {
//             return (
//                 <div>
//                     <input name='email'></input>
//                     <button>submit</button>
//                 </div>
//             )
//         } else if () {

//         } else {

//         }
//     }

//     render() {
//         return <div>
//             { this.getCurrentDisplay() }
//         </div>;
//     }
// }

exports.sendEmail = function (to, subject, message) {
    return ses
        .sendEmail({
            Source: "August Bangert <road.production@spicedling.email>", // where the email is being sent from
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
