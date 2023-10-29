// frontend/src/components/LoginFormModal/index.js
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [submitReady, setSubmitReady] = useState(false)
    const [errors, setErrors] = useState({});
    const [inv, setInv] = useState(false)
    const { closeModal } = useModal();
    useEffect(() => {

        if (credential.length >= 4 && password.length >= 6) {
            setSubmitReady(true)
        } else { setSubmitReady(false) }

    }, [password, credential])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setInv(true)
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);

                }
            });


    };

    return (
        <>
            <h1>Log In</h1>
            {inv && <p>Invalid credential or password</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
                <button type="submit" disabled={!submitReady}>Log In</button>
            </form>
        </>
    );
}

export default LoginFormModal;
