from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import hashlib
import json
import os


app = FastAPI()


# =========================================================
# CAMINHOS
# =========================================================

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "frontend"
)

USUARIO_DIR = os.path.join(
    FRONTEND_DIR,
    "usuario"
)

EMPRESA_DIR = os.path.join(
    FRONTEND_DIR,
    "empresa"
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data"
)


PISCINAS_FILE = os.path.join(
    DATA_DIR,
    "piscinas.json"
)

USUARIOS_FILE = os.path.join(
    DATA_DIR,
    "usuarios.json"
)

EMPRESAS_FILE = os.path.join(
    DATA_DIR,
    "empresas.json"
)

AVALIACOES_FILE = os.path.join(
    DATA_DIR,
    "avaliacoes.json"
)


# =========================================================
# FRONTEND
# =========================================================

app.mount(
    "/frontend",
    StaticFiles(
        directory=FRONTEND_DIR
    ),
    name="frontend"
)


# =========================================================
# MODELOS
# =========================================================

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
    piscina_nome: str

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


class AtualizarEmpresa(BaseModel):
    razao_social: str
    nome_fantasia: str
    piscina_nome: str
    cnpj: str
    responsavel: str

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


class FotosEmpresa(BaseModel):
    fotos: list[str]


class HorariosEmpresa(BaseModel):
    segunda: str = ""
    terca: str = ""
    quarta: str = ""
    quinta: str = ""
    sexta: str = ""
    sabado: str = ""
    domingo: str = ""

class PrecosEmpresa(BaseModel):
    mensalidade: str = ""
    day_use: str = ""
    observacao: str = ""


# =========================================================
# FUNÇÕES
# =========================================================

def carregar_usuarios():

    if not os.path.exists(USUARIOS_FILE):
        return []

    with open(
        USUARIOS_FILE,
        "r",
        encoding="utf-8"
    ) as arquivo:

        return json.load(arquivo)


def salvar_usuarios(usuarios):

    with open(
        USUARIOS_FILE,
        "w",
        encoding="utf-8"
    ) as arquivo:

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


def gerar_hash(senha):

    return hashlib.sha256(
        senha.encode()
    ).hexdigest()


# =========================================================
# INÍCIO / TIPO DE CONTA
# =========================================================

@app.get("/")
def abrir_inicio():

    caminho = os.path.join(
        FRONTEND_DIR,
        "tipo-conta.html"
    )

    return FileResponse(caminho)


@app.get("/tipo-conta")
def abrir_tipo_conta():

    caminho = os.path.join(
        FRONTEND_DIR,
        "tipo-conta.html"
    )

    return FileResponse(caminho)


# =========================================================
# APP DO USUÁRIO
# =========================================================

@app.get("/app")
def abrir_app():

    caminho = os.path.join(
        USUARIO_DIR,
        "index.html"
    )

    return FileResponse(caminho)


# =========================================================
# CADASTRO DE USUÁRIO
# =========================================================

@app.get("/cadastro")
def abrir_cadastro():

    caminho = os.path.join(
        USUARIO_DIR,
        "cadastro.html"
    )

    return FileResponse(caminho)


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

        "nome":
            usuario.nome.strip(),

        "email":
            email,

        "senha":
            gerar_hash(usuario.senha),

        "foto":
            ""

    }

    usuarios.append(
        novo_usuario
    )

    salvar_usuarios(
        usuarios
    )

    return {

        "sucesso": True,

        "nome":
            novo_usuario["nome"],

        "mensagem":
            "Cadastro realizado com sucesso."

    }


# =========================================================
# LOGIN DE USUÁRIO
# =========================================================

@app.get("/login")
def abrir_login():

    caminho = os.path.join(
        USUARIO_DIR,
        "login.html"
    )

    return FileResponse(caminho)


