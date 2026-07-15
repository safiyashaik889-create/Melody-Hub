const resultBox = document.getElementById("musicResults");

async function searchMusic() {

    const searchTerm = document
        .getElementById("searchInput")
        .value
        .trim();

    if (searchTerm === "") {
        alert("Please enter a song or artist name.");
        return;
    }

    resultBox.innerHTML = `
        <div class="loading">
            <h2>🎵 Searching Music...</h2>
            <p>Please wait while we find your faavourite songs 🎶</p>
        </div>
    `;

    const encoded = encodeURIComponent(searchTerm);

    // FIXED
    const apiURL = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=24`;

    try {

        const response = await fetch(apiURL);
        const data = await response.json();

        displaySongs(data.results);

    } catch (error) {

        resultBox.innerHTML = `
            <h2>❌ Something went wrong!</h2>
        `;

        console.log(error);
    }
}

function displaySongs(songs) {

    resultBox.innerHTML = "";

    if (songs.length === 0) {

        resultBox.innerHTML = `
            <h2>No Songs Found 😔</h2>
        `;

        return;
    }

    songs.forEach((song, index) => {

        const release = song.releaseDate
            ? new Date(song.releaseDate).getFullYear()
            : "N/A";

        const image = song.artworkUrl100.replace("100x100", "500x500");

        resultBox.innerHTML += `

        <div class="card">

            <div class="number">
                #${index + 1}
            </div>

            <img src="${image}" alt="Album Art">

            <h2>${song.trackName}</h2>

            <p>🎤 <strong>Artist:</strong> ${song.artistName}</p>

            <p>💿 <strong>Album:</strong> ${song.collectionName}</p>

            <p>🎼 <strong>Genre:</strong> ${song.primaryGenreName}</p>

            <p>📅 <strong>Released:</strong> ${release}</p>

            ${
                song.previewUrl
                ?
                `
                <audio controls>
                    <source src="${song.previewUrl}" type="audio/mpeg">
                </audio>
                `
                :
                `<p>No Preview Available</p>`
            }

            <a href="${song.trackViewUrl}"
               target="_blank"
               class="listen-btn">
               🎧 Listen on Apple Music
            </a>

        </div>

        `;
    });
    enableSingleAudioPlayback();
}

document
.getElementById("searchInput")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        searchMusic();
    }

});

// Allow only one song to play at a time
function enableSingleAudioPlayback() {

    const audioPlayers = document.querySelectorAll("audio");

    audioPlayers.forEach((player) => {

        player.addEventListener("play", function () {

            audioPlayers.forEach((audio) => {

                if (audio !== this) {

                    audio.pause();
                    audio.currentTime = 0;

                }

            });

        });

    });

}