const pathParts = window.location.pathname.split('/');
const playerName = pathParts[2];
const container = document.getElementById("player-info");

if (!playerName) {
  document.body.innerHTML = "<h1>No player specified</h1>";
} else {
  loadPlayerData(playerName);
}

async function loadPlayerData(playerName) {
  try {
    const response = await fetch(`/api/player/${playerName}`);

    if (!response.ok) {
      console.error("Fetch failed:", response.status);
      return;
    }

    const data = await response.json();
    console.log("Player data:", data);

    const container = document.querySelector(".container");

    // Player name header
    const nameHeader = document.createElement("h1");
    nameHeader.textContent = playerName;
    container.appendChild(nameHeader);

    // Events section
    const teamArticle = document.createElement("article");
    teamArticle.classList.add("events-played");

    const teamTitle = document.createElement("h2");
    teamTitle.textContent = `Events Played (${data.total_events})`;
    teamArticle.appendChild(teamTitle);

    const headerRow = document.createElement("div");
    headerRow.classList.add("row", "header");
    headerRow.innerHTML = `
      <div>Event</div>
      <div>Team</div>
      <div>Placement</div>
      <div>Points</div>
    `;
    teamArticle.appendChild(headerRow);

    // Loop through returned events
    data.events.forEach(event => {
      const row = document.createElement("div");
      row.classList.add("row");

      row.innerHTML = `
        <div>${event.season_name}</div>
        <div>${event.team}</div>
        <div>${event.placement}</div>
        <div>${event.points}</div>
      `;

      teamArticle.appendChild(row);
    });

    container.appendChild(teamArticle);

  } catch (error) {
    console.error("Error loading player:", error);
  }
}