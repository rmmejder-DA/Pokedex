function pokedexTemplate(i, type, imageUrl, cryUrl ) {
            return `
        <div class="pokemon" tabindex="0">
            <header class="pokemon-header">
            <h2>${allPokemons[i].name}</h2>
            </header>
            <div class="pokflex pokemon-image-bckColor${allPokemons[i].name}">
            <img class="pokemon-image" onclick="openDialog(${i}, '${cryUrl}')" src="${imageUrl}" alt="${allPokemons[i].name}">
            </div>
            <footer class="pokemon-footer">
            <div class="pokemon-type">
            <img id="pokemonTypeIcon${i}" class="pokemon-type-icon" src="${img[type]}" alt="${type}">
            </div>
            </footer>
        </div>`;
}

function dialogPokemonTemplate(i, imageUrl, pokemonDetails) {
    return `
            <header class="dialog-header">
                <h2>${allPokemons[i].name}</h2>
                <button class="close-button" onclick="closeDialog(${i})">X</button>
            </header>

            <div tabindex="0" class="pokemon-details">
                <div class="pokflex pokemonDialogBck${allPokemons[i].name}">
                    <button id="navButton${i}-prev" class="nav-button" onclick="navigatePokemon(${i}, -1)">&#x23F4;</button>
                    <img class="pokemon-image-dialog" src="${imageUrl}" alt="${allPokemons[i].name}">
                    <button id="navButton${i}-next" class="nav-button" onclick="navigatePokemon(${i}, 1)">&#x23F5;</button>
                </div>

                <div tabindex="0" class="span">
                    <span id="sameColor${i}" onclick="info(${i})" class="btnunderImgInfo">Info</span>
                    <span id="sameColor${i}" onclick="evolution(${i})" class="btnunderImgEvo">Evo</span>
                    <span id="sameColor${i}" onclick="statistic(${i})" class="btnunderImgStat">Stat</span>
                </div>
       
                <div tabindex="0" id="pokemonInfo${i}" class="pokemon-info">
                    <p>Height: ${pokemonDetails.height}</p>
                    <p>Weight: ${pokemonDetails.weight}</p>
                </div>
            </div>

            <div tabindex="0" class="evolution" style="display:none;" id="evolution${i}">
                <img src="${pokemonDetails.sprites?.other?.['official-artwork']?.front_default || ""}" alt="${allPokemons[i].name}">
                <p class="evoDialog">&#x23F2;</p>
                <img src="${pokemonDetails.sprites?.other?.['official-artwork']?.front_shiny || ""}" alt="${allPokemons[i].name}">
            </div>

            <div tabindex="0" class="pokemon-details-none" id="HP${i}" style="display:none;">
                <p>Base Experience: ${pokemonDetails.base_experience || "N/A"}</p>
                <p>Abilities: ${pokemonDetails.abilities?.map(ability => ability?.ability?.name)}</p>
                <p class="stats">Stats: ${pokemonDetails.stats?.map(stat => `${stat?.stat?.name}: ${stat?.base_stat}`)}</p>
            </div>`;
        }