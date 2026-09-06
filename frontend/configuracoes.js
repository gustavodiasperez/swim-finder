// =========================
// LOGIN
// =========================

const usuarioLogado =
    localStorage.getItem("usuarioLogado");

if (usuarioLogado !== "true") {

    window.location.href = "/login";

}


// =========================
// DADOS
// =========================

const nomeUsuario =
    localStorage.getItem("nomeUsuario");

const emailUsuario =
    localStorage.getItem("emailUsuario");


// =========================
// TEMA
// =========================

const temaSalvo =
    localStorage.getItem("tema");

if (temaSalvo === "escuro") {

    document.body.classList.add(
        "tema-escuro"
    );

}


// =========================
// ELEMENTOS
// =========================

const cardNotificacoes =
    document.querySelector("#cardNotificacoes");

const statusNotificacoes =
    document.querySelector("#statusNotificacoes");

const cardConta =
    document.querySelector("#cardConta");

const cardSobre =
    document.querySelector("#cardSobre");

const areaConta =
    document.querySelector("#areaConta");

const areaSobre =
    document.querySelector("#areaSobre");


// =========================
// NOME E EMAIL
// =========================

document.querySelector(
    "#nomeUsuarioConfig"
).textContent =
    nomeUsuario || "Não informado";


document.querySelector(
    "#emailUsuarioConfig"
).textContent =
    emailUsuario || "Não informado";


// =========================
// NOTIFICAÇÕES
// =========================

let notificacoesAtivas =
    localStorage.getItem("notificacoes") === "true";


function atualizarNotificacoes() {

    if (notificacoesAtivas) {

        statusNotificacoes.textContent =
            "Ativadas";

    } else {

        statusNotificacoes.textContent =
            "Desativadas";

    }

}


atualizarNotificacoes();


cardNotificacoes.addEventListener(
    "click",
    function () {

        notificacoesAtivas =
            !notificacoesAtivas;

        localStorage.setItem(
            "notificacoes",
            notificacoesAtivas
        );

        atualizarNotificacoes();

    }
);


// =========================
// ABRIR CONTA
// =========================

cardConta.addEventListener(
    "click",
    function () {

        document.querySelector(
            "#cardNotificacoes"
        ).style.display = "none";

        document.querySelector(
            "#cardConta"
        ).style.display = "none";

        document.querySelector(
            "#cardSobre"
        ).style.display = "none";

        areaConta.style.display = "block";

    }
);


// =========================
// ABRIR SOBRE
// =========================

cardSobre.addEventListener(
    "click",
    function () {

        document.querySelector(
            "#cardNotificacoes"
        ).style.display = "none";

        document.querySelector(
            "#cardConta"
        ).style.display = "none";

        document.querySelector(
            "#cardSobre"
        ).style.display = "none";

        areaSobre.style.display = "block";

    }
);


// =========================
// VOLTAR PARA CONFIGURAÇÕES
// =========================

function voltarConfiguracoes() {

    areaConta.style.display =
        "none";

    areaSobre.style.display =
        "none";

    document.querySelector(
        "#cardNotificacoes"
    ).style.display = "flex";

    document.querySelector(
        "#cardConta"
    ).style.display = "flex";

    document.querySelector(
        "#cardSobre"
    ).style.display = "flex";

}


document
    .querySelector("#voltarConfiguracoes")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "/app";

        }
    );


document
    .querySelector("#voltarConfiguracoesConta")
    .addEventListener(
        "click",
        voltarConfiguracoes
    );


document
    .querySelector("#voltarSobre")
    .addEventListener(
        "click",
        voltarConfiguracoes
    );


// =========================
// FOTO DE PERFIL
// =========================

const cardFotoPerfil =
    document.querySelector(
        "#cardFotoPerfil"
    );

const fotoPerfil =
    document.querySelector(
        "#fotoPerfil"
    );

const fotoPerfilPreview =
    document.querySelector(
        "#fotoPerfilPreview"
    );

const avatarPadrao =
    document.querySelector(
        "#avatarPadrao"
    );


function mostrarFotoPerfil(foto) {

    if (foto) {

        fotoPerfilPreview.src =
            foto;

        fotoPerfilPreview.style.display =
            "block";

        avatarPadrao.style.display =
            "none";

    } else {

        fotoPerfilPreview.style.display =
            "none";

        avatarPadrao.style.display =
            "flex";

    }

}


mostrarFotoPerfil(
    localStorage.getItem("fotoPerfil")
);


// Clicar no card abre a galeria

cardFotoPerfil.addEventListener(
    "click",
    function () {

        fotoPerfil.click();

    }
);


// Quando escolher a foto

fotoPerfil.addEventListener(
    "change",
    function () {

        const arquivo =
            fotoPerfil.files[0];

        if (!arquivo) {
            return;
        }


        const leitor =
            new FileReader();


        leitor.onload =
            function (evento) {

                const foto =
                    evento.target.result;

                localStorage.setItem(
                    "fotoPerfil",
                    foto
                );

                mostrarFotoPerfil(foto);

            };


        leitor.readAsDataURL(arquivo);

    }
);


// =========================
// ALTERAR SENHA
// =========================

document
    .querySelector("#cardAlterarSenha")
    .addEventListener(
        "click",
        async function () {

            const senhaAtual =
                prompt(
                    "Digite sua senha atual:"
                );

            if (senhaAtual === null) {
                return;
            }


            const novaSenha =
                prompt(
                    "Digite sua nova senha:\n\n" +
                    "Mínimo de 6 caracteres."
                );

            if (novaSenha === null) {
                return;
            }


            const confirmarSenha =
                prompt(
                    "Digite novamente sua nova senha:"
                );

            if (confirmarSenha === null) {
                return;
            }


            if (novaSenha !== confirmarSenha) {

                alert(
                    "❌ As novas senhas não são iguais."
                );

                return;

            }


            if (novaSenha.length < 6) {

                alert(
                    "❌ A nova senha precisa ter pelo menos 6 caracteres."
                );

                return;

            }


            try {

                const resposta =
                    await fetch(
                        "/alterar-senha",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email:
                                    emailUsuario,

                                senha_atual:
                                    senhaAtual,

                                nova_senha:
                                    novaSenha

                            })
                        }
                    );


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        resultado.detail ||
                        resultado.mensagem ||
                        "❌ Não foi possível alterar a senha."
                    );

                    return;

                }


                if (!resultado.sucesso) {

                    alert(
                        "❌ " +
                        resultado.mensagem
                    );

                    return;

                }


                alert(
                    "✅ Senha alterada com sucesso!"
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao alterar senha:",
                    erro
                );

                alert(
                    "❌ Não foi possível conectar ao servidor."
                );

            }

        }
    );