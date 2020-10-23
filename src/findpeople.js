import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
// import { response } from "express";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        console.log("mounted findpeople function ran");
        let abort;
        (async () => {
            const { data } = await axios.get("/findpeople");
            console.log("axios.get /findpeople ran");
            if (!abort) {
                setUsers(data.rows);
                console.log("if !abort ran");
            }
        })();

        if (search == "") {
            setResults([]);
            console.log("if search === '' ran");
        } else {
            (async () => {
                const { data } = await axios.get(
                    `/findnewpeople?search=${search}`
                );
                setResults(data.rows);
                console.log("else search === '' ran");
                console.log("data.rows", data.rows);
            })();
        }
        console.log("users:", users);
        console.log("results: ", results);
        return () => {
            abort = true;
        };
    }, [search]);

    return (
        <div>
            <h3>low-end search feature</h3>
            <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search bassists"
            />
            {search == "" && (
                <div>
                    {users.map((user, index) => (
                        // mapping our most recent users
                        <Link key={index} to={`/user/${user.id}`}>
                            <div>
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            {search != "" && (
                <div>
                    {results.map((result, index) => (
                        // mapping our most recent users
                        <Link key={index} to={`/user/${result.id}`}>
                            <div>
                                <p>
                                    {result.first} {result.last}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
