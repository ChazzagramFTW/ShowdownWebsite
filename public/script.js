const eventButtons = document.querySelectorAll(".event-panel");
const dropdown = document.querySelector('.event-dropdown');
const selected = dropdown.querySelector('.selected');
const optionsContainer = dropdown.querySelector('.options');
const options = dropdown.querySelectorAll('.option');
const container = document.getElementById("leaderboards");

selected.addEventListener('click', () => {
    optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
});

options.forEach(option => {
    option.addEventListener('click', () => {
        const src = option.getAttribute('data-src');
        selected.querySelector('img').src = src;
         const eventName = option.getAttribute('data-event');
        optionsContainer.style.display = 'none';
        loadLeaderboards(eventName);
    });
});

// Close dropdown if clicking outside
document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        optionsContainer.style.display = 'none';
    }
});

async function loadEventData() {
  const response = await fetch("/api/events");
  const data = await response.json();
  console.log(data); // now you can render this in your webpage
}

loadEventData();

async function loadLeaderboards(event) {
  try {
    const response = await fetch("/api/events");

    if (!response.ok) {
      console.error("Fetch failed:", response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log("Data from API:", data);

    const seasons = data[0].seasons;
    if (!seasons || !Array.isArray(seasons)) {
      console.error("Seasons is not an array!", seasons);
      return;
    }

    const teams = data[0].team_info;

    container.innerHTML = "";

    seasons.forEach(season => {
      // Season Section
      if(season.season_name === event){
        const seasonSection = document.createElement("section");
        seasonSection.classList.add("season");

        const seasonTitle = document.createElement("h2");
        seasonTitle.textContent = season.season_name;
        seasonSection.appendChild(seasonTitle);

        // Container for leaderboards
        const tablesContainer = document.createElement("div");
        tablesContainer.classList.add("tables");

        // Team Leaderboard
        const teamArticle = document.createElement("article");
        teamArticle.classList.add("team-leaderboard");

        const teamTitle = document.createElement("h3");
        teamTitle.textContent = "Team Leaderboard";
        teamArticle.appendChild(teamTitle);

        // Header row
        const teamHeader = document.createElement("div");
        teamHeader.classList.add("row", "header");
        teamHeader.innerHTML = `<div>#</div><div>Team</div><div>Points</div>`;
        teamArticle.appendChild(teamHeader);
        let teamcolor = "white";

        if (Array.isArray(season.team_leaderboard)) {
          season.team_leaderboard.forEach((team, index) => {
            teams.forEach(teaminfo => {
              if(teaminfo.team_name == team.team_name){
                teamcolor = teaminfo.team_color;
              }
            });
            
            const teamPlayers = season.player_leaderboard.filter(player => 
              player.team === team.team_name
            );

            const imagesHTML = teamPlayers.map(player => 
              `<img src="https://minotar.net/helm/${player.player_name}/24.png" alt="${player.player_name}" class="team-player-img">`
            ).join("");

            const row = document.createElement("div");
            row.classList.add("row");
            row.innerHTML = `<div>${index + 1}.</div><div style="color: ${teamcolor};">${team.team_name}</div><div class="team-images">${imagesHTML}</div><div>${team.points}</div>`;
            teamArticle.appendChild(row);
            teamcolor = "white";
          });
        }

        tablesContainer.appendChild(teamArticle);

        // Player Leaderboard
        const playerArticle = document.createElement("article");
        playerArticle.classList.add("player-leaderboard");

        const playerTitle = document.createElement("h3");
        playerTitle.textContent = "Player Leaderboard";
        playerArticle.appendChild(playerTitle);

        // Header row
        const playerHeader = document.createElement("div");
        playerHeader.classList.add("row", "header");
        playerHeader.innerHTML = `<div>#</div><div>Player</div><div>Points</div>`;
        playerArticle.appendChild(playerHeader);

        const scoresList = document.createElement("section");
        scoresList.classList.add("scores-list");
        playerArticle.appendChild(scoresList);

        if (Array.isArray(season.player_leaderboard)) {
          season.player_leaderboard.forEach((player, index) => {
            teams.forEach(teaminfo => {
              if(teaminfo.team_name == player.team){
                teamcolor = teaminfo.team_color;
              }
            });
            const row = document.createElement("div");
            row.classList.add("row");
            row.innerHTML = `<div>${index + 1}.</div><img src="https://minotar.net/helm/${player.player_name}/24.png" alt="${player.player_name}"><div style="color: ${teamcolor};">${player.player_name}</div><div>${player.points}</div>`;
            scoresList.appendChild(row);
          });
        }

        tablesContainer.appendChild(playerArticle);

        seasonSection.appendChild(tablesContainer);
        container.appendChild(seasonSection);
      }
    });

  } catch (err) {
    console.error("Error loading leaderboards:", err);
  }
}



loadLeaderboards("Season One");