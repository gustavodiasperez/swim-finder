const formCadastroEmpresa =
    document.querySelector("#formCadastroEmpresa");

const piscinaNome =
    document.querySelector("#piscinaNome");

// =========================
// CARREGAR PISCINAS
// =========================

async function carregarPiscinas() {
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

carregarPiscinas();

// =========================
// CADASTRO
// =========================

formCadastroEmpresa.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();

        const senha =
            document.querySelector("#senha").value;

        const confirmarSenha =
            document.querySelector(
                "#confirmarSenha"
            ).value;

        if (senha !== confirmarSenha) {
            alert(
                "❌ As senhas não são iguais."
            );
            return;
        }

        if (senha.length < 6) {
            alert(
                "❌ A senha deve ter pelo menos 6 caracteres."
            );
            return;
        }

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

            email:
                document.querySelector(
                    "#email"
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
                ).value.trim(),

            senha: senha
        };

        try {

            const resposta =
                await fetch(
                    "/empresa/cadastro",
                    {
                        method: "POST",

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

                alert(
                    "✅ Cadastro enviado com sucesso!\n\n" +
                    "Seu estabelecimento está em análise."
                );

                window.location.href =
                    "/empresa/login";

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