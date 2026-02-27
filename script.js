let allPokemons = [];
let allPkm = [];
let visibleCount = 10;
let offset = 0;
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=60";

async function fetchPokemons() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);
        const data = await res.json();
        allPokemons = data.results;
        allPkm = await Promise.all(
            allPokemons.map(pokemon => fetch(pokemon.url).then(res => res.json()))
        );
        attention();
        renderPokemons();
    } catch (err) {
        document.getElementById("pokedex").innerHTML = `<p style="color: red">Fehler: ${err.message}</p>`;
    }
    capitalizeString();
}

function renderPokemons() {
    const pokemonListDiv = document.getElementById("pokedex");
    pokemonListDiv.innerHTML = "";
    for (let i = 0; i < Math.min(visibleCount, allPokemons.length); i++) {
        const pokemon = allPokemons[i];
        const pokemonDetails = allPkm[i] || {};
        const type = pokemonDetails.types?.[0]?.type?.name || "unknown";
        const imageUrl = pokemonDetails.sprites?.other?.['official-artwork']?.front_default || "";
        const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemon.name}.mp3`;
        pokemonListDiv.innerHTML += pokedexTemplate(i, type, imageUrl, cryUrl, pokemonDetails);
    }
    visibleCountCheck();
}

function visibleCountCheck() {
    if (visibleCount < allPokemons.length) {
        const pageContent = document.getElementsByClassName("page_content")[0];
        if (pageContent) {
            pageContent.style.flexDirection = "column";
        }
        const button = document.createElement("button");
        button.textContent = "More...";
        button.className = "more";
        button.id = "loadButton";
        button.style.display = "none";
        button.onclick = loadMore;
        pageContent.appendChild(button);
    }
    capitalizeString();
}

function loadMore() {
    visibleCount = Math.min(visibleCount + 10, allPokemons.length);
    const btn = document.getElementById("loadButton");
    if (allPokemons.length <= visibleCount && btn) {
        btn.innerHTML = "Reload";
        btn.onclick = () => {
            location.reload();
        };
    }
    renderPokemons();
}

fetchPokemons();

function capitalizeString() {
    let pokedexElement = document.getElementById("pokedex");
    if (pokedexElement) {
        let H2 = pokedexElement.getElementsByTagName("h2");
        for (let i = 0; i < H2.length; i++) {
            let string = H2[i].innerHTML;
            if (string.length > 0) {
                H2[i].innerHTML = string[0].toUpperCase() + string.slice(1);
            }
        }
    }
}

function timeout() {
    let loadingElement = document.getElementById("loading");
    if (loadingElement) {
        setTimeout(() => {
            loadingElement.style.display = "none";
            document.getElementById("pokedex").style.display = "flex";
            document.getElementById("searchBar").style.display = "block";
            document.getElementById("loadButton").style.display = "block";
        }, 3000);
    }
}

async function showLoadSpinner() {
    let loadButton = document.getElementById("loadButton");
    let pokedexDiv = document.getElementById("pokedex");
    let searchBar = document.getElementById("searchBar");
    if (loadButton) loadButton.style.display = "none";
    if (pokedexDiv) pokedexDiv.style.display = "none";
    if (searchBar) searchBar.style.display = "none";
    let loadElement = document.getElementsByClassName("LOAD")[0];
    if (loadElement) {
        loadElement.style.flexDirection = "column";
    }
    let loadingElement = document.getElementById("loading");
    if (loadingElement) {
        loadingElement.style.display = "flex";
    }
    timeout();
    return allPokemons;
}


function attention() {
    let attentionElement = document.getElementById("Attention");
    if (attentionElement) {
        attentionElement.style.display = "block";
        setTimeout(() => {
            attentionElement.style.display = "none";
        }, 2000);
    }
}

function toggleTabDisplay(index, infoDisplay, evolutionDisplay, hpDisplay) {
    let pokemonInfoElement = document.getElementById(`pokemonInfo${index}`);
    let evolutionElement = document.getElementById(`evolution${index}`);
    let hpElement = document.getElementById(`HP${index}`);
    if (pokemonInfoElement && evolutionElement && hpElement) {
        pokemonInfoElement.style.display = infoDisplay;
        evolutionElement.style.display = evolutionDisplay;
        hpElement.style.display = hpDisplay;
    }
}

function info(index) {
    toggleTabDisplay(index, "flex", "none", "none");
}

function evolution(index) {
    toggleTabDisplay(index, "none", "flex", "none");
}

function statistic(index) {
    toggleTabDisplay(index, "none", "none", "flex");
}

function filterPokemon() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let pokemonElements = document.getElementsByClassName('pokemon');
    for (let i = 0; i < pokemonElements.length; i++) {
        let pokemon = allPkm[i];
        if (pokemon && pokemon.name.toLowerCase().includes(input.length > 2 ? input : '')) {
            pokemonElements[i].style.display = '';
        } else if (pokemonElements[i]) {
            pokemonElements[i].style.display = 'none';
        }
    }
}

function validateSearchInput() {
    let input = document.getElementById('searchBar').value;
    if (input.length > 0 && !/^[\p{L}]+$/u.test(input)) {
        alert("Bitte geben Sie nur Buchstaben ein.");
        document.getElementById('searchBar').value = '';
        let loadButton = document.getElementById("loadButton");
        if (loadButton) {
            loadButton.style.display = "block";
        }
        filterPokemon();
    }
}

function searchPokemon() {
    validateSearchInput();
    filterPokemon();
    let input = document.getElementById('searchBar').value.toLowerCase();
    let loadButton = document.getElementById("loadButton");
    if (loadButton && input.length > 2) {
        loadButton.style.display = "none";
    } else if (loadButton) {
        loadButton.style.display = "block";
    }
}

function openDialog(index, cryUrl) {
    let dialog = document.getElementById(`dialog${index}`);
    if (dialog) {
        document.body.classList.add("noscroll");
        dialog.showModal();
        if (cryUrl) {
            let audio = new Audio(cryUrl);
            audio.play();
        }
    }
    sameColor(index);
}

function closeDialog(index) {
    let dialog = document.getElementById(`dialog${index}`);
    if (dialog) {
        document.body.classList.remove("noscroll");
        dialog.close();
    }
}

function navPokSearch(currentIndex, direction, visibleIndices) {
    let currentVisibleIndex = visibleIndices.indexOf(currentIndex);
    let newVisibleIndex = currentVisibleIndex + direction;
    if (newVisibleIndex < 0) {
        newVisibleIndex = visibleIndices.length - 1;
    }
    if (newVisibleIndex >= visibleIndices.length) {
        newVisibleIndex = 0;
    }
    let newIndex = visibleIndices[newVisibleIndex];
    return newIndex;
}

function navigatePokemon(currentIndex, direction) {
    let pokemonElements = document.getElementsByClassName('pokemon');
    let visibleIndices = [];
    for (let i = 0; i < pokemonElements.length; i++) {
        if (pokemonElements[i].style.display !== 'none') {
            visibleIndices.push(i);
        }
    }
    if (visibleIndices.length > 0) {
        let newIndex = navPokSearch(currentIndex, direction, visibleIndices);
        closeDialog(currentIndex);
        openDialog(newIndex, `https://play.pokemonshowdown.com/audio/cries/${allPkm[newIndex].name}.mp3`);
    }
}

document.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIALOG') {
        document.body.classList.remove("noscroll");
        event.target.close();
    }
});

function sameColor(index) {
    if (!allPkm[index]) return;
    let bckGrImg = document.querySelector(`.pokemon-image-bckColor${allPkm[index].name}`);
    if (bckGrImg) {
        let computedStyle = window.getComputedStyle(bckGrImg);
        let backgroundColor = computedStyle.backgroundColor;
        let infoBtn = document.querySelector(`#sameColor${index}.btnunderImgInfo`);
        let evoBtn = document.querySelector(`#sameColor${index}.btnunderImgEvo`);
        let statBtn = document.querySelector(`#sameColor${index}.btnunderImgStat`);
        if (infoBtn && evoBtn && statBtn) {
            infoBtn.style.backgroundColor = backgroundColor;
            evoBtn.style.backgroundColor = backgroundColor;
            statBtn.style.backgroundColor = backgroundColor;
        }
    }
}