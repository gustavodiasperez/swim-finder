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