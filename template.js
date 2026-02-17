function pokedexTemplate(i, type, imageUrl, cryUrl, pokemonDetails) {
    return `
        <div class="pokemon">
            <header class="pokemon-header">
            <h2>${allPkm[i].name}</h2>
            </header>
            <div class="pokemon-image-bckColor${allPkm[i].name}">
            <img class="pokemon-image" onclick="openDialog(${i}, '${cryUrl}')" src="${imageUrl}" alt="${allPkm[i].name}">
            </div>
            <footer class="pokemon-footer">
            <div class="pokemon-type">
            <p class="pokemon-type-text">${type}</p>
            </div>
            </footer>
        </div>

        <dialog id="dialog${i}" class="pokemon-dialog">
            <header class="dialog-header">
                <h2>${allPkm[i].name}</h2>
                <button class="close-button" onclick="closeDialog(${i})">X</button>
            </header>

            <div class="pokemon-details">
                <img class="pokemon-image-dialog" src="${imageUrl}" alt="${allPkm[i].name}">
                <div class="separator"></div>

                <button onclick="nextInfo(${i})">More Info</button>

                <div id="pokemonInfo${i}" class="pokemon-info">
                <p>Height: ${pokemonDetails.height}</p>
                <p>Weight: ${pokemonDetails.weight}</p>
                </div>
            </div>

            <div class="evolution" style="display:none;" id="evolution${i}">
                <img src="${pokemonDetails.sprites?.front_default || ""}" alt="${allPkm[i].name}">
                <p class="evoDialog">></p>
                <img src="${pokemonDetails.sprites?.back_default || ""}" alt="${allPkm[i].name}">
                <p class="evoDialog">></p>
                <img src="${pokemonDetails.sprites?.front_shiny || ""}" alt="${allPkm[i].name}">
            </div>

            <div class="pokemon-details" id="HP${i}" style="display:none;">
                <p>Base Experience: ${pokemonDetails.base_experience || "N/A"}</p>
                <p>Abilities: ${pokemonDetails.abilities?.map(ability => ability?.ability?.name).join(", ") || "N/A"}</p>
                <p>Stats: ${pokemonDetails.stats?.map(stat => `${stat?.stat?.name}: ${stat?.base_stat}`).join(", ") || "N/A"}</p>
            </div>
            </dialog>`;
}