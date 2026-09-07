console.log("empresa-horarios.js carregou!");

const empresaLogada =
    localStorage.getItem("empresaLogada");

const empresaEmail =
    localStorage.getItem("empresaEmail");


if (empresaLogada !== "true" || !empresaEmail) {

    window.location.href =
        "/empresa/login";

}


const campos = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo"
];


const botaoSalvar =
    document.querySelector(
        "#botaoSalvarHorarios"
    );

const botaoVoltar =
    document.querySelector(
        "#botaoVoltarPainelHorarios"
    );


botaoSalvar.addEventListener(
    "click",
    async function () {

        const horarios = {};

        campos.forEach(function (dia) {

            horarios[dia] =
                document.querySelector(
                    "#" + dia
                ).value;

        });


        try {

            const resposta =
                await fetch(
                    "/empresa/horarios/" +
                    encodeURIComponent(
                        empresaEmail
                    ),
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            horarios
                        )
                    }
                );


            const resultado =
                await resposta.json();


            if (!resultado.sucesso) {

                alert(
                    resultado.mensagem
                );

                return;

            }


            alert(
                "✅ " +
                resultado.mensagem
            );

        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao salvar os horários."
            );

        }

    }
);


botaoVoltar.addEventListener(
    "click",
    function () {

        window.location.href =
            "/empresa/painel";

    }
);