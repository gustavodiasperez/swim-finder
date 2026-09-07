const formCadastro = document.querySelector("#formCadastro");

formCadastro.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;
    const confirmarSenha =
        document.querySelector("#confirmarSenha").value;

    if (senha !== confirmarSenha) {

        alert("As senhas não são iguais.");
        return;

    }

    try {

        const resposta = await fetch("/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {

            alert("Conta criada com sucesso!");

            window.location.href = "/login";

        } else {

            alert(resultado.mensagem);

        }

    } catch (erro) {

        console.error(erro);
        alert("Erro ao conectar com o servidor.");

    }

});

// =========================
// FORÇA DA SENHA
// =========================

const campoSenha =
    document.querySelector("#senha");

const indicadorForca =
    document.querySelector("#forcaSenha");

function verificarForcaSenha(senha) {

    if (!indicadorForca) {
        return;
    }

    indicadorForca.classList.remove(
        "forca-fraca",
        "forca-media",
        "forca-forte"
    );

    const texto =
        indicadorForca.querySelector(
            ".texto-forca"
        );

    if (!senha) {
        texto.textContent = "";
        return;
    }

    let pontos = 0;

    if (senha.length >= 6) {
        pontos++;
    }

    if (senha.length >= 10) {
        pontos++;
    }

    if (/[A-Z]/.test(senha)) {
        pontos++;
    }

    if (/[a-z]/.test(senha)) {
        pontos++;
    }

    if (/[0-9]/.test(senha)) {
        pontos++;
    }

    if (/[^A-Za-z0-9]/.test(senha)) {
        pontos++;
    }

    if (pontos <= 2) {

        indicadorForca.classList.add(
            "forca-fraca"
        );

        texto.textContent =
            "Fraca";

    } else if (pontos <= 4) {

        indicadorForca.classList.add(
            "forca-media"
        );

        texto.textContent =
            "Média";

    } else {

        indicadorForca.classList.add(
            "forca-forte"
        );

        texto.textContent =
            "Forte";
    }
}

if (campoSenha) {
    campoSenha.addEventListener(
        "input",
        function () {
            verificarForcaSenha(
                campoSenha.value
            );
        }
    );
}