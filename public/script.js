const menuBtn = document.querySelector('.toggle-button');
const dropMenu = document.querySelector('.drop-menu');

let menuOpen = false;
menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
    dropMenu.style.display = 'block';
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
    dropMenu.style.display = 'none';
  }
});



