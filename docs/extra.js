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


function applyFilters() {
  const checkboxes = document.querySelectorAll('.filter-panel input[type="checkbox"]');
  const items = document.querySelectorAll('.support-item');

  const activeFilters = [];

  checkboxes.forEach(cb => {
    const label = cb.closest('.filter-option');

    if (cb.checked) {
      activeFilters.push(cb.value);
      label.classList.add('active');
    } else {
      label.classList.remove('active');
    }
  });

  items.forEach(item => {
    if (activeFilters.length === 0) {
      item.style.display = "flex";
      return;
    }

    const matches = activeFilters.some(filter =>
      item.classList.contains(filter)
    );

    item.style.display = matches ? "flex" : "none";
  });
}