const sections = document.querySelectorAll("main section[id]");
const searchInput = document.getElementById("player-search");
const suggestionsBox = document.getElementById("suggestions");

window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150; // adjust for header
    const sectionId = section.getAttribute("id");

    // Match links that end with the section hash
    const navLink = document.querySelector(`nav a[href$="#${sectionId}"]`);
    if (!navLink) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink.classList.add("active");
    } else {
      navLink.classList.remove("active");
    }
  });
}

const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
});

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }

    const res = await fetch(`/api/players/search?q=${encodeURIComponent(query)}`);
    const players = await res.json();

    if (!players.length) {
        suggestionsBox.style.display = "none";
        return;
    }

    suggestionsBox.innerHTML = "";
    players.forEach(player => {
        const div = document.createElement("div");
        div.innerHTML = `<img src="https://minotar.net/helm/${player._id}/24.png" alt="${player._id}" class="team-player-img"><p>${player._id}</p>`
        div.style.padding = "8px";
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
            searchInput.value = player._id;
            suggestionsBox.style.display = "none";
            window.location.href = `/player/${encodeURIComponent(player._id)}`;
        });
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
});

// Hide suggestions if clicked outside
document.addEventListener("click", e => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = "none";
    }
});