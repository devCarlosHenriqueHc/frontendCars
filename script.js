const apiUrl = "http://localhost:8080/api/v1/cars";
let currentPage = 0;
const pageSize = 10;

// Função para buscar os carros com paginação
async function fetchCars() {
    try {
        const response = await fetch(`${apiUrl}?page=${currentPage}&size=${pageSize}`);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data || !data.content) {
            throw new Error("Resposta inválida da API");
        }

        updateTable(data.content);
        document.getElementById("currentPage").value = currentPage + 1;
    } catch (error) {
        console.error("Erro ao buscar carros:", error);
    }
}

// Função para atualizar a tabela com os dados recebidos
function updateTable(cars) {
    const tableBody = document.getElementById("car-table-body");
    tableBody.innerHTML = ""; // Limpa a tabela antes de inserir novos dados

    cars.forEach(car => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.id}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.modelYear}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para adicionar um novo carro
async function addCar(event) {
    event.preventDefault();

    const brand = document.getElementById("brand").value.trim();
    const model = document.getElementById("model").value.trim();
    const modelYear = document.getElementById("modelYear").value.trim();

    if (!brand || !model || !modelYear) {
        alert("Preencha todos os campos!");
        return;
    }

    const carData = { brand, model, modelYear };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData)
        });

        if (!response.ok) {
            throw new Error(`Erro ao adicionar carro: ${response.status}`);
        }

        alert("Carro adicionado com sucesso!");
        document.getElementById("car-form").reset();
        fetchCars(); // Atualiza a tabela com o novo carro
    } catch (error) {
        console.error("Erro ao adicionar carro:", error);
    }
}

// Atualiza a página ao inserir um número no input
document.getElementById("currentPage").addEventListener("change", (event) => {
    const pageNumber = parseInt(event.target.value);
    if (!isNaN(pageNumber) && pageNumber > 0) {
        currentPage = pageNumber - 1;
        fetchCars();
    } else {
        event.target.value = currentPage + 1;
    }
});

// Paginação
document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    fetchCars();
});

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        fetchCars();
    }
});

// Evento para capturar o envio do formulário
document.getElementById("car-form").addEventListener("submit", addCar);

// Carregar a tabela ao iniciar a página
fetchCars();
