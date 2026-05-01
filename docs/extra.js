document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll('a');
    links.forEach(function(link) {
        // Check if the link is external (starts with http)
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        }
    });
});

function filterSelection(category) {
  const items = document.getElementsByClassName("support-item");

  for (let i = 0; i < items.length; i++) {
    if (category === "all") {
      items[i].style.display = "flex";
    } else {
      if (items[i].classList.contains(category)) {
        items[i].style.display = "flex";
      } else {
        items[i].style.display = "none";
      }
    }
  }
}