@app.post("/login")
def fazer_login(dados: Login):

    usuarios = carregar_usuarios()

    email = dados.email.strip().lower()

    senha_hash = gerar_hash(
        dados.senha
    )

    for usuario in usuarios:

        if (
            usuario["email"] == email
            and
            usuario["senha"] == senha_hash
        ):

            return {

                "sucesso":
                    True,

                "nome":
                    usuario["nome"],

                "mensagem":
                    "Login realizado com sucesso."

            }

    return {

        "sucesso":
            False,

        "mensagem":
            "E-mail ou senha incorretos."

    }


# =========================================================
# USUÁRIO
# =========================================================

@app.get("/usuario/{email}")
def obter_usuario(email: str):

    usuarios = carregar_usuarios()

    email = email.strip().lower()

    for usuario in usuarios:

        if usuario["email"] == email:

            return {

                "sucesso":
                    True,

                "nome":
                    usuario["nome"],

                "email":
                    usuario["email"],

                "foto":
                    usuario.get(
                        "foto",
                        ""
                    )

            }

    return {

        "sucesso":
            False,

        "mensagem":
            "Usuário não encontrado."

    }


@app.post("/usuario/foto")
def atualizar_foto_usuario(
    dados: FotoPerfil
):

    usuarios = carregar_usuarios()

    email = dados.email.strip().lower()

    for usuario in usuarios:

        if usuario["email"] == email:

            usuario["foto"] = dados.foto

            salvar_usuarios(
                usuarios
            )

            return {

                "sucesso":
                    True,

                "mensagem":
                    "Foto atualizada com sucesso."

            }

    return {

        "sucesso":
            False,

        "mensagem":
            "Usuário não encontrado."

    }


# =========================================================
# PERFIL
# =========================================================

@app.get("/perfil")
def abrir_perfil():

    caminho = os.path.join(
        USUARIO_DIR,
        "perfil.html"
    )

    return FileResponse(caminho)


# =========================================================
# CONFIGURAÇÕES
# =========================================================

@app.get("/configuracoes")
def abrir_configuracoes():

    caminho = os.path.join(
        USUARIO_DIR,
        "configuracoes.html"
    )

    return FileResponse(caminho)


@app.put("/alterar-senha")
def alterar_senha(
    dados: AlterarSenha
):

    usuarios = carregar_usuarios()

    email = dados.email.strip().lower()

    senha_atual_hash = gerar_hash(
        dados.senha_atual
    )

    nova_senha_hash = gerar_hash(
        dados.nova_senha
    )

    for usuario in usuarios:

        if usuario["email"] != email:
            continue

        if usuario["senha"] != senha_atual_hash:

            return {

                "sucesso":
                    False,

                "mensagem":
                    "Senha atual incorreta."

            }

        usuario["senha"] = nova_senha_hash

        salvar_usuarios(
            usuarios
        )

        return {

            "sucesso":
                True,

            "mensagem":
                "Senha alterada com sucesso."

        }

    return {

        "sucesso":
            False,

        "mensagem":
            "Usuário não encontrado."

    }


# =========================================================
# PISCINAS
# =========================================================

@app.get("/piscinas")
def listar_piscinas():

    with open(
        PISCINAS_FILE,
        "r",
        encoding="utf-8"
    ) as arquivo:

        piscinas = json.load(
            arquivo
        )

    return piscinas

