const formLoginEmpresa =
    document.querySelector(
        "#formLoginEmpresa"
    );


formLoginEmpresa.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        const email =
            document.querySelector(
                "#email"
            ).value.trim();


        const senha =
            document.querySelector(
                "#senha"
            ).value;


        try {

            const resposta =
                await fetch(
                    "/empresa/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            senha: senha
                        })

                    }
                );


            const resultado =
                await resposta.json();


            if (resultado.sucesso) {

                localStorage.setItem(
                    "empresaLogada",
                    "true"
                );

                localStorage.setItem(
                    "empresaEmail",
                    email
                );

                localStorage.setItem(
                    "empresaNome",
                    resultado.nome
                );

                window.location.href =
                    "/empresa/painel";

            } else {

                alert(
                    "❌ " +
                    resultado.mensagem
                );

            }

        } catch (erro) {

            console.error(erro);

            alert(
                "❌ Erro ao conectar com o servidor."
            );

        }

    }
);