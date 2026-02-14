const sections = document.querySelectorAll("main section[id]");

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