def carregar_piscinas():
    caminho = os.path.join(DATA_DIR, "piscinas.json")

    with open(caminho, "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)

@app.get("/piscinas/detalhes/{nome}")
def detalhes_piscina(nome: str):
    caminho = os.path.join(DATA_DIR, "piscinas.json")

    with open(caminho, "r", encoding="utf-8") as arquivo:
        piscinas = json.load(arquivo)
    empresas = carregar_empresas()

    piscina_encontrada = None

    for piscina in piscinas:
        if piscina["nome"].strip().lower() == nome.strip().lower():
            piscina_encontrada = piscina.copy()
            break

    if not piscina_encontrada:
        return {
            "sucesso": False,
            "mensagem": "Piscina não encontrada."
        }

    # Procura uma empresa vinculada a essa piscina
    empresa_encontrada = None

    for empresa in empresas:
        if empresa.get("piscina_nome", "").strip().lower() == nome.strip().lower():
            empresa_encontrada = empresa
            break

    # Se existir empresa, usa os dados cadastrados por ela
    if empresa_encontrada:
        piscina_encontrada["fotos_empresa"] = empresa_encontrada.get("fotos", [])
        piscina_encontrada["horarios_empresa"] = empresa_encontrada.get("horarios", {})
        piscina_encontrada["precos_empresa"] = empresa_encontrada.get("precos", {})
        piscina_encontrada["descricao_empresa"] = empresa_encontrada.get("descricao", "")
        piscina_encontrada["telefone_empresa"] = empresa_encontrada.get("telefone", "")
        piscina_encontrada["whatsapp_empresa"] = empresa_encontrada.get("whatsapp", "")
        piscina_encontrada["instagram_empresa"] = empresa_encontrada.get("instagram", "")
        piscina_encontrada["site_empresa"] = empresa_encontrada.get("site", "")
    else:
        piscina_encontrada["fotos_empresa"] = []
        piscina_encontrada["horarios_empresa"] = {}
        piscina_encontrada["precos_empresa"] = {}

    return piscina_encontrada


# =========================================================
# DETALHES
# =========================================================

@app.get("/detalhes")
def abrir_detalhes():

    caminho = os.path.join(
        USUARIO_DIR,
        "detalhes.html"
    )

    return FileResponse(caminho)


# =========================================================
# AVALIAÇÕES
# =========================================================

@app.get("/avaliacoes")
def listar_todas_avaliacoes():

    return carregar_avaliacoes()


@app.get(
    "/avaliacoes/usuario/{nome_usuario}"
)
def listar_avaliacoes_usuario(
    nome_usuario: str
):

    avaliacoes = carregar_avaliacoes()

    return [

        avaliacao

        for avaliacao in avaliacoes

        if avaliacao["nome_usuario"]
        == nome_usuario

    ]


@app.get(
    "/avaliacoes/{nome_piscina}"
)
def listar_avaliacoes(
    nome_piscina: str
):

    avaliacoes = carregar_avaliacoes()

    return [

        avaliacao

        for avaliacao in avaliacoes

        if avaliacao["piscina"]
        == nome_piscina

    ]


@app.post("/avaliacoes")
def adicionar_avaliacao(
    avaliacao: Avaliacao
):

    avaliacoes = carregar_avaliacoes()

    if avaliacao.nota < 1 or avaliacao.nota > 5:

        return {

            "sucesso":
                False,

            "mensagem":
                "A nota deve estar entre 1 e 5."

        }

    nova_avaliacao = {

        "piscina":
            avaliacao.piscina.strip(),

        "nome_usuario":
            avaliacao.nome_usuario.strip(),

        "nota":
            avaliacao.nota,

        "comentario":
            avaliacao.comentario.strip()

    }

    avaliacoes.append(
        nova_avaliacao
    )

    salvar_avaliacoes(
        avaliacoes
    )

    return {

        "sucesso":
            True,

        "mensagem":
            "Avaliação enviada com sucesso."

    }


# =========================================================
# EMPRESA - CADASTRO
# =========================================================

@app.get("/empresa/cadastro")
def abrir_cadastro_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-cadastro.html"
    )

    return FileResponse(caminho)


