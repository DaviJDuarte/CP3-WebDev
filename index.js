let toggleState = false;
let categoria = "";
let ordernar = "";
let produtosOriginais = []
let apenasDisponiveis = false;

const renderProductCards = (containerProdutos) => {
    let produtos = [...produtosOriginais]

    if (categoria) {
        produtos = produtosOriginais.filter(produto => produto.categoria === categoria);
    }

    if (apenasDisponiveis) {
        produtos = produtos.filter(produto => produto.disponibilidade === true);
    }

    if (ordernar) {
        switch (ordernar) {
            case "preco-cres":
                produtos = produtos.sort((a, b) => a.preco - b.preco);
                break;
            case "preco-decr":
                produtos = produtos.sort((a, b) => b.preco - a.preco);
                break;
            case "alfa-cres":
                produtos = produtos.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case "alfa-decr":
                produtos = produtos.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
            case "disponibilidade":
                produtos = produtos.sort((a, b) => b.disponibilidade - a.disponibilidade);
                break;
        }
    }

    for (let i = 0; i < produtos.length; i++) {
        const card = document.createElement("div");
        card.classList.add("produto");
        card.innerHTML = `
            <h2>${produtos[i].nome}</h2>
            <p>${produtos[i].categoria}</p>
            <p>R$ ${produtos[i].preco.toFixed(2)}</p>
            <p class="${produtos[i].disponibilidade ? "available" : "unavailable"}">${produtos[i].disponibilidade ? "Em estoque" : "Indisponível"}</p>
            <button class="adicionar-carrinho" ${produtos[i].disponibilidade ? "" : "disabled"}>Adicionar ao carrinho</button>
        `;
        containerProdutos.appendChild(card);
    }
}

const removeProducts = () => {
    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(produto => {
        produto.remove();
    })
}

const toggleProdutos = (container, listButton) => {
    container.classList.toggle("hide");
    listButton.innerHTML = toggleState ? "Listar Produtos" : "Esconder Produtos";

    toggleState = !toggleState;
}

const showAddedToCartToast = (nome, preco) => {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `
            <p>Produto adicionado: ${nome} - ${preco}</p>
            <button class="close-toast">X</button>
        `;
    document.body.appendChild(toast);

    const closeButton = toast.querySelector(".close-toast");
    closeButton.addEventListener("click", () => {
        toast.remove();
    });

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".adicionar-carrinho") || event.target.closest(".adicionar-carrinho")) {
        const button = event.target.matches(".adicionar-carrinho") ?
            event.target :
            event.target.closest(".adicionar-carrinho");

        if (!button.disabled) {
            const card = button.closest(".produto");
            const nome = card.querySelector("h2").textContent;
            const preco = card.querySelector("p:nth-of-type(2)").textContent;

            showAddedToCartToast(nome, preco);

            button.textContent = "Adicionado!";
            setTimeout(() => button.textContent = "Adicionar ao carrinho", 3000);
        }
    }
});

document.addEventListener("DOMContentLoaded", (event) => {
    const container = document.querySelector("#container");
    const containerProdutos = document.querySelector("#container-produtos");
    const listButton = document.querySelector("#listar-produtos");
    const form = document.querySelector("#produtos-form");

    container.classList.toggle("hide");

    listButton.innerHTML = "Listar Produtos";
    listButton.addEventListener("click", () => {
        toggleProdutos(container, listButton);
    })

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        categoria = document.querySelector("#categoria").value;
        apenasDisponiveis = document.querySelector("#disponibilidade").checked;
        ordernar = document.querySelector("#ordenar").value;

        removeProducts()
        renderProductCards(containerProdutos);
    })

    fetch("./produtos.json")
        .then(response => response.json())
        .then(data => {
            produtosOriginais = data.produtos
            renderProductCards(containerProdutos);
        })
        .catch(error => console.error("Error loading JSON:", error));
})

