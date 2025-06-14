document.addEventListener('DOMContentLoaded', function() {
      // Add click event listeners to FAQ items
      const faqItems = document.querySelectorAll('.faq-item');

      faqItems.forEach(item => {
        item.addEventListener('click', function() {
          // Toggle active class for styling
          this.classList.toggle('active');
        });
      });
    });