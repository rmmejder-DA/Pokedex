const limit = 10;
let offset = 0;
let allPkm = [];

function capitalizeString() {
    let pokedexElement = document.getElementById("pokedex");
    let H2 = pokedexElement.getElementsByTagName("h2");
    for (let i = 0; i < H2.length; i++) {
        let string = H2[i].innerHTML;
        if (string.length > 0) {
            H2[i].innerHTML = string[0].toUpperCase() + string.slice(1);
        }
    }
}

function updateBtn() {
    let btnFooter = document.getElementById("loadButtonFooter");
    if (btnFooter) {
        btnFooter.innerHTML = "&#x21BB;";
        btnFooter.onmouseover = () => {
            btnFooter.style.transform = "rotateZ(150deg)";
        };
        btnFooter.onmouseout = () => {
            btnFooter.style.transform = "none";
        };
        btnFooter.onclick = () => {
            location.reload();
        };
    }
}

async function nextLoading() {
    let loadBtn = document.getElementById("loadButton");
    const pokedexContainer = document.getElementsByClassName("page_content")[0];
    if (loadBtn && pokedexContainer && offset >= 60) {
        loadBtn.innerHTML = "Neuladen";
        pokedexContainer.style.flexDirection = "unset";
        btnStyle();
        updateBtn();
        loadBtn.onclick = () => {
            location.reload();
        };
    }
    offset += limit;
    await showLoadSpinner();
}

function timeout() {
    let loadingElement = document.getElementById("loading");
    setTimeout(() => {
        loadingElement.style.display = "none";
        document.getElementById("pokedex").style.display = "flex";
        document.getElementById("searchBar").style.display = "block";
        document.getElementById("loadButton").style.display = "block";
    }, 3000);
}

async function showLoadSpinner() {
    document.getElementById("loadButton").style.display = "none";
    document.getElementById("pokedex").style.display = "none";
    document.getElementById("searchBar").style.display = "none";
    let loadElement = document.getElementsByClassName("LOAD")[0];
    if (loadElement) {
        loadElement.style.flexDirection = "column";
    }
    let loadingElement = document.getElementById("loading");
    if (loadingElement) {
        loadingElement.style.display = "flex";
    }
    await pokedexLoad(offset);
    timeout();
    return allPkm
}

async function pokeLoad(currentOffset = 0) {
    const BASE_URL = `https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`;
    let response = await fetch(BASE_URL);
    let responseJson = await response.json();
    allPkm = allPkm.concat(responseJson.results); // Alle Pokémon in allPkm speichern
    if (allPkm.length > 60) {
        allPkm = allPkm.slice(0, 60); //
    }
    return allPkm;
}

async function pokedexLoad(currentOffset) {
    await pokeLoad(currentOffset);
    let pokedexContainer = document.getElementById("pokedex");
    pokedexContainer.innerHTML = "";
    for (let i = 0; i < allPkm.length; i++) {
        let pokemonDetails = await fetch(allPkm[i].url).then(res => res.json());
        let type = pokemonDetails.types[0]?.type?.name || "unknown";
        let imageUrl = pokemonDetails.sprites?.other?.['dream_world']?.front_default || pokemonDetails.sprites?.front_default || "";
        let cryUrl = `https://play.pokemonshowdown.com/audio/cries/${allPkm[i].name}.mp3`;
        pokedexContainer.innerHTML += pokedexTemplate(i, type, imageUrl, cryUrl, pokemonDetails);
    }
    capitalizeString();
    attention();
}

function attention() {
    let attentionElement = document.getElementById("Attention");
    attentionElement.style.display = "block";
    setTimeout(() => {
        attentionElement.style.display = "none";
    }, 2000);
}

function btnStyle() {
    let loadBtn = document.getElementById("loadButton");
    loadBtn.style.marginTop = "unset";
    loadBtn.style.writingMode = "vertical-rl";
    loadBtn.style.textOrientation = "upright";
    loadBtn.style.border = "1px solid #ccc";
    loadBtn.style.padding = "10px";
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
    allPkm.forEach((pokemon, index) => {
        if (pokemon.name.toLowerCase().includes(input.length > 2 ? input : '')) {
            pokemonElements[index].style.display = '';
        } else {
            pokemonElements[index].style.display = 'none';
        }
    });
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

function navigatePokemon(currentIndex) {
    let pokemonElements = document.getElementsByClassName('pokemon');
    let visibleIndices = [];
    for (let i = 0; i < pokemonElements.length; i++) {
        if (pokemonElements[i].style.display !== 'none') {
            visibleIndices.push(i);
        }
    } 
    if (visibleIndices.length === 0) {
        return;
    }
    const newIndex = navPokSearch(currentIndex, 1, visibleIndices);
    closeDialog(currentIndex);
    const newCryUrl = `https://play.pokemonshowdown.com/audio/cries/${allPkm[newIndex].name}.mp3`;
    openDialog(newIndex, newCryUrl);
}

document.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIALOG') {
        document.body.classList.remove("noscroll");
        event.target.close();
    }
});

function sameColor(index) {
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