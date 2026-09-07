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