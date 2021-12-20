import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import './Login.css';
import swal from 'sweetalert';

function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(false);
    const [verificacao, setVerificacao] = useState(true);
    Axios.defaults.withCredentials = true;


    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            history.push("/eventos")
        }
    }, [])

    async function login() {

        let item = { email, password };
        let result = await fetch("http://localhost:3001/login",{
            method: 'POST',
            headers:{"Content-Type":"application/json",
                "Accept":'application/json'

            },
            body:JSON.stringify(item)

        })
        result = await result.json();
        localStorage.setItem("user-info",JSON.stringify(result))
        swal({
            icon: 'info',
            title: 'Está a entrar na conta!',
            timer: 2000,
            onBeforeOpen: () => {
                swal.showLoading()
        }});
        history.push("/eventos")
    }

    return (
        <div className="login-content d-flex align-items-center">
            <form className="form-signin mx-auto">
                <div className="text-center mb-4">
                    <h1 className="h3 mb-3 font-weight-normal text-black font-weight-bold">Login</h1>
                </div>


                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} id="inputEmail" class="form-control my-4" />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} id="inputPassword" class="form-control my-4" />


                <button onClick={login} className="btn btn-lg btn-block btn-login mb-5" type="button">Entrar</button>

                <div className="login-msg-erro text-center">
                    {verificacao == false && <span><strong>Dados Inseridos Inválidos</strong></span>}
                </div>

            </form>
        </div>
    )
}
export default Login;
