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
EMPRESAS_FILE = os.path.join(
    DATA_DIR,
    "empresas.json"
)

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

class AlterarSenha(BaseModel):
    email: str
    senha_atual: str
    nova_senha: str

class Avaliacao(BaseModel):
    piscina: str
    nome_usuario: str
    nota: int
    comentario: str

class FotoPerfil(BaseModel):
    email: str
    foto: str

class Empresa(BaseModel):
    razao_social: str
    nome_fantasia: str
    cnpj: str
    responsavel: str
    email: str
    telefone: str
    whatsapp: str = ""
    instagram: str = ""
    site: str = ""
    cep: str
    endereco: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    categoria: str
    tipo_piscina: str
    quantidade_piscinas: int
    descricao: str
    senha: str


class LoginEmpresa(BaseModel):
    email: str
    senha: str

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

def carregar_empresas():

    if not os.path.exists(EMPRESAS_FILE):
        return []

    with open(
        EMPRESAS_FILE,
        "r",
        encoding="utf-8"
    ) as arquivo:

        return json.load(arquivo)


def salvar_empresas(empresas):

    with open(
        EMPRESAS_FILE,
        "w",
        encoding="utf-8"
    ) as arquivo:

        json.dump(
            empresas,
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
        "tipo-conta.html"
    )

    return FileResponse(caminho)


@app.get("/app")
def abrir_app():
    caminho = os.path.join(
        FRONTEND_DIR,
        "index.html"
    )

    return FileResponse(caminho)

@app.get("/tipo-conta")
def abrir_tipo_conta():
    caminho = os.path.join(
        FRONTEND_DIR,
        "tipo-conta.html"
    )

    return FileResponse(caminho)


@app.get("/empresa/cadastro")
def abrir_cadastro_empresa():

    caminho = os.path.join(
        FRONTEND_DIR,
        "empresa-cadastro.html"
    )

    return FileResponse(caminho)

@app.post("/empresa/cadastro")
def cadastrar_empresa(empresa: Empresa):

    empresas = carregar_empresas()

    email = empresa.email.strip().lower()
    cnpj = empresa.cnpj.strip()

    for empresa_existente in empresas:

        if empresa_existente["email"] == email:

            return {
                "sucesso": False,
                "mensagem": "Este e-mail já está cadastrado."
            }


        if empresa_existente["cnpj"] == cnpj:

            return {
                "sucesso": False,
                "mensagem": "Este CNPJ já está cadastrado."
            }


    nova_empresa = {

        "razao_social":
            empresa.razao_social.strip(),

        "nome_fantasia":
            empresa.nome_fantasia.strip(),

        "cnpj":
            cnpj,

        "responsavel":
            empresa.responsavel.strip(),

        "email":
            email,

        "telefone":
            empresa.telefone.strip(),

        "whatsapp":
            empresa.whatsapp.strip(),

        "instagram":
            empresa.instagram.strip(),

        "site":
            empresa.site.strip(),

        "cep":
            empresa.cep.strip(),

        "endereco":
            empresa.endereco.strip(),

        "numero":
            empresa.numero.strip(),

        "bairro":
            empresa.bairro.strip(),

        "cidade":
            empresa.cidade.strip(),

        "estado":
            empresa.estado.strip().upper(),

        "categoria":
            empresa.categoria,

        "tipo_piscina":
            empresa.tipo_piscina,

        "quantidade_piscinas":
            empresa.quantidade_piscinas,

        "descricao":
            empresa.descricao.strip(),

        "senha":
            gerar_hash(empresa.senha),

        "status":
            "em_analise"

    }


    empresas.append(
        nova_empresa
    )

    salvar_empresas(
        empresas
    )


    return {
        "sucesso": True,
        "mensagem":
            "Cadastro enviado para análise."
    }

@app.get("/login")
def abrir_login():
    caminho = os.path.join(
        FRONTEND_DIR,
        "login.html"
    )

    return FileResponse(caminho)

@app.get("/empresa/login")
def abrir_login_empresa():

    caminho = os.path.join(
        FRONTEND_DIR,
        "empresa-login.html"
    )

    return FileResponse(caminho)

@app.post("/empresa/login")
def fazer_login_empresa(dados: LoginEmpresa):

    empresas = carregar_empresas()

    email = dados.email.strip().lower()
    senha_hash = gerar_hash(
        dados.senha
    )


    for empresa in empresas:

        if (
            empresa["email"] == email
            and
            empresa["senha"] == senha_hash
        ):

            if empresa["status"] != "aprovada":

                return {
                    "sucesso": False,
                    "mensagem":
                        "Seu cadastro ainda está em análise."
                }


            return {
                "sucesso": True,
                "nome":
                    empresa["nome_fantasia"],
                "mensagem":
                    "Login realizado com sucesso."
            }


    return {
        "sucesso": False,
        "mensagem":
            "E-mail ou senha incorretos."
    }

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

@app.get("/configuracoes")
def abrir_configuracoes():
    caminho = os.path.join(
        FRONTEND_DIR,
        "configuracoes.html"
    )
    return FileResponse(caminho)

@app.post("/alterar-senha")
def alterar_senha(dados: AlterarSenha):
    usuarios = carregar_usuarios()

    email = dados.email.strip().lower()

    senha_atual_hash = gerar_hash(dados.senha_atual)

    for usuario in usuarios:

        if usuario["email"] != email:
            continue

        # Verifica a senha atual
        if usuario["senha"] != senha_atual_hash:
            return {
                "sucesso": False,
                "mensagem": "A senha atual está incorreta."
            }

        # Verifica se a nova senha tem tamanho mínimo
        if len(dados.nova_senha) < 6:
            return {
                "sucesso": False,
                "mensagem": "A nova senha deve ter pelo menos 6 caracteres."
            }

        # Impede trocar pela mesma senha
        if dados.senha_atual == dados.nova_senha:
            return {
                "sucesso": False,
                "mensagem": "A nova senha precisa ser diferente da atual."
            }

        # Salva a nova senha com hash
        usuario["senha"] = gerar_hash(dados.nova_senha)

        salvar_usuarios(usuarios)

        return {
            "sucesso": True,
            "mensagem": "Senha alterada com sucesso!"
        }

    return {
        "sucesso": False,
        "mensagem": "Usuário não encontrado."
    }

@app.post("/usuario/foto")
def salvar_foto_perfil(dados: FotoPerfil):
    usuarios = carregar_usuarios()

    email = dados.email.strip().lower()

    for usuario in usuarios:

        if usuario["email"] == email:

            usuario["foto"] = dados.foto

            salvar_usuarios(usuarios)

            return {
                "sucesso": True,
                "mensagem": "Foto de perfil atualizada com sucesso!"
            }

    return {
        "sucesso": False,
        "mensagem": "Usuário não encontrado."
    }

@app.get("/usuario/{email}")
def obter_usuario(email: str):
    usuarios = carregar_usuarios()

    email = email.strip().lower()

    for usuario in usuarios:

        if usuario["email"] == email:

            return {
                "sucesso": True,
                "nome": usuario["nome"],
                "email": usuario["email"],
                "foto": usuario.get("foto", "")
            }

    return {
        "sucesso": False,
        "mensagem": "Usuário não encontrado."
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

# =========================
# PAINEL EMPRESARIAL
# =========================

@app.get("/empresa/painel")
def abrir_painel_empresa():

    caminho = os.path.join(
        FRONTEND_DIR,
        "empresa-painel.html"
    )

    return FileResponse(caminho)