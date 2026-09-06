const botaoUsuario =
    document.querySelector("#botaoUsuario");

const botaoEmpresa =
    document.querySelector("#botaoEmpresa");


botaoUsuario.addEventListener(
    "click",
    function () {

        window.location.href =
            "/login";

    }
);


botaoEmpresa.addEventListener(
    "click",
    function () {

        window.location.href =
            "/empresa/login";

    }
);