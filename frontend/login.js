const formLogin = document.querySelector("#formLogin");
const abrirCadastro = document.querySelector("#abrirCadastro");

formLogin.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;

    try {

        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {

            console.log("Resposta do servidor:", resultado);

            localStorage.setItem("usuarioLogado", "true");
            localStorage.setItem("nomeUsuario", resultado.nome);
            localStorage.setItem("emailUsuario", email);

            window.location.href = "/app";

        } else {

            alert(resultado.mensagem);

        }

    } catch (erro) {

        console.error(erro);
        alert("Erro ao conectar com o servidor.");

    }

});


