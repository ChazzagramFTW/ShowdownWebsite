const sections = document.querySelectorAll("main section[id]");
const homeLink = document.querySelector('nav a[href="https://mcshowdown.org"]');

window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
  const scrollY = window.pageYOffset;

  if (scrollY < 50) {
    homeLink.classList.add("active");
  } else {
    homeLink.classList.remove("active");
  }

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100; // adjust for header
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