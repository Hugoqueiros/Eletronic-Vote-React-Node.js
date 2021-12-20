import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';
import './Events.css';
import Axios from 'axios';
import { useHistory, Redirect } from "react-router-dom";
import CriarNavBar from '../navbar/navbar';
import swal from 'sweetalert';

function Events() {

    const [pesquisa, setPesquisa] = useState('')

    let history = useHistory();
    const [eventos, setEventos] = useState([])
    const [eventosvotados, setEventos_votados] = useState([])
    const [id_evento, setEventosCandidatos] = useState([])
    var z;
    let i;
    let infoevents = [];

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            let user = JSON.parse(localStorage.getItem('user-info'))
            const id_user = user.result[0].id;
            const docid = user.result[0].doc_type;
            Axios.get(`http://localhost:3001/eventos/${docid}`).then((response) => {
                setEventos(response.data);
            })
            Axios.get(`http://localhost:3001/eventos_votados_utilizador/${id_user}`).then((response) => {
                setEventos_votados(response.data)
            })
        } else {
            history.push("/")
        }
    }, [])

    function Voto_final(id) {
        let user = JSON.parse(localStorage.getItem('user-info'))
        const utilizador_id = user.result[0].id;
        const evento_id = id;
        Axios.post("http://localhost:3001/verifica_voto/", { utilizador_id: utilizador_id, evento_id: evento_id}).then((response) => {
            if (response.data.message == "erro") {
                swal({
                    title: "Já votou neste Evento!",
                    text: "Verifique o email para a verificação de confirmação do voto!",
                    icon: "error",
                    button: "Fechar",
                });
                history.push("/eventos");
            }
            if (response.data.message == "voto") {
                history.push(`/eventos/${id}`);
            }
        })
    }

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

                        <button onClick={() => {
                            Voto_final(val.id);
                        }} type="button" className="btn btn-disponible"><i className="fas fa-vote-yea" /> &nbsp;&nbsp;
                            Votar
                        </button>

                    </div>
                </div>;
            })}

            ))
        </div>
    );
}


export default Events
