import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

import { init } from "./socket";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname !== "/welcome") {
    // init(store);
    // <Provider store={store}>
    elem = <App />;
    // </Provider>;
} else {
    elem = (
        <div>
            <Welcome />
            {/* <img src="./bass-logo.png" /> */}
        </div>
    );
}

// let elem;
// if (location.pathname === "/welcome") {
//     // index.js controls what routes may be accessed. start.js merely serves after the client is routed
//     // runs if not logged in
//     elem = (
//         <div>
//             <Welcome />
//             <img src="./bass-logo.png" />
//         </div>
//     );
// } else {
//     // runs if logged in
//     // elem = <img src="./bass-logo.png" />;
//     elem = <App />; // need to use for part 4
// }

ReactDOM.render(elem, document.querySelector("main"));

// function Welcome() {
//     return <div>Welcome to the Revolution site!</div>;
// }

// function Registration() {
//     return <button>Sign Up</button>;
// }

// ReactDOM.render(<HelloWorld />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }

// React documentation in forms (Ivana)
