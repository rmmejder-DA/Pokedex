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

function nextLoading() {
    let loadBtn = document.getElementById("loadButton");
    const pokedexContainer = document.getElementsByClassName("page_content")[0];
    if (loadBtn && pokedexContainer) {
        loadBtn.innerHTML = "Neuladen";
        pokedexContainer.style.flexDirection = "unset";
        btnStyle();
        updateBtn();
        if (loadBtn) {
            loadBtn.onclick = () => {
                location.reload();
            };
        }
    }
    offset += limit;
    showLoadSpinner();
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
    document.getElementsByClassName("LOAD")[0].style.flexDirection = "column";
    timeout();
    let loadingElement = document.getElementById("loading");
    loadingElement.style.display = "flex";
    await pokedexLoad(offset);
}

async function pokeLoad(currentOffset = 0) {
    const BASE_URL = `https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`;
    let response = await fetch(BASE_URL);
    let responseJson = await response.json();
    allPkm = allPkm.concat(responseJson.results); // fügt die neuen Pokémon zur bestehenden Liste hinzu
    if (allPkm.length > 20) {
        allPkm = allPkm.slice(0, 20); // begrenzt die Liste auf die ersten 20 Pokémon
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
        let imageUrl = pokemonDetails.sprites?.other?.['official-artwork']?.front_default || pokemonDetails.sprites?.front_default || "";
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

function info(index) {
    let pokemonInfoElement = document.getElementById(`pokemonInfo${index}`);
    let evolutionElement = document.getElementById(`evolution${index}`);
    let hpElement = document.getElementById(`HP${index}`);
    if (pokemonInfoElement && evolutionElement && hpElement) {
        pokemonInfoElement.style.display = "flex";
        evolutionElement.style.display = "none";
        hpElement.style.display = "none";
    }
}

function evolution(index) {
    let pokemonInfoElement = document.getElementById(`pokemonInfo${index}`);
    let evolutionElement = document.getElementById(`evolution${index}`);
    let hpElement = document.getElementById(`HP${index}`);
    if (pokemonInfoElement && evolutionElement && hpElement) {
        pokemonInfoElement.style.display = "none";
        evolutionElement.style.display = "flex";
        hpElement.style.display = "none";
    }
}

function statistic(index) {
    let pokemonInfoElement = document.getElementById(`pokemonInfo${index}`);
    let evolutionElement = document.getElementById(`evolution${index}`);
    let hpElement = document.getElementById(`HP${index}`);
    if (pokemonInfoElement && evolutionElement && hpElement) {
        pokemonInfoElement.style.display = "none";
        evolutionElement.style.display = "none";
        hpElement.style.display = "flex";
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

function validateSearchInput() {
    let input = document.getElementById('searchBar').value;
    if (input.length > 0 && !/^[\p{L}]+$/u.test(input)) {
        alert("Bitte geben Sie nur Buchstaben ein.");
        document.getElementById('searchBar').value = '';
        if (loadButton) {
            loadButton.style.display = "block";
        }
        filterPokemon();
    } else {
        searchPokemon();
    }
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
    validateSearchInput();
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

document.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIALOG') {
        document.body.classList.remove("noscroll");
        event.target.close();
    }
});

function sameColor(index) {
    letbckGrImg = document.querySelector(`.pokemon-image-bckColor${allPkm[index].name}`);
    if (letbckGrImg) {
        let computedStyle = window.getComputedStyle(letbckGrImg);
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