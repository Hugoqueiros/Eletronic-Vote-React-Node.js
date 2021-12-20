import React, { useEffect, useState } from "react";
import './navbar.css';
import { Link, useHistory } from 'react-router-dom';

function CriarNavBar() {
    let user = JSON.parse(localStorage.getItem('user-info'))
    const history = useHistory();
    function logOut() {
        localStorage.clear();
        history.push('/');
    }

    return (

        <nav class="navbar navbar-expand-lg">
            {localStorage.getItem('user-info') ?
                <>
                    <a className="navbar-brand font-weight-bold" href="/recuperar">Bem Vindo, {user.result[0].nome}</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/eventos">Eventos Disponiveis </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/proximos">Próximos Eventos</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/expirados">Histórico de Eventos</a>
                            </li>
                        </ul>
                        <form class="form-inline my-2 my-lg-0">
                            <button class="btn btn-outline-danger my-2 my-sm-0float-end fas fa-power-off" onClick={logOut} >Sair da Conta </button>
                        </form>
                    </div>
                </>
                : history.push('/')}
        </nav>
    )
}

export default CriarNavBar