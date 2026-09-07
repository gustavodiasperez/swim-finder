const empresaLogada =
    localStorage.getItem("empresaLogada");

const empresaEmail =
    localStorage.getItem("empresaEmail");


if (empresaLogada !== "true" || !empresaEmail) {

    window.location.href =
        "/empresa/login";

}


const inputFotos =
    document.querySelector("#inputFotos");

const previewFotos =
    document.querySelector("#previewFotos");

const botaoSalvarFotos =
    document.querySelector("#botaoSalvarFotos");

const botaoVoltarPainel =
    document.querySelector("#botaoVoltarPainel");


let fotosSelecionadas = [];


inputFotos.addEventListener(
    "change",
    function () {

        fotosSelecionadas =
            Array.from(inputFotos.files);

        previewFotos.innerHTML = "";

        fotosSelecionadas.forEach(
            function (arquivo) {

                const leitor =
                    new FileReader();

                leitor.onload =
                    function (evento) {

                        const imagem =
                            document.createElement("img");

                        imagem.src =
                            evento.target.result;

                        imagem.className =
                            "preview-foto";

                        previewFotos.appendChild(
                            imagem
                        );

                    };

                leitor.readAsDataURL(arquivo);

            }
        );

    }
);


botaoSalvarFotos.addEventListener(
    "click",
    async function () {

        if (fotosSelecionadas.length === 0) {

            alert(
                "Selecione pelo menos uma foto."
            );

            return;

        }

        try {

            const fotosBase64 = [];

            for (
                const arquivo
                of fotosSelecionadas
            ) {

                const base64 =
                    await converterParaBase64(
                        arquivo
                    );

                fotosBase64.push(base64);

            }


            const resposta =
                await fetch(
                    "/empresa/fotos/" +
                    encodeURIComponent(
                        empresaEmail
                    ),
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            fotos: fotosBase64
                        })
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
                "✅ Fotos salvas com sucesso!"
            );

        } catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao salvar as fotos."
            );

        }

    }
);


function converterParaBase64(arquivo) {

    return new Promise(
        function (resolve, reject) {

            const leitor =
                new FileReader();

            leitor.onload =
                function () {

                    resolve(
                        leitor.result
                    );

                };

            leitor.onerror =
                function () {

                    reject(
                        leitor.error
                    );

                };

            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


botaoVoltarPainel.addEventListener(
    "click",
    function () {

        window.location.href =
            "/empresa/painel";

    }
);