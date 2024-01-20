document.addEventListener('DOMContentLoaded', function() {
    const icon = document.getElementById('like-icon');
    icon.addEventListener('click', function() {
      // Toggle the 'clicked' class
      icon.classList.toggle('clicked');
    });
  });