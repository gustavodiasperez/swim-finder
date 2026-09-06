// =========================
// LOGIN
// =========================

const usuarioLogado =
    localStorage.getItem("usuarioLogado");

if (usuarioLogado !== "true") {

    window.location.href = "/login";

}


// =========================
// DADOS DO USUÁRIO
// =========================

const nomeUsuario =
    localStorage.getItem("nomeUsuario");

const emailUsuario =
    localStorage.getItem("emailUsuario");


document.querySelector(
    "#nomeUsuarioConfig"
).textContent =
    nomeUsuario || "Não informado";


document.querySelector(
    "#emailUsuarioConfig"
).textContent =
    emailUsuario || "Não informado";


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
// NOTIFICAÇÕES
// =========================

const botaoNotificacoes =
    document.querySelector(
        "#botaoNotificacoes"
    );


let notificacoesAtivas =
    localStorage.getItem("notificacoes") === "true";


function atualizarNotificacoes() {

    if (notificacoesAtivas) {

        botaoNotificacoes.textContent =
            "🔔 Ativadas";

    } else {

        botaoNotificacoes.textContent =
            "🔕 Desativadas";

    }

}


atualizarNotificacoes();


botaoNotificacoes.addEventListener(
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
// FOTO DE PERFIL
// =========================

const fotoPerfil =
    document.querySelector(
        "#fotoPerfil"
    );

const botaoFotoPerfil =
    document.querySelector(
        "#botaoFotoPerfil"
    );

const fotoPerfilPreview =
    document.querySelector(
        "#fotoPerfilPreview"
    );

const avatarPadrao =
    document.querySelector(
        "#avatarPadrao"
    );


const fotoSalva =
    localStorage.getItem(
        "fotoPerfil"
    );


function mostrarFotoPerfil(foto) {

    if (foto) {

        fotoPerfilPreview.src = foto;

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


mostrarFotoPerfil(fotoSalva);


botaoFotoPerfil.addEventListener(
    "click",
    function () {

        fotoPerfil.click();

    }
);


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
    .querySelector("#botaoAlterarSenha")
    .addEventListener(
        "click",
        async function () {

            const senhaAtual =
                prompt("Digite sua senha atual:");

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


// =========================
// VOLTAR
// =========================

document
    .querySelector(
        "#voltarConfiguracoes"
    )
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "/app";

        }
    );