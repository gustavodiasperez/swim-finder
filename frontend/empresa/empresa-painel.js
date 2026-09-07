const empresaLogada =
    localStorage.getItem("empresaLogada");

if (empresaLogada !== "true") {

    window.location.href =
        "/empresa/login";

}


const empresaNome =
    localStorage.getItem("empresaNome");


const nomeEmpresa =
    document.querySelector(
        "#nomeEmpresa"
    );


if (nomeEmpresa && empresaNome) {

    nomeEmpresa.textContent =
        empresaNome;

}

// =========================
// EDITAR INFORMAÇÕES
// =========================

const botaoEditarEmpresa =
    document.querySelector("#botaoEditarEmpresa");


if (botaoEditarEmpresa) {

    botaoEditarEmpresa.addEventListener(
        "click",
        function () {

            window.location.href =
                "/empresa/editar";

        }
    );

}

// =========================
// FOTOS
// =========================

const botaoFotosEmpresa =
    document.querySelector("#botaoFotosEmpresa");

if (botaoFotosEmpresa) {

    botaoFotosEmpresa.addEventListener(
        "click",
        function () {

            window.location.href =
                "/empresa/fotos";

        }
    );

}

// =========================
// HORÁRIOS
// =========================

const botaoHorariosEmpresa =
    document.querySelector("#botaoHorariosEmpresa");

if (botaoHorariosEmpresa) {

    botaoHorariosEmpresa.addEventListener(
        "click",
        function () {

            window.location.href =
                "/empresa/horarios";

        }
    );

}

// PREÇOS
const botaoPrecosEmpresa =
    document.querySelector("#botaoPrecosEmpresa");

if (botaoPrecosEmpresa) {
    botaoPrecosEmpresa.addEventListener("click", function () {
        window.location.href = "/empresa/precos";
    });
}

// =========================
// AVALIAÇÕES
// =========================

const botaoAvaliacoesEmpresa =
    document.querySelector("#botaoAvaliacoesEmpresa");

if (botaoAvaliacoesEmpresa) {

    botaoAvaliacoesEmpresa.addEventListener(
        "click",
        function () {

            window.location.href =
                "/empresa/avaliacoes";

        }
    );

}

// =========================
// SAIR
// =========================

const botaoSairEmpresa =
    document.querySelector(
        "#botaoSairEmpresa"
    );


botaoSairEmpresa.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "empresaLogada"
        );

        localStorage.removeItem(
            "empresaEmail"
        );

        localStorage.removeItem(
            "empresaNome"
        );

        window.location.href =
            "/empresa/login";

    }
);