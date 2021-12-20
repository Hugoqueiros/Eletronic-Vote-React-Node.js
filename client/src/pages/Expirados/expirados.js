import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';
import './expirados.css';
import Axios from 'axios';
import { useHistory, Redirect } from "react-router-dom";
import CriarNavBar from '../navbar/navbar';

function Expirados() {

    let history = useHistory();

    const [eventos, setEventos] = useState([])
    const [pesquisa, setPesquisa] = useState('');

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            let user = JSON.parse(localStorage.getItem('user-info'))
            const docid = user.result[0].doc_type;
            Axios.get(`http://localhost:3001/eventosexpirados/${docid}`).then((response) => {
                setEventos(response.data);
            })
        } else {
            history.push("/")
        }
    }, []/*PARA CHAMAR APENAS UMA VEZ*/)

    return (


        <div className="TodosOsEventos">
            <CriarNavBar />
            <div className="mt-3 barra_pesquisa">
            <input className="pesquisa-evento col-md-12 col-sm-12" type="text" placeholder="Digite para pesquisar Evento..." onChange= {event => {setPesquisa(event.target.value)}}></input>
            </div>
            {eventos.filter((val) => {
                if (pesquisa == ""){
                    return val
                } else if (val.titulo.toLowerCase().includes(pesquisa.toLowerCase())){
                    return val
                }
            }).map((val) => {
                const id_evento = val.id
                return <div className="col-md-12 col-sm-12">
                    <div className="card-body">
                        <h5 className="card-title">{val.titulo}</h5>
                        <p className="card-text">{val.descricao}</p>
                        <button onClick={() => {
                            history.push(`/eventos/results/${val.id}`);
                        }} type="button" className="btn btn-result"><i className="fas fa-vote-yea"/>&nbsp;&nbsp;
                            Ver Resultados
                        </button>
                    </div>
                </div>;
            })}
        </div>
    );
}


export default Expirados
