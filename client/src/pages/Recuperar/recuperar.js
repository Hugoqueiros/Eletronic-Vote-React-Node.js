import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';
import './recuperar.css';
import Axios from 'axios';
import { useHistory, Redirect } from "react-router-dom";
import CriarNavBar from '../navbar/navbar';
import axios from 'axios';
import Forca_password from './forcapassword';
import swal from 'sweetalert';

function Recuperar() {

    let history = useHistory();
    const [password, setNewPassword] = useState('');
    const [password_atual, setPasswordAtual] = useState('')

    const ChangePass = () => {
        if (password == "") {
            swal({
                title: "Erro!",
                icon: "warning",
                text: "Password Submetida deve conter carateres!",
                button: "Fechar",
              });
        }
        else {
            let user = JSON.parse(localStorage.getItem('user-info'))
            const id_user = user.result[0].id;
            axios.post(`http://localhost:3001/recuperar/${id_user}`, { password_nova: password, password_atual: password_atual }).then((response) => {
                if (response.data.message == "mudou") {
                    swal({
                        title: "Password mudada com sucesso!",
                        icon: "success",
                        button: "Fechar",
                    });
                    history.push("/eventos")
                }
                if(response.data.message == "erro"){
                    swal({
                        title: "Erro!",
                        icon: "error",
                        text: "Passwords Inseridas Inválidas!",
                        button: "Fechar",
                      });
                }
            })
        }
    };



    return (

        <div className="TodosOsEventos">
            <CriarNavBar />
            <div className="col-md-12 col-sm-12">
                <div className="card-body">
                    <h5 className="title-change font-weight-bold">Mudar Password</h5>
                    <input type="password" className="card-change col-md-7 col-sm-7 mb-2" placeholder="Insira a password atual" onChange={(even) => { setPasswordAtual(even.target.value) }}></input>
                    <input type="password" className="card-change col-md-7 col-sm-7 mb-2" placeholder="Insira a nova password" onChange={(event) => { setNewPassword(event.target.value) }}></input>
                    <button onClick={ChangePass} type="button" className="btn-disponible mb-2" useHistory="/eventos"><i className="fas fa-lock" />&nbsp;&nbsp;
                        Mudar Password
                    </button>
                    <Forca_password password={password} />
                </div>

            </div>;
        </div>

    );
}

export default Recuperar