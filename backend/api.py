from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import hashlib
import json
import os

app = FastAPI()


# =========================
# CAMINHOS
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
DATA_DIR = os.path.join(BASE_DIR, "data")

PISCINAS_FILE = os.path.join(DATA_DIR, "piscinas.json")
USUARIOS_FILE = os.path.join(DATA_DIR, "usuarios.json")
AVALIACOES_FILE = os.path.join(DATA_DIR, "avaliacoes.json")


# =========================
# FRONTEND
# =========================

app.mount(
    "/frontend",
    StaticFiles(directory=FRONTEND_DIR),
    name="frontend"
)


# =========================
# MODELOS
# =========================

class Usuario(BaseModel):
    nome: str
    email: str
    senha: str


class Login(BaseModel):
    email: str
    senha: str

class Avaliacao(BaseModel):
    piscina: str
    nome_usuario: str
    nota: int
    comentario: str


# =========================
# FUNÇÕES
# =========================

def carregar_usuarios():
    if not os.path.exists(USUARIOS_FILE):
        return []

    with open(USUARIOS_FILE, "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)


def salvar_usuarios(usuarios):
    with open(USUARIOS_FILE, "w", encoding="utf-8") as arquivo:
        json.dump(
            usuarios,
            arquivo,
            ensure_ascii=False,
            indent=4
        )


def gerar_hash(senha):
    return hashlib.sha256(
        senha.encode("utf-8")
    ).hexdigest()

def carregar_avaliacoes():
    if not os.path.exists(AVALIACOES_FILE):
        return []

    with open(
        AVALIACOES_FILE,
        "r",
        encoding="utf-8"
    ) as arquivo:
        return json.load(arquivo)


def salvar_avaliacoes(avaliacoes):
    with open(
        AVALIACOES_FILE,
        "w",
        encoding="utf-8"
    ) as arquivo:
        json.dump(
            avaliacoes,
            arquivo,
            ensure_ascii=False,
            indent=4
        )


# =========================
# ROTAS
# =========================

@app.get("/")
def inicio():
    caminho = os.path.join(
        FRONTEND_DIR,
        "login.html"
    )

    return FileResponse(caminho)


@app.get("/app")
def abrir_app():
    caminho = os.path.join(
        FRONTEND_DIR,
        "index.html"
    )

    return FileResponse(caminho)


@app.get("/login")
def abrir_login():
    caminho = os.path.join(
        FRONTEND_DIR,
        "login.html"
    )

    return FileResponse(caminho)

@app.get("/cadastro")
def abrir_cadastro():
    caminho = os.path.join(
        FRONTEND_DIR,
        "cadastro.html"
    )

    return FileResponse(caminho)


@app.get("/piscinas")
def listar_piscinas():

    with open(
        PISCINAS_FILE,
        "r",
        encoding="utf-8"
    ) as arquivo:

        piscinas = json.load(arquivo)

    return piscinas

@app.get("/avaliacoes")
def listar_todas_avaliacoes():
    return carregar_avaliacoes()

@app.get("/avaliacoes/usuario/{nome_usuario}")
def listar_avaliacoes_usuario(nome_usuario: str):
    avaliacoes = carregar_avaliacoes()

    return [
        avaliacao
        for avaliacao in avaliacoes
        if avaliacao["nome_usuario"] == nome_usuario
    ]

@app.get("/avaliacoes/{nome_piscina}")
def listar_avaliacoes(nome_piscina: str):

    avaliacoes = carregar_avaliacoes()

    return [
        avaliacao
        for avaliacao in avaliacoes
        if avaliacao["piscina"] == nome_piscina
    ]

def avaliacoes_nota_invalida(nota):
    return nota < 1 or nota > 5
@app.post("/avaliacoes")
def adicionar_avaliacao(avaliacao: Avaliacao):

    if avaliacoes_nota_invalida(avaliacao.nota):
        return {
            "sucesso": False,
            "mensagem": "A nota deve estar entre 1 e 5."
        }

    avaliacoes = carregar_avaliacoes()

    nova_avaliacao = {
        "piscina": avaliacao.piscina,
        "nome_usuario": avaliacao.nome_usuario,
        "nota": avaliacao.nota,
        "comentario": avaliacao.comentario.strip()
    }

    avaliacoes.append(nova_avaliacao)

    salvar_avaliacoes(avaliacoes)

    return {
        "sucesso": True,
        "mensagem": "Avaliação adicionada com sucesso!"
    }

# =========================
# CADASTRO
# =========================

@app.post("/cadastro")
def cadastrar_usuario(usuario: Usuario):

    usuarios = carregar_usuarios()

    email = usuario.email.strip().lower()

    for usuario_existente in usuarios:

        if usuario_existente["email"] == email:
            return {
                "sucesso": False,
                "mensagem": "Este e-mail já está cadastrado."
            }

    novo_usuario = {
        "nome": usuario.nome.strip(),
        "email": email,
        "senha": gerar_hash(usuario.senha)
    }

    usuarios.append(novo_usuario)

    salvar_usuarios(usuarios)

    return {
        "sucesso": True,
        "mensagem": "Conta criada com sucesso!"
    }


# =========================
# LOGIN
# =========================

@app.post("/login")
def fazer_login(dados: Login):

    usuarios = carregar_usuarios()

    email = dados.email.strip().lower()
    senha_hash = gerar_hash(dados.senha)

    print("EMAIL DIGITADO:", email)

    for usuario in usuarios:

        email_correto = usuario["email"] == email
        senha_correta = usuario["senha"] == senha_hash

        print(
            "Usuário:",
            usuario["email"],
            "| Email:", email_correto,
            "| Senha:", senha_correta
        )

        if email_correto and senha_correta:

            return {
                "sucesso": True,
                "nome": usuario["nome"],
                "mensagem": "Login realizado com sucesso!"
            }

    return {
        "sucesso": False,
        "mensagem": "E-mail ou senha incorretos."
    }

# =========================
# DETALHES
# =========================


@app.get("/detalhes")
def abrir_detalhes():
    caminho = os.path.join(
        FRONTEND_DIR,
        "detalhes.html"
    )

    return FileResponse(caminho)

# =========================
# PERFIL
# =========================

@app.get("/perfil")
def abrir_perfil():
    caminho = os.path.join(
        FRONTEND_DIR,
        "perfil.html"
    )

    return FileResponse(caminho)