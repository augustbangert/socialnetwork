import React from "react";
import { Link, Route, BrowserRouter } from "react-router-dom";
import Email from "./email";
import ReactGA from "react-ga";

function initializeReactGA() {
    ReactGA.initialize("UA-173969890-1");
    ReactGA.pageview("/homepage");
}

export default function Home() {
    return (
        <div id="top-div">
            <header>
                <h1>b&#228;rosaurus official site 🦕</h1>
            </header>
            <BrowserRouter>
                <Route
                    exact
                    path="/"
                    render={() => (
                        <div id="home-div">
                            <p>upcoming events:</p>
                            <p className="event-title">b&#228;rosaurus live:</p>
                            <a href="#">Festival [name]: Oct 21st @ 19:00</a>
                            <br />
                            <p>music:</p>
                            <a href="https://www.youtube.com/watch?v=nWsUsGV2iRA">
                                Dirty Paws (cover)
                            </a>
                            <a href="https://www.youtube.com/watch?v=kzMvmswMWw8">
                                Take On Me (live cover)
                            </a>
                            <br />
                            <p>photos:</p>
                            <a href="https://www.instagram.com/baerosaurus/?hl=en">
                                photos & short films here
                            </a>
                            <br />
                            <p>links:</p>
                            <a href="https://www.youtube.com/channel/UC49FIaiH183-g5oDSsIOnSg">
                                YouTube
                            </a>
                            <a href="https://www.instagram.com/baerosaurus/?hl=en">
                                Instagram
                            </a>
                            <a href="https://www.facebook.com/baerosaurus.official">
                                Facebook
                            </a>
                            <a href="https://twitter.com/baerosaurus">
                                Twitter
                            </a>
                            <br />
                            <Link
                                to="/email"
                                className="link"
                                className="contact-details"
                            >
                                join our email list 🦕
                            </Link>
                            <p className="contact-details">
                                booking: baerosaurus@gmail.com
                            </p>
                            <p className="contact-details">
                                copyright (c) b&#228;rosaurus 2020
                            </p>
                        </div>
                    )}
                />
                <Route exact path="/email" render={() => <Email />} />
            </BrowserRouter>
        </div>
    );
}
