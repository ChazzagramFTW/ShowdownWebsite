const sections = document.querySelectorAll("main section[id]");
const homeLink = document.querySelector('nav a[href="index.html#"]');


window.addEventListener("scroll", navHighlighter);


function navHighlighter() {
  let scrollY = window.pageYOffset;

  if (scrollY < 50) {
    homeLink.classList.add("active");
  } else {
    homeLink.classList.remove("active");
  }

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop-200;
    let sectionId = current.getAttribute("id");

    const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (!navLink) return;

    if (
      scrollY > sectionTop &&
      scrollY <= sectionTop + sectionHeight
    ) {
      navLink.classList.add("active");
    } else {
      navLink.classList.remove("active");
    }
  });
}