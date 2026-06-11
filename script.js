// =========================
// FILAFÁCIL 1.0
// =========================

const modal =
document.getElementById("modalCadastro");

const nomeCliente =
document.getElementById("nomeCliente");

const btnEntrarFila =
document.getElementById("btnEntrarFila");

const btnCancelar =
document.getElementById("btnCancelar");

const busca =
document.getElementById("busca");

let servicoSelecionado = null;

// =========================
// BANCO LOCAL
// =========================

let filas = JSON.parse(
localStorage.getItem("filafacil")
) || {

    Banco: [],
    "Posto de Saúde": [],
    Hospital: [],
    Laboratório: [],
    Prefeitura: [],
    Universidade: []

};

let contadores = JSON.parse(
localStorage.getItem("contadores")
) || {

    Banco: 0,
    "Posto de Saúde": 0,
    Hospital: 0,
    Laboratório: 0,
    Prefeitura: 0,
    Universidade: 0

};

// =========================
// PREFIXOS
// =========================

const prefixos = {

    Banco: "B",
    "Posto de Saúde": "PS",
    Hospital: "H",
    Laboratório: "L",
    Prefeitura: "P",
    Universidade: "U"

};

// =========================
// ABRIR MODAL
// =========================

document
.querySelectorAll(".card")
.forEach(card => {

    card.addEventListener("click", () => {

        servicoSelecionado =
        card.querySelector("h4").innerText;

        nomeCliente.value = "";

        modal.style.display = "flex";

        nomeCliente.focus();

    });

});

// =========================
// FECHAR MODAL
// =========================

btnCancelar.addEventListener(
"click",
() => {

    modal.style.display = "none";

}
);

// =========================
// CONFIRMAR ENTRADA
// =========================

btnEntrarFila.addEventListener(
"click",
() => {

    const nome =
    nomeCliente.value.trim();

    if(!nome){

        alert(
        "Digite seu nome."
        );

        return;

    }

    entrarFila(
        servicoSelecionado,
        nome
    );

}
);

// =========================
// ENTRAR FILA
// =========================

function entrarFila(
servico,
nome
){

    contadores[servico]++;

    const senha =

    prefixos[servico] +

    "-" +

    String(
        contadores[servico]
    ).padStart(3,"0");

    const cliente = {

        nome,

        servico,

        senha,

        posicao:
        filas[servico].length + 1,

        tempo:
        (filas[servico].length + 1) * 5,

        entrada:
        new Date()
        .toLocaleTimeString(),

        status:
        "Aguardando"

    };

    filas[servico].push(
        cliente
    );

    salvar();

    localStorage.setItem(
        "ultimaSenha",
        JSON.stringify(cliente)
    );

    atualizarPainel();

    renderizarFilas();

    modal.style.display =
    "none";

    alert(
`Senha gerada:

${cliente.senha}

Serviço:
${cliente.servico}

Posição:
${cliente.posicao}

Tempo estimado:
${cliente.tempo} min`
    );

}

// =========================
// SALVAR
// =========================

function salvar(){

    localStorage.setItem(
        "filafacil",
        JSON.stringify(filas)
    );

    localStorage.setItem(
        "contadores",
        JSON.stringify(contadores)
    );

}

// =========================
// PAINEL
// =========================

function atualizarPainel(){

    const ultimaSenha =
    JSON.parse(
        localStorage.getItem(
            "ultimaSenha"
        )
    );

    if(!ultimaSenha) return;

    document.querySelector(
        ".ticket-number"
    ).innerHTML =
    ultimaSenha.senha;

    document.querySelector(
        ".ticket-info"
    ).innerHTML =

    `
    <p>
        Cliente:
        <strong>
        ${ultimaSenha.nome}
        </strong>
    </p>

    <p>
        Serviço:
        <strong>
        ${ultimaSenha.servico}
        </strong>
    </p>

    <p>
        Posição:
        <strong>
        ${ultimaSenha.posicao}
        </strong>
    </p>

    <p>
        Tempo:
        <strong>
        ${ultimaSenha.tempo} min
        </strong>
    </p>

    <p>
        Entrada:
        <strong>
        ${ultimaSenha.entrada}
        </strong>
    </p>

    <p>
        Status:
        <strong>
        ${ultimaSenha.status}
        </strong>
    </p>
    `;

}

// =========================
// FILAS
// =========================

function renderizarFilas(){

    const lista =
    document.getElementById(
        "listaFilas"
    );

    lista.innerHTML = "";

    Object.keys(filas)
    .forEach(servico => {

        const total =
        filas[servico].length;

        let status =
        "🟢 Livre";

        if(total >= 5)
            status =
            "🟡 Moderada";

        if(total >= 10)
            status =
            "🔴 Lotada";

        lista.innerHTML +=

        `
        <div class="queue-card">

            <h4>
                ${servico}
            </h4>

            <p>
                ${status}
            </p>

            <p>
                Pessoas:
                ${total}
            </p>

        </div>
        `;

    });

}

// =========================
// BUSCA
// =========================

busca.addEventListener(
"keyup",
() => {

    const termo =
    busca.value
    .toLowerCase();

    document
    .querySelectorAll(".card")
    .forEach(card => {

        const nome =
        card.innerText
        .toLowerCase();

        card.style.display =

        nome.includes(
            termo
        )

        ? "block"
        : "none";

    });

}
);

// =========================
// INICIAR
// =========================

atualizarPainel();

renderizarFilas();