import React, { useEffect, useState } from 'react';
import './results.css';
import { Link, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import CriarNavBar from '../navbar/navbar';

function Results() {
    let history = useHistory();
    const [candidato, setCandidatos] = useState([]);
    const [evento, setEvento] = useState([]);
    let { id } = useParams();

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
        axios.get(`http://localhost:3001/resultados/${id}`).then((response) => {
            setCandidatos(response.data)
        })
        axios.get(`http://localhost:3001/tituloevento/${id}`).then((response) => {
            setEvento(response.data)
        })} else{
            history.push("/")
        }
    }, [id]);

    return (
        <div className="">
            <CriarNavBar />
            {evento.map((eve) => {
                return (
                    <div className="center-vote mt-3">
                        Resultados do Evento {eve.titulo}
                    </div>
                )
            })}
            <div className="center-vote mt-3">
            </div>
            <div className="container mt-3">
                <div className="card">
                    {candidato.map((val) => {
                        return <div className="col-12 center">
                            <div className="input-group-prepend">
                                <div className="form-check">
                                    <label className="form-check-label" for="exampleRadios1"> {val.nome} com {val.n_votos} votos </label>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>

    )
}
export default Results;