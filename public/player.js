const pathParts = window.location.pathname.split('/');
const playerName = pathParts[2];
const container = document.getElementById("player-info");
const poses = ["default", "marching", "walking", "crouching", "ultimate", "pointing", "kicking", "lunging"];

document.addEventListener("DOMContentLoaded", function () {
  if (!playerName) {
    document.body.innerHTML = "<h1>No player specified</h1>";
  } else {
    loadPlayerData(playerName);
  }
});

async function loadPlayerData(playerName) {
  try {
    const response = await fetch(`/api/player/${playerName}`);
    if (!response.ok) {
      console.error("Fetch failed:", response.status);
      return;
    }

    const data = await response.json();
    console.log("Player data:", data);

    container.innerHTML = ""; // clear previous

    const randomIndex = Math.floor(Math.random() * poses.length);

    const pose = poses[randomIndex];

    const playerSkin = document.createElement("div");
    playerSkin.innerHTML = `<img src="https://starlightskins.lunareclipse.studio/render/${pose}/${playerName}/full" alt="${playerName}">`;
    playerSkin.id = "skin-container";
    container.appendChild(playerSkin);

    const playerInfo = document.createElement("section");
    playerInfo.classList.add("player-info-stuff");

    // Player header
    const nameHeader = document.createElement("h1");
    nameHeader.textContent = playerName;
    playerInfo.appendChild(nameHeader);

    // Events
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

    const rowBox = document.createElement("div");
    rowBox.classList.add("rows");

    data.events.forEach(event => {
      const row = document.createElement("div");
      row.classList.add("row");
      row.innerHTML = `
        <div>${event.season_name}</div>
        <div>${event.team}</div>
        <div>${event.placement}</div>
        <div>${event.points}</div>
      `;
      rowBox.appendChild(row);
    });

    teamArticle.appendChild(rowBox);

    playerInfo.appendChild(teamArticle);

    container.append(playerInfo);

  } catch (error) {
    console.error("Error loading player:", error);
  }
}