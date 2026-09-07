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
// VALIDAR CNPJ
// =========================

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, "");

    if (cnpj.length !== 14) {
        return false;
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }

    let tamanho = 12;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);

    let soma = 0;
    let posicao = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * posicao;
        posicao--;

        if (posicao < 2) {
            posicao = 9;
        }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== Number(digitos.charAt(0))) {
        return false;
    }

    tamanho = 13;
    numeros = cnpj.substring(0, tamanho);

    soma = 0;
    posicao = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * posicao;
        posicao--;

        if (posicao < 2) {
            posicao = 9;
        }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    return resultado === Number(digitos.charAt(1));
}

// =========================
// VALIDAR TELEFONE
// =========================

function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, "");

    return numeros.length === 10 || numeros.length === 11;
}

// =========================
// BUSCAR CEP
// =========================

async function buscarCEP(cep) {
    cep = cep.replace(/\D/g, "");

    if (cep.length !== 8) {
        return;
    }

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao consultar CEP.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            alert("❌ CEP não encontrado.");
            return;
        }

        document.querySelector("#endereco").value =
            dados.logradouro || "";

        document.querySelector("#bairro").value =
            dados.bairro || "";

        document.querySelector("#cidade").value =
            dados.localidade || "";

        document.querySelector("#estado").value =
            dados.uf || "";

    } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
        alert("❌ Não foi possível consultar o CEP.");
    }
}

    const campoCEP =
        document.querySelector("#cep");

    campoCEP.addEventListener(
        "blur",
        function () {
            buscarCEP(campoCEP.value);
        }
    );

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

        const cnpj =
            document.querySelector("#cnpj").value.trim();

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

        if (!validarCNPJ(cnpj)) {
            alert("❌ CNPJ inválido.");
            return;
        }
        
        const telefone =
            document.querySelector("#telefone").value.trim();

        const whatsapp =
            document.querySelector("#whatsapp").value.trim();

        if (!validarTelefone(telefone)) {
            alert("❌ Telefone inválido.");
            return;
        }

        if (whatsapp && !validarTelefone(whatsapp)) {
            alert("❌ WhatsApp inválido.");
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