@app.post("/empresa/cadastro")
def cadastrar_empresa(
    empresa: Empresa
):

    empresas = carregar_empresas()

    email = empresa.email.strip().lower()

    cnpj = empresa.cnpj.strip()

    for empresa_existente in empresas:

        if empresa_existente["email"] == email:

            return {

                "sucesso":
                    False,

                "mensagem":
                    "Este e-mail já está cadastrado."

            }

        if empresa_existente["cnpj"] == cnpj:

            return {

                "sucesso":
                    False,

                "mensagem":
                    "Este CNPJ já está cadastrado."

            }

        for empresa_existente in empresas:
            if (
                empresa_existente.get("piscina_nome", "").strip().lower()
                == empresa.piscina_nome.strip().lower()
                and empresa.piscina_nome.strip()
            ):
                return {
                    "sucesso": False,
                    "mensagem": "Esta piscina já esta vinculada a outra empresa."
                }


    nova_empresa = {

        "razao_social":
            empresa.razao_social.strip(),

        "nome_fantasia":
            empresa.nome_fantasia.strip(),

        "piscina_nome":
            empresa.piscina_nome.strip(),

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

        "fotos":
            [],

        "horarios":
            {},

        "senha":
            gerar_hash(
                empresa.senha
            ),

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

        "sucesso":
            True,

        "mensagem":
            "Cadastro enviado para análise."

    }


# =========================================================
# EMPRESA - LOGIN
# =========================================================

@app.get("/empresa/login")
def abrir_login_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-login.html"
    )

    return FileResponse(caminho)


@app.post("/empresa/login")
def fazer_login_empresa(
    dados: LoginEmpresa
):

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

            if empresa.get("status") != "aprovada":

                return {

                    "sucesso":
                        False,

                    "mensagem":
                        "Seu cadastro ainda está em análise."

                }

            return {

                "sucesso":
                    True,

                "nome":
                    empresa["nome_fantasia"],

                "mensagem":
                    "Login realizado com sucesso."

            }

    return {

        "sucesso":
            False,

        "mensagem":
            "E-mail ou senha incorretos."

    }


# =========================================================
# EMPRESA - PAINEL
# =========================================================

@app.get("/empresa/painel")
def abrir_painel_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-painel.html"
    )

    return FileResponse(caminho)


# =========================================================
# EMPRESA - EDITAR
# =========================================================

@app.get("/empresa/editar")
def abrir_editar_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-editar.html"
    )

    return FileResponse(caminho)


@app.put("/empresa/{email}")
def atualizar_empresa(
    email: str,
    dados: AtualizarEmpresa
):

    empresas = carregar_empresas()

    email = email.strip().lower()

    for empresa in empresas:

        if empresa["email"] != email:
            continue

        empresa["razao_social"] = (
            dados.razao_social.strip()
        )

        empresa["nome_fantasia"] = (
            dados.nome_fantasia.strip()
        )

        empresa["piscina_nome"] = (
            dados.piscina_nome.strip()
        )

        empresa["cnpj"] = (
            dados.cnpj.strip()
        )

        empresa["responsavel"] = (
            dados.responsavel.strip()
        )

        empresa["telefone"] = (
            dados.telefone.strip()
        )

        empresa["whatsapp"] = (
            dados.whatsapp.strip()
        )

        empresa["instagram"] = (
            dados.instagram.strip()
        )

        empresa["site"] = (
            dados.site.strip()
        )

        empresa["cep"] = (
            dados.cep.strip()
        )

        empresa["endereco"] = (
            dados.endereco.strip()
        )

        empresa["numero"] = (
            dados.numero.strip()
        )

        empresa["bairro"] = (
            dados.bairro.strip()
        )

        empresa["cidade"] = (
            dados.cidade.strip()
        )

        empresa["estado"] = (
            dados.estado.strip().upper()
        )

        empresa["categoria"] = (
            dados.categoria
        )

        empresa["tipo_piscina"] = (
            dados.tipo_piscina
        )

        empresa["quantidade_piscinas"] = (
            dados.quantidade_piscinas
        )

        empresa["descricao"] = (
            dados.descricao.strip()
        )

        for empresa_existente in empresas:
            if empresa_existente["email"] == email:
                continue

            if (
                empresa_existente.get("piscina_nome", "").strip().lower()
                == dados.piscina_nome.strip().lower()
                and dados.piscina_nome.strip()
            ):
                return {
                    "sucesso": False,
                    "mensagem": "Esta piscina já está vinculada a outra empresa."
                }

        salvar_empresas(
            empresas
        )

        return {

            "sucesso":
                True,

            "mensagem":
                "Informações atualizadas com sucesso!"

        }

    return {

        "sucesso":
            False,

        "mensagem":
            "Empresa não encontrada."

    }


