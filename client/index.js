import './index.css';
import '../server/layouts/base.js';
console.log("Client-side JavaScript loaded");


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form[action="/projecten"]');
    if (!form) return;
  
    // Hide the submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.style.display = 'none';
    }
  
    // Auto-submit when a radio changes
    const radios = form.querySelectorAll('input[name="id"]');
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        form.submit();
      });
    });
  });
  
  
  