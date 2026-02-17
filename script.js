const limit = 10;
let offset = 0;
let allPkm = [];

async function showLoadSpinner() {
    document.getElementById("loadButton").style.display = "none";
    document.getElementById("pokedex").style.display = "none";
    document.getElementById("searchBar").style.display = "none";
    document.getElementsByClassName("LOAD")[0].style.flexDirection = "column";
    Timeout();
    let loadingElement = document.getElementById("loading");
    loadingElement.style.display = "flex";
    await pokedexLoad(offset);
}

function Timeout() {
    let loadingElement = document.getElementById("loading");
    setTimeout(() => {
        loadingElement.style.display = "none";
        document.getElementById("pokedex").style.display = "flex";
        document.getElementById("searchBar").style.display = "block";
        document.getElementById("loadButton").style.display = "block";
    }, 3000);
}

async function pokedexLoad(currentOffset = 0) {
    const BASE_URL = `https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`;
    let response = await fetch(BASE_URL);
    let responseJson = await response.json();
    allPkm = responseJson.results;
    let pokedexContainer = document.getElementById("pokedex");
    pokedexContainer.innerHTML = "";
    for (let i = 0; i < allPkm.length; i++) {
        let pokemonDetails = await fetch(allPkm[i].url).then(res => res.json());
        let type = pokemonDetails.types?.[0]?.type?.name || "Unknown";
        let imageUrl = pokemonDetails.sprites?.front_default || "";
        let cryUrl = pokemonDetails.cries?.latest || "";
        pokedexContainer.innerHTML += pokedexTemplate(i, type, imageUrl, cryUrl, pokemonDetails);
    }
}

function nextLoading() {
    offset += limit;
    if (offset >= 20) {
        offset = 0;
    }
    showLoadSpinner();
}

function nextInfo(index) {
    let pokemonInfoElement = document.getElementById(`pokemonInfo${index}`);
    let evolutionElement = document.getElementById(`evolution${index}`);
    let hpElement = document.getElementById(`HP${index}`);
    if (pokemonInfoElement && evolutionElement && hpElement) {
        if (pokemonInfoElement.style.display !== "none") {
            pokemonInfoElement.style.display = "none";
            evolutionElement.style.display = "flex";
            hpElement.style.display = "none";
        } else if (evolutionElement.style.display !== "none") {
            pokemonInfoElement.style.display = "none";
            evolutionElement.style.display = "none";
            hpElement.style.display = "flex";
        } else {
            pokemonInfoElement.style.display = "flex";
            evolutionElement.style.display = "none";
            hpElement.style.display = "none";
        }
    }
}

function filterPokemon() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let pokemonElements = document.getElementsByClassName('pokemon');
    allPkm.forEach((pokemon, index) => {
        if (pokemon.name.toLowerCase().includes(input)) {
            pokemonElements[index].style.display = '';
        } else {
            pokemonElements[index].style.display = 'none';
        }
    });
}

function searchPokemon() {
    filterPokemon();
    let input = document.getElementById('searchBar').value.toLowerCase();
    let loadButton = document.getElementById("loadButton");
    if (loadButton && input.length > 0) {
        loadButton.style.display = "none";
    } else if (loadButton) {
        loadButton.style.display = "block";
    }
}

function openDialog(index, cryUrl) {
    let dialog = document.getElementById(`dialog${index}`);
    if (dialog) {
        dialog.showModal();
        if (cryUrl) {
            let audio = new Audio(cryUrl);
            audio.play();
        }
    }
}

function closeDialog(index) {
    let dialog = document.getElementById(`dialog${index}`);
    if (dialog) {
        dialog.close();
    }
}

document.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIALOG') {
        event.target.close();
    }
});