const inputTarefa = document.querySelector("#inputTarefa");
const btnEnviar = document.querySelector("#enviar");
const inputPesquisar = document.querySelector("#inputPesquisar");
const btnPesquisar = document.querySelector("#btnPesquisar");
const campoFiltros = {
    campo: document.querySelector("#campoFiltros"),
    todas: document.querySelector("#filtroTodas"),
    pendentes: document.querySelector("#filtroPendentes"),
    concluidas: document.querySelector("#filtroConcluidas")
};
const listaTarefas = document.querySelector("#listaTarefas");
let modoEnvio = "criar"; // "criar" para criar novas tarefas / "editar" para editar tarefas já existentes
let tarefaEmAlteracao;

function carregando() {
    document.body.style.backgroundImage = `url("https://picsum.photos/${screen.width}/${screen.height}")`;
}

function limpaInput() {
    inputTarefa.value = "";
    inputTarefa.focus();
}

function criarMsgErro(texto) {
    const msgErro = document.createElement("p");
    msgErro.className ="w-100 m-0 bg-danger rounded avisoInput";
    msgErro.innerText = texto;
    return msgErro;
}

function salvaTarefas() {
    const tarefas = document.querySelectorAll(".tarefa");
    const listaDeTarefas = [];
    tarefas.forEach((tarefa) => listaDeTarefas.push(tarefa.innerText.trim()));
    listaJSON = JSON.stringify(listaDeTarefas);
    localStorage.setItem("listaSalva", listaJSON);
}

function carregarTarefas() {
    const listaJSON = localStorage.getItem("listaSalva");
    const listaConvertida = JSON.parse(listaJSON);
    listaConvertida.forEach((tarefa) => criarTarefa(tarefa));
}

function excluirTarefa(tarefa) {
    tarefa.remove();
    salvaTarefas();
}

function verificarDisplay(tarefa) {
    if (tarefa.classList.contains("display-pesquisa") && tarefa.classList.contains("display-filtro"))
        tarefa.style.display = "flex";
    else tarefa.style.display = "none";
}

function pesquisarTarefa() {
    const tarefas = document.querySelectorAll(".tarefa");
    let texto = inputPesquisar.value.trim().toLowerCase();
    tarefas.forEach((tarefa) => {
        if (tarefa.innerText.trim().toLowerCase().includes(texto) || texto.length === 0) {
            tarefa.classList.add("display-pesquisa");
        }
        else {
            tarefa.classList.remove("display-pesquisa");
        }
        verificarDisplay(tarefa);
    });
}

function filtrarTarefas() {
    const tarefas = document.querySelectorAll(".tarefa");
    tarefas.forEach((tarefa) => {   
        if (campoFiltros.concluidas.checked) {
            if (tarefa.classList.contains("bg-success-subtle")) {
                tarefa.classList.add("display-filtro");
            }
            else tarefa.classList.remove("display-filtro");
        }
        else if (campoFiltros.pendentes.checked) {
            if (!tarefa.classList.contains("bg-success-subtle")) {
                tarefa.classList.add("display-filtro");
            }
            else tarefa.classList.remove("display-filtro");
        }
        else if (campoFiltros.todas.checked) {
            tarefa.classList.add("display-filtro");
        }
        verificarDisplay(tarefa);
    });
}

function criarTarefa(tarefa) {
    if (modoEnvio === "criar") {
        const novaTarefa = document.createElement("li");
        novaTarefa.className = "tarefa w-100 rounded-2 my-3 p-2 shadow flex-column display-pesquisa display-filtro";
        novaTarefa.innerHTML = `<p>${tarefa.trim()}</p>`;
        novaTarefa.innerHTML += 
        `<div class="tarefaControles">
            <button type="button" class="concluirTarefa botaoTarefa">
                <i class="bi bi-check-circle-fill"></i>
            </button>
            <button type="button" class="editarTarefa botaoTarefa">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button type="button" class="excluirTarefa botaoTarefa">
                <i class="bi bi-trash-fill"></i>
            </button>
        </div>`;
        novaTarefa.addEventListener('click', (clique) => {
            const alvo = clique.target;
            if (alvo.classList.contains("concluirTarefa") || alvo.parentElement.classList.contains("concluirTarefa")) {
                novaTarefa.classList.toggle("bg-success-subtle");
                filtrarTarefas();
            }
            if (alvo.classList.contains("editarTarefa") || alvo.parentElement.classList.contains("editarTarefa")) {
                inputTarefa.value = tarefa.trim();
                modoEnvio = "editar";
                inputTarefa.focus();
                tarefaEmAlteracao = novaTarefa;
            }
            if (alvo.classList.contains("excluirTarefa") || alvo.parentElement.classList.contains("excluirTarefa"))
                excluirTarefa(novaTarefa);
        });
        listaTarefas.appendChild(novaTarefa);
        limpaInput();
        salvaTarefas();
    }
}

function mudarTarefa(texto) {
    if (modoEnvio === "editar") {
        tarefaEmAlteracao.innerHTML = `<p>${texto.trim()}</p>`;
        tarefaEmAlteracao.innerHTML += 
        `<div class="tarefaControles">
            <button type="button" class="concluirTarefa botaoTarefa">
                <i class="bi bi-check-circle-fill"></i>
            </button>
            <button type="button" class="editarTarefa botaoTarefa">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button type="button" class="excluirTarefa botaoTarefa">
                <i class="bi bi-trash-fill"></i>
            </button>
        </div>`;
        limpaInput();
        salvaTarefas();
        modoEnvio = "criar";
        tarefaEmAlteracao = null;
    }
}

function enviarTarefa() {
    document.querySelectorAll(".avisoInput").forEach((x) => x.remove());
    if (inputTarefa.value.length > 0) {
        if (modoEnvio === "criar")
            criarTarefa(inputTarefa.value);
        else mudarTarefa(inputTarefa.value);
    }
    else {
        inputTarefa.parentElement.appendChild(criarMsgErro("Entrada inválida!"));
    }
}

document.addEventListener('load', carregando);
inputTarefa.addEventListener('keypress', (tecla) => {
    if (tecla.key === "Enter") {
        enviarTarefa();
    }
})
btnEnviar.addEventListener('click', enviarTarefa);
inputPesquisar.addEventListener('keypress', (tecla) => {
    if (tecla.key === "Enter") {
        pesquisarTarefa();
    }
})
btnPesquisar.addEventListener('click', pesquisarTarefa);
campoFiltros.campo.addEventListener('click', filtrarTarefas);

carregarTarefas();
