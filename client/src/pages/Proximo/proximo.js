import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';
import './proximo.css';
import Axios from 'axios';
import { useHistory, Redirect } from "react-router-dom";
import CriarNavBar from '../navbar/navbar';

function Proximo() {

    const [pesquisa, setPesquisa] = useState('');

    let history = useHistory();
    const [eventos, setEventos] = useState([])
    useEffect(() => {

        if (localStorage.getItem('user-info')) {
            let user = JSON.parse(localStorage.getItem('user-info'))
            const docid = user.result[0].doc_type;
            Axios.get(`http://localhost:3001/eventosproximos/${docid}`).then((response) => {
                setEventos(response.data);
            })
        } else {
            history.push("/")
        }
    }, [])

    return (


        <div className="TodosOsEventos">
            <CriarNavBar />
            <div className="mt-3 barra_pesquisa">
                <input type="text" placeholder="Digite para pesquisar Evento..." className="pesquisa-evento col-md-12 col-sm-12" onChange={event => { setPesquisa(event.target.value) }}></input>
            </div>
            {eventos.filter((val) => {
                if (pesquisa == "") {
                    return val
                } else if (val.titulo.toLowerCase().includes(pesquisa.toLowerCase())) {
                    return val
                }
            }).map((val) => {
                return <div className="col-md-12 col-sm-12">
                    <div className="card-body">
                        <h5 className="card-title">{val.titulo}</h5>
                        <p className="card-text">{val.descricao}</p>
                    </div>
                </div>;
            })}
        </div>
    );
}

export default Proximo