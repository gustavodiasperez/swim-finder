const empresaEmail =
    localStorage.getItem("empresaEmail");

if (!empresaEmail) {
    window.location.href = "/empresa/login";
}

const formEditarEmpresa =
    document.querySelector("#formEditarEmpresa");

const piscinaNome =
    document.querySelector("#piscinaNome");

// =========================
// CARREGAR PISCINAS
// =========================

async function carregarPiscinas(empresaAtual) {
    try {
        const resposta =
            await fetch("/piscinas");

        if (!resposta.ok) {
            throw new Error(
                "Erro ao carregar piscinas."
            );
        }

        const piscinas =
            await resposta.json();

        piscinaNome.innerHTML = `
            <option value="">
                Selecione a piscina
            </option>
        `;

        piscinas.forEach(function (piscina) {

            const opcao =
                document.createElement("option");

            opcao.value =
                piscina.nome;

            opcao.textContent =
                piscina.nome;

            piscinaNome.appendChild(opcao);
        });

        // Seleciona a piscina que a empresa já possui
        if (empresaAtual.piscina_nome) {
            piscinaNome.value =
                empresaAtual.piscina_nome;
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar piscinas:",
            erro
        );

        piscinaNome.innerHTML = `
            <option value="">
                Erro ao carregar piscinas
            </option>
        `;
    }
}

// =========================
// CARREGAR DADOS DA EMPRESA
// =========================

async function carregarEmpresa() {

    try {

        const resposta =
            await fetch(
                "/empresa/" +
                encodeURIComponent(empresaEmail)
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }

        const empresa =
            await resposta.json();

        if (!empresa.sucesso) {

            alert(
                "❌ " +
                empresa.mensagem
            );

            return;
        }

        document.querySelector(
            "#razaoSocial"
        ).value =
            empresa.razao_social || "";

        document.querySelector(
            "#nomeFantasia"
        ).value =
            empresa.nome_fantasia || "";

        document.querySelector(
            "#cnpj"
        ).value =
            empresa.cnpj || "";

        document.querySelector(
            "#responsavel"
        ).value =
            empresa.responsavel || "";

        document.querySelector(
            "#email"
        ).value =
            empresa.email || "";

        document.querySelector(
            "#telefone"
        ).value =
            empresa.telefone || "";

        document.querySelector(
            "#whatsapp"
        ).value =
            empresa.whatsapp || "";

        document.querySelector(
            "#instagram"
        ).value =
            empresa.instagram || "";

        document.querySelector(
            "#site"
        ).value =
            empresa.site || "";

        document.querySelector(
            "#cep"
        ).value =
            empresa.cep || "";

        document.querySelector(
            "#endereco"
        ).value =
            empresa.endereco || "";

        document.querySelector(
            "#numero"
        ).value =
            empresa.numero || "";

        document.querySelector(
            "#bairro"
        ).value =
            empresa.bairro || "";

        document.querySelector(
            "#cidade"
        ).value =
            empresa.cidade || "";

        document.querySelector(
            "#estado"
        ).value =
            empresa.estado || "";

        document.querySelector(
            "#categoria"
        ).value =
            empresa.categoria || "";

        document.querySelector(
            "#tipoPiscina"
        ).value =
            empresa.tipo_piscina || "";

        document.querySelector(
            "#quantidadePiscinas"
        ).value =
            empresa.quantidade_piscinas || 1;

        document.querySelector(
            "#descricao"
        ).value =
            empresa.descricao || "";

        // Carrega a lista depois dos dados da empresa
        await carregarPiscinas(empresa);

    } catch (erro) {

        console.error(erro);

        alert(
            "❌ Não foi possível carregar os dados da empresa."
        );
    }
}

carregarEmpresa();

// =========================
// SALVAR
// =========================

formEditarEmpresa.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();

        const dados = {

            razao_social:
                document.querySelector(
                    "#razaoSocial"
                ).value.trim(),

            nome_fantasia:
                document.querySelector(
                    "#nomeFantasia"
                ).value.trim(),

            piscina_nome:
                document.querySelector(
                    "#piscinaNome"
                ).value,

            cnpj:
                document.querySelector(
                    "#cnpj"
                ).value.trim(),

            responsavel:
                document.querySelector(
                    "#responsavel"
                ).value.trim(),

            telefone:
                document.querySelector(
                    "#telefone"
                ).value.trim(),

            whatsapp:
                document.querySelector(
                    "#whatsapp"
                ).value.trim(),

            instagram:
                document.querySelector(
                    "#instagram"
                ).value.trim(),

            site:
                document.querySelector(
                    "#site"
                ).value.trim(),

            cep:
                document.querySelector(
                    "#cep"
                ).value.trim(),

            endereco:
                document.querySelector(
                    "#endereco"
                ).value.trim(),

            numero:
                document.querySelector(
                    "#numero"
                ).value.trim(),

            bairro:
                document.querySelector(
                    "#bairro"
                ).value.trim(),

            cidade:
                document.querySelector(
                    "#cidade"
                ).value.trim(),

            estado:
                document.querySelector(
                    "#estado"
                ).value.trim().toUpperCase(),

            categoria:
                document.querySelector(
                    "#categoria"
                ).value,

            tipo_piscina:
                document.querySelector(
                    "#tipoPiscina"
                ).value,

            quantidade_piscinas:
                Number(
                    document.querySelector(
                        "#quantidadePiscinas"
                    ).value
                ),

            descricao:
                document.querySelector(
                    "#descricao"
                ).value.trim()
        };

        try {

            const resposta =
                await fetch(
                    "/empresa/" +
                    encodeURIComponent(
                        empresaEmail
                    ),
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(dados)
                    }
                );

            const resultado =
                await resposta.json();

            if (resultado.sucesso) {

                localStorage.setItem(
                    "empresaNome",
                    dados.nome_fantasia
                );

                alert(
                    "✅ Informações atualizadas com sucesso!"
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
                "❌ Erro ao salvar as alterações."
            );
        }
    }
);

// =========================
// VOLTAR
// =========================

document
    .querySelector("#voltarPainel")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "/empresa/painel";
        }
    );