let allPokemons = [];
let allPkm = [];
let visibleCount = 15;
let offset = 0;
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0";

function showLoadSpinner() {
    let pokedexDiv = document.getElementById("pokedex");
    let searchBar = document.getElementById("searchBar");
    let loadingElement = document.getElementById("loading");
    let loadElement = document.getElementsByClassName("LOAD")[0];
    btnDisplay();
    if (pokedexDiv && searchBar && loadingElement && loadElement) {
        pokedexDiv.style.display = "none";
        searchBar.style.display = "none";
        loadingElement.style.display = "flex";
        loadingElement.style.flexDirection = "column";
        loadElement.style.display = "flex";
    }
    timeout();
}

function btnDisplay() {
        const button = document.getElementById("loadButton");
    if (button) {
        button.style.display = "none";
    }
}

function update() {
    attention();
    renderPokemons();
    renderColor();
}

async function fetchPokemons() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);
        const data = await res.json();
        allPokemons = data.results;
        allPkm = await Promise.all(
            allPokemons.map(pokemon => fetch(pokemon.url).then(res => res.json()))
        );
        update();
    } catch (err) {
        document.getElementById("pokedex").innerHTML = `<p style="color: red">Fehler: ${err.message}</p>`;
    }
    capitalizeString();
}

function renderColor() {
    allPkm.forEach((pokemon) => {
        let type = pokemon.types?.[0]?.type?.name || "unknown";
        let color = colorMap[type] || "#68A090";
        let pkmDialog = document.querySelector(`.pokemonDialogBck${pokemon.name}`);
        if (pkmDialog) {
            pkmDialog.style.backgroundColor = color;
        }
        let bckGrImg = document.querySelector(`.pokemon-image-bckColor${pokemon.name}`);
        if (bckGrImg) {
            bckGrImg.style.backgroundColor = color;
        }
    });
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
}

function renderDialog(i) {
    const dialog = document.getElementById(`dialogpokemon`);
    if (!dialog) return;
    const pokemonDetails = allPkm[i] || {};
    const imageUrl = pokemonDetails.sprites?.other?.['official-artwork']?.front_default || "";
    dialog.innerHTML = dialogPokemonTemplate(i, imageUrl, pokemonDetails);
    capitalizeString();
    renderColor();
    sameColor(i);
}

function loadMore() {
    visibleCount = Math.min(visibleCount + 15, allPokemons.length);
    const btn = document.getElementById("loadButton");
    if (allPokemons.length <= visibleCount && btn) {
        btn.innerHTML = "Reload";
        btn.style.color = "red";
        btn.onclick = () => {
            location.reload();
        };
    }
    renderPokemons();
    renderColor();
    capitalizeString();
}

fetchPokemons();

function capitalizeString() {
    let pokedexElement = document.getElementById("pokedex");
    let dialogElement = document.getElementById("dialogpokemon");
    const capitalizeElements = (element) => {
        if (element) {
            let H2 = element.getElementsByTagName("h2");
            for (let i = 0; i < H2.length; i++) {
                let string = H2[i].innerHTML;
                if (string.length > 0) {
                    H2[i].innerHTML = string[0].toUpperCase() + string.slice(1);
                }
            }
        }
    };
    capitalizeElements(pokedexElement);
    capitalizeElements(dialogElement);
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

function attention() {
    let attentionElement = document.getElementById("Attention");
    if (attentionElement) {
        attentionElement.style.display = "block";
        setTimeout(() => {
            attentionElement.style.display = "none";
        }, 1000);
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
    renderDialog(index);
    let dialog = document.getElementById(`dialogpokemon`);
    if (dialog) {
        document.body.classList.add("noscroll");
        dialog.showModal();
        if (cryUrl) {
            let audio = new Audio(cryUrl);
            audio.play();
        }
    }
}

function closeDialog() {
    let dialog = document.getElementById(`dialogpokemon`);
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
        closeDialog();
        openDialog(newIndex, `https://play.pokemonshowdown.com/audio/cries/${allPkm[newIndex].name}.mp3`);
    }
}

function sameColor(index) {
    let type = allPkm[index].types?.[0]?.type?.name || "unknown";
    let color = colorMap[type] || "#68A090";
    let sameColorElements = document.querySelectorAll(`#sameColor${index}`);
    sameColorElements.forEach(element => {
        element.style.backgroundColor = color;
    });
}

document.addEventListener('keydown', function (event) {
    let dialog = document.getElementById(`dialogpokemon`);
    if (dialog && dialog.open) {
        let h2Element = dialog.querySelector('h2');
        if (h2Element) {
            let currentIndex = allPkm.findIndex(pokemon => pokemon.name === h2Element.textContent.toLowerCase());
            if (currentIndex !== -1) {
                if (event.key === 'ArrowLeft') {
                    navigatePokemon(currentIndex, -1);
                } else if (event.key === 'ArrowRight') {
                    navigatePokemon(currentIndex, 1);
                }
            }
        }
        if (event.key === 'Escape') {
            closeDialog();
        }
    }
});

document.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIALOG') {
        document.body.classList.remove("noscroll");
        event.target.close();
    }
});