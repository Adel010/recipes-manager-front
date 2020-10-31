import React, { useState } from "react";
import PropTypes from "prop-types";
import { ApiErrors, fetchApi } from "../funcs/fetchApi";
import { Loader } from "../ui/loader";



function LoginForm({onConnect}){
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);



    async function handleSubmit(e){
        e.preventDefault();
        setError(null);
        setLoading(true);
        const formData = new FormData(e.target);
        try{
            const user = await fetchApi("login",{
                method: "POST",
                body: formData,
            });
            onConnect(user)
        }catch(e){
            if(e instanceof ApiErrors){
                setError(e.errors[0].message)
            }else{
                console.error(e);
            }
            setLoading(false)
        }        
    }

    return <div className="form-container">
        <h2>Login</h2>
        {error && <LoginError>{error}</LoginError>}
        <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="username">User name</label>
            <input type="text" name="email" id="email" className="form-field" required/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className="form-field" required/>
            <button type="submit" disabled={loading}>{loading ? <Loader size="small" color="black" /> : "Login"}</button>
        </form>
    </div>
}
LoginForm.propTypes = {
    onConnect: PropTypes.func.isRequired
}

function LoginError(props){
    return <div className="login-error-container">
        <p>{props.children}</p>
    </div>
}

export default LoginForm;