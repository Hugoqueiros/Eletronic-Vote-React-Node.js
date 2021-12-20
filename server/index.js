const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const { response } = require("express");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "voto_eletronico_atw_3",
});

// Conexão ao mysql
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Base de Dados Conectada");
});

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: "voto_eletronico",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}))

//FUNÇÕES LOGIN
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query(
        "SELECT * FROM utilizadores WHERE email = ?;",
        email,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {

                        const id = result[0].id;
                        const token = jwt.sign({ id }, "jwtSecret", {
                        })
                        req.session.user = result;
                        res.json({ auth: true, token: token, result: result });
                    } else {
                    }
                });
            } else {

            }
        }
    );
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
})

//FUNÇÃO PARA OS EVENTOS QUE ESTÃO A DECORRER
app.get("/eventos/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM eventos WHERE doc_id= ? AND data_expiracao >= CURRENT_DATE AND data_inicial <= CURRENT_DATE", id, (err, result) => {
        res.send(result)

    })
})

app.post("/verifica_voto", (req, res) => {
    const evento_id = req.body.evento_id;
    const utilizador_id = req.body.utilizador_id;
    db.query("SELECT COUNT(*) AS votos_users FROM votos WHERE evento_id = ?", evento_id, (err, result_voto) => {
        if(result_voto[0].votos_users == 0){
            res.send({ message: "voto" })
        }
        else{
            res.send({ message: "erro" })
        }
    })
})

app.get("/eventos_votados_utilizador/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT evento_id FROM votos WHERE utilizador_id= ? ", id, (err, result) => {
        res.json(result)
    })
})

//FUNÇÃO PARA RECEBER OS CANDIDATOS DOS EVENTOS
app.get("/candidatoseventos/:id", (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT * FROM eventos_candidatos as ec INNER JOIN candidatos as c ON ec.candidato_id=c.id AND ec.evento_id = ? ORDER BY c.id ASC", id, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.json(result);
            }

        })
})

//FUNÇÃO PARA VOTO
app.post("/votar", (req, res) => {
    const candidato_id = req.body.candidato_id;
    const evento_id = req.body.evento_id;
    const utilizador_id = req.body.utilizador_id;
    console.log(req.body)
    db.query("SELECT COUNT(*) AS votos_users FROM votos WHERE evento_id = ? AND utilizador_id = ?", [evento_id,utilizador_id], (err, result_voto) => {
        console.log(result_voto[0].votos_users)
        if(result_voto[0].votos_users == 0){
            res.send({ message: "voto" })
        db.query("INSERT INTO votos ( candidato_id, evento_id, utilizador_id) VALUES (?,?,?)", [candidato_id, evento_id, utilizador_id], (err, result) => {
            if (err) {
                console.log(err);

            } else {
                db.query("SELECT nome FROM candidatos WHERE id=?", candidato_id, (err, result_candidato) => {
                    db.query("SELECT titulo FROM eventos WHERE id=?", evento_id, (err, result_evento) => {
                        db.query("SELECT email FROM utilizadores WHERE id=?", utilizador_id, (err, result_utilizador) => {
                            var transporter = nodemailer.createTransport({
                                service: 'hotmail',
                                auth: {
                                    user: 'voto_eletronico@hotmail.com',
                                    pass: 'Votoeletronico3226'
                                }
                            });
                            // destinatÃ¡rio e mensagem
                            var mailOptions = {
                                from: 'voto_eletronico@hotmail.com',
                                to: result_utilizador[0].email,
                                subject: 'Confirmação de Voto',
                                text: 'Obrigado pelo seu voto, no evento ' + result_evento[0].titulo + ' no candidato ' + result_candidato[0].nome
                            };
                            // agente de email
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email enviado: ' + info.response);
                                }
                            });
                        })
                    })
                })
            }
        })} else{
            res.send({ message: "erro" })
        }
    })
})

//FUNÇÃO PARA PARA APRESENTAÇÃO DE PRÓXIMOS EVENTOS
app.get("/eventosproximos/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM eventos WHERE doc_id= ? AND data_inicial > CURRENT_DATE", id, (err, result) => {
        res.send(result)

    })
})

//FUNÇÃO PARA PARA APRESENTAÇÃO DE EVENTOS PASSADOS
app.get("/eventosexpirados/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM eventos WHERE doc_id= ? AND data_expiracao < CURRENT_DATE", id, (err, result) => {
        res.send(result)

    })
})

//FUNÇÃO PARA APRESENTAÇÃO DO TÍTULO DO EVENTO NA TELA DOS RESULTADOS
app.get("/tituloevento/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT titulo FROM eventos WHERE id= ?", id, (err, result) => {
        res.send(result)

    })
})

//FUNÇÃO PARA VER RESULTADOS DO EVENTO
app.get("/resultados/:id", (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT c.id, c.nome, COUNT(*) AS n_votos FROM votos as v LEFT JOIN candidatos as c ON c.id=v.candidato_id WHERE evento_id= ? GROUP BY v.candidato_id ORDER BY n_votos DESC", id, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.json(result);
            }

        })
})

//FUNÇÃO PARA RECUPERAR PASSWORD
app.post("/recuperar/:id", (req, res) => {
    const id = req.params.id;
    const password_nova = req.body.password_nova;
    const password_atual = req.body.password_atual;
    bcrypt.hash(password_nova, saltRounds, (err, hash2) => {
        if (err) {
            console.log(err);
        }

        bcrypt.hash(password_atual, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
            }

            db.query(
                "SELECT password FROM utilizadores WHERE id=?", id, (err, result) => {
                    bcrypt.compare(password_atual, result[0].password, function (err, response) {
                        if (response) {
                            db.query(
                                "UPDATE `utilizadores` SET `password`= ? WHERE id=?", [hash2, id], (err, response) => {
                                    if (err) {
                                    } else {
                                        res.send({ message: "mudou" })
                                    }
                                }
                            )
                        } else {
                            console.log("Passwords Inválidas")
                            res.send({ message: "erro" })
                        }
                    });
                })
        })
    })
})

app.listen("3001", () => {
    console.log("Servidor começou na porta 3001");
});
