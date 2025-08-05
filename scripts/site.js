// navigation menu overlay
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
const closeMenu = document.getElementById('close-menu');

function getFocusableElements(container) {
  return container.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
}

function openMenu() {
  mainNav.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const firstLink = mainNav.querySelector('a[href]');
    if (firstLink) {
      firstLink.focus();
      console.log('✅ Focus set to first <a>:', firstLink);
    } else {
      const fallback = getFocusableElements(mainNav)[0];
      if (fallback) {
        fallback.focus();
        console.log('⚠️ No <a> found, fallback focus set to:', fallback);
      } else {
        console.warn('⚠️ No focusable elements found!');
      }
    }
  }, 10);
}

function closeNav() {
  mainNav.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.focus();
  document.body.style.overflow = '';
}

// scroll-aware menu button
let lastScrollY = window.scrollY;

function toggleButtonVisibility() {
  const isMenuOpen = mainNav.getAttribute('aria-hidden') === 'false';
  if (isMenuOpen) return; // don't hide buttons while menu is open

  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY) {
    // scrolling down
    menuToggle.classList.add('hidden');
  } else if (currentScrollY < lastScrollY) {
    // scrolling up
    menuToggle.classList.remove('hidden');
  }

  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', toggleButtonVisibility, { passive: true });

// trap focus inside nav
function trapFocus(e) {
  if (mainNav.getAttribute('aria-hidden') === 'true') return;

  const focusables = Array.from(getFocusableElements(mainNav));
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

menuToggle.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeNav);
document.addEventListener('keydown', (e) => {
  // escape key closes menu
  if (e.key === 'Escape' && mainNav.getAttribute('aria-hidden') === 'false') {
    closeNav();
  }
});

mainNav.addEventListener('keydown', trapFocus);
    
// close the menu when any nav link is clicked
mainNav.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', () => {
    closeNav();
  });
}); // end navigation menu overlay

// array of text strings for icebreaker
const textOptions = [
  'How\'s your day going?',
  'What\'s on your mind?',
  'What\'ve you been listening to lately?',
  'What\'s your favorite vegetarian dish?',
  'Where would you bury your treasure?',
  'Rock, paper, or scissors?',
  'Tea or coffee?'
];
// select a random string
const randomIndex = Math.floor(Math.random() * textOptions.length);
const selectedText = textOptions[randomIndex];
// insert into p tag
document.getElementById('icebreakerText').textContent = selectedText;
// end icebreaker

// copy to clipboard
function copyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  //
  // precautionary styling to ensure:
  // 1. the element is able to have focus and selection
  // 2. if the element was to flash render it has minimal visual impact
  // 3. less flakyness with selection and copying which might occur
  // if textarea element is not visible
  //
  // place in the top-left corner of screen regardless of scroll position
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  // ensure it has a small width and height
  // doesn't work as this gives a negative w/h on some browsers
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  // we don't need padding, reducing the size if it does flash render
  textArea.style.padding = 0;
  // clean up any borders
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  // avoid flash of white box if rendered
  textArea.style.background = 'transparent';

  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  // show confirmation message
  try {
    const successful = document.execCommand('copy');
    showToast(successful ? '✓ Email copied' : 'Failed to copy');
  } catch (err) {
    console.error('Unable to copy:', err);
    showToast('Error copying');
  }

  document.body.removeChild(textArea);
}
// toast utility function
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}
// attach event listener to button
document.getElementById('copyEmailBtn').addEventListener('click', function() {
  copyTextToClipboard('hello@carsonhalstead.com');
});

// send email via mailto:
function sendEmail() {
  window.location.href = 'mailto:hello@carsonhalstead.com'
}