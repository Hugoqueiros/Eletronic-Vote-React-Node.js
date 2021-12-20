import React, { useEffect, useState } from 'react';
import './vote.css';
import { Link, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import CriarNavBar from '../navbar/navbar';
import swal from 'sweetalert';

function Vote() {
    let history = useHistory();
    let { id } = useParams();
    const [candidato, setCandidatos] = useState([]);
    let idcandidato = '0';


    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            axios.get(`http://localhost:3001/candidatoseventos/${id}`).then((response) => {
                setCandidatos(response.data)
            })
        } else {
            history.push("/")
        }
    }, [id]);

    function select_candidato(idcanditoTARGETING) {
        idcandidato = idcanditoTARGETING.target.value
    }

    function Voto_final() {
        let user = JSON.parse(localStorage.getItem('user-info'))
        const utilizador_id = user.result[0].id;
        const evento_id = id;
        const candidato_id = idcandidato;
        axios.post("http://localhost:3001/votar/", { utilizador_id: utilizador_id, evento_id: evento_id, candidato_id: candidato_id }).then((response) => {
            if (response.data.message == "erro") {
                swal({
                    title: "O voto já foi efetuado anteriomente!",
                    text: "Verifique o email para a verificação de confirmação do voto!",
                    icon: "error",
                    button: "Fechar",
                });
                history.push("/eventos");
            }
            if (response.data.message == "voto") {
                swal({
                    title: "Voto Efetuado com Sucesso!",
                    text: "Verifique o email para a confirmação do voto!",
                    icon: "success",
                    button: "Fechar",
                });
                history.push("/eventos");
            }
        })
    }

    return (
        <div className="">
            <CriarNavBar />
            <div className="center-vote mt-3">
                Votar
            </div>
            <div className="container mt-3">
                <div className="card">
                    {candidato.map((val) => {
                        return <div className="col-12 center">
                            <div className="input-group-prepend">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="candidato_escolhido" onChange={select_candidato.bind(this)} value={val.id} />
                                    <label className="form-check-label" for="exampleRadios1"> {val.nome}</label>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div className="center-button mt-2">
                <button onClick={Voto_final} type="button" className="fas fa-vote-yea btn btn-disponible" name="votar">
                    Confirmar Voto
                </button>
            </div>
        </div>

    )
}
export default Vote;