# =========================================================
# EMPRESA - FOTOS
# =========================================================

@app.get("/empresa/fotos")
def abrir_fotos_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-fotos.html"
    )

    return FileResponse(caminho)


@app.put("/empresa/fotos/{email}")
def atualizar_fotos_empresa(
    email: str,
    dados: FotosEmpresa
):

    empresas = carregar_empresas()

    email = email.strip().lower()

    for empresa in empresas:

        if empresa["email"] != email:
            continue

        empresa["fotos"] = dados.fotos

        salvar_empresas(
            empresas
        )

        return {

            "sucesso":
                True,

            "mensagem":
                "Fotos salvas com sucesso!"

        }

    return {

        "sucesso":
            False,

        "mensagem":
            "Empresa não encontrada."

    }


# =========================================================
# EMPRESA - HORÁRIOS
# =========================================================

@app.get("/empresa/horarios")
def abrir_horarios_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-horarios.html"
    )

    return FileResponse(caminho)


@app.put("/empresa/horarios/{email}")
def atualizar_horarios_empresa(
    email: str,
    dados: HorariosEmpresa
):

    empresas = carregar_empresas()

    email = email.strip().lower()

    for empresa in empresas:

        if empresa["email"] != email:
            continue

        empresa["horarios"] = {

            "segunda":
                dados.segunda.strip(),

            "terca":
                dados.terca.strip(),

            "quarta":
                dados.quarta.strip(),

            "quinta":
                dados.quinta.strip(),

            "sexta":
                dados.sexta.strip(),

            "sabado":
                dados.sabado.strip(),

            "domingo":
                dados.domingo.strip()

        }

        salvar_empresas(
            empresas
        )

        return {

            "sucesso":
                True,

            "mensagem":
                "Horários salvos com sucesso!"

        }

    return {

        "sucesso":
            False,

        "mensagem":
            "Empresa não encontrada."

    }

# =========================================================
# EMPRESA - PREÇOS
# =========================================================

@app.get("/empresa/precos")
def abrir_precos_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-precos.html"
    )

    return FileResponse(caminho)

@app.put("/empresa/precos/{email}")
def atualizar_precos_empresa(
    email: str,
    dados: PrecosEmpresa
):

    empresas = carregar_empresas()

    email = email.strip().lower()

    for empresa in empresas:

        if empresa["email"] != email:
            continue

        empresa["precos"] = {
            "mensalidade": dados.mensalidade.strip(),
            "day_use": dados.day_use.strip(),
            "observacao": dados.observacao.strip()
        }

        salvar_empresas(empresas)

        return {
            "sucesso": True,
            "mensagem": "Preços salvos com sucesso!"
        }

    return {
        "sucesso": False,
        "mensagem": "Empresa não encontrada."
    }

# =========================================================
# EMPRESA - AVALIAÇÕES
# =========================================================

@app.get("/empresa/avaliacoes")
def abrir_avaliacoes_empresa():

    caminho = os.path.join(
        EMPRESA_DIR,
        "empresa-avaliacoes.html"
    )

    return FileResponse(caminho)

# =========================================================
# EMPRESA - OBTER DADOS
# =========================================================
# ATENÇÃO:
# Esta rota deve ficar POR ÚLTIMO entre as rotas /empresa/...

@app.get("/empresa/{email}")
def obter_empresa(email: str):

    empresas = carregar_empresas()

    email = email.strip().lower()

    for empresa in empresas:

        if empresa["email"] == email:

            empresa_publica = empresa.copy()

            empresa_publica.pop(
                "senha",
                None
            )

            return {

                "sucesso":
                    True,

                **empresa_publica

            }

    return {

        "sucesso":
            False,

        "mensagem":
            "Empresa não encontrada."

    }