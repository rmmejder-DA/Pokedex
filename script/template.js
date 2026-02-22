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
            <img id="pokemonTypeIcon${i}" class="pokemon-type-icon" src="${img[type]}" alt="${type}">
            </div>
            </footer>
        </div>

        <dialog id="dialog${i}" class="pokemon-dialog">
            <header class="dialog-header">
                <h2>${allPkm[i].name}</h2>
                <button class="close-button" onclick="closeDialog(${i})">X</button>
            </header>

            <div class="pokemon-details">
                <div class="pokemon-image-bckColor${allPkm[i].name}">
                    <img loading="lazy" class="pokemon-image-dialog" src="${imageUrl}" alt="${allPkm[i].name}">
                </div>

                    <div class="span">
                        <span id="sameColor${i}" onclick="info(${i})" class="btnunderImgInfo">Info</span>
                        <span id="sameColor${i}" onclick="evolution(${i})" class="btnunderImgEvo">Evo</span>
                        <span id="sameColor${i}" onclick="statistic(${i})" class="btnunderImgStat">Stat</span>
                    </div>
       
                    <div id="pokemonInfo${i}" class="pokemon-info">
                        <p>Height: ${pokemonDetails.height}</p>
                        <p>Weight: ${pokemonDetails.weight}</p>
                    </div>
                </div>

                    <div class="evolution" style="display:none;" id="evolution${i}">
                        <img src="${pokemonDetails.sprites?.other?.['official-artwork']?.front_default || ""}" alt="${allPkm[i].name}">
                        <p class="evoDialog">></p>
                        <img src="${pokemonDetails.sprites?.other?.['official-artwork']?.front_shiny || ""}" alt="${allPkm[i].name}">
                    </div>

                <div class="pokemon-details-none" id="HP${i}" style="display:none;">
                    <p>Base Experience: ${pokemonDetails.base_experience || "N/A"}</p>
                    <p>Abilities: ${pokemonDetails.abilities?.map(ability => ability?.ability?.name)}</p>
                    <p>Stats: ${pokemonDetails.stats?.map(stat => `${stat?.stat?.name}: ${stat?.base_stat}`)}</p>
            </div>
            </dialog>`;
}