document.addEventListener('DOMContentLoaded', () => {


  // Certification Photo Toggle
  const button = document.getElementById('show-certification');
  const photo = document.querySelector('.certification-photo');

  if (button && photo) {
    button.addEventListener('click', () => {
      photo.classList.toggle('hidden');
      button.textContent = photo.classList.contains('hidden') ? "See My Certification" : "Hide My Certification";
    });
  } else {
    console.error('Button or photo element is missing!');
  }


   // Week Navigation
  const weeks = [
    { label: "Sunday, June 1st" },
    // { label: "Sunday, March 9th" },
  ];

  // Intersection Observer for Animations
  const sections = document.querySelectorAll('.service-section, .schedule-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));

  const currentWeekLabel = document.getElementById("current-week");
  const prevButton = document.getElementById("prev-week");
  const nextButton = document.getElementById("next-week");
  const weekSlides = document.querySelectorAll(".week-slide");

  let currentIndex = 0;

  // Function to update the displayed week
  const updateWeek = () => {
    currentWeekLabel.textContent = weeks[currentIndex].label;

    weekSlides.forEach((slide, index) => {
      slide.style.display = index === currentIndex ? "block" : "none"; // Show only the current week's slide
    });

    prevButton.disabled = currentIndex === 0; // Disable "Previous Week" button if at the start
    nextButton.disabled = currentIndex === weeks.length - 1; // Disable "Next Week" button if at the end
  };

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateWeek();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < weeks.length - 1) {
      currentIndex++;
      updateWeek();
    }
  });

  // Initialize the week display
  updateWeek();
  

  // Booking Modal Elements
  const modal = document.getElementById('policy-modal');
  const closeButton = document.querySelector('.close-button');
  const policyCheckbox = document.getElementById('policy-checkbox');
  const proceedButton = document.getElementById('proceed-button');
  let selectedFormUrl = null;

  // Fetch and Update Spots Left for All Classes
  const spotsElements = document.querySelectorAll('.spots-left');
  spotsElements.forEach(async (element) => {
    const spotsUrl = element.getAttribute('data-spots-url');
    if (spotsUrl) {
      try {
        const response = await fetch(spotsUrl);
        const data = await response.json();
        const spotsLeft = data.spotsLeft;
        element.textContent = `Spots Left: ${spotsLeft}`;
        updateBookingButton(element.nextElementSibling, spotsLeft);
      } catch (error) {
        console.error(`Error fetching spots from ${spotsUrl}:`, error);
        element.textContent = "Spots Left: Error";
      }
    }
  });

  function updateBookingButton(button, spotsLeft) {
    if (spotsLeft === 0) {
      button.disabled = true;
      button.textContent = 'Fully Booked';
      button.style.backgroundColor = '#ccc';
      button.style.cursor = 'not-allowed';
    } else {
      button.disabled = false;
      button.textContent = 'Book Now';
      button.style.backgroundColor = '';
      button.style.cursor = 'pointer';
    }
  }


  // Show Modal and Handle Booking
  document.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', () => {
      selectedFormUrl = button.getAttribute('data-form-url');
      modal.style.display = 'flex';
    });
  });

  // Close Modal
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    selectedFormUrl = null;
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      selectedFormUrl = null;
    }
  });

  policyCheckbox.addEventListener('change', () => {
    proceedButton.disabled = !policyCheckbox.checked;
  });

  proceedButton.addEventListener('click', () => {
    if (selectedFormUrl) {
      window.open(selectedFormUrl, '_blank', 'width=600,height=800');
    }
    modal.style.display = 'none';
    policyCheckbox.checked = false;
    proceedButton.disabled = true;
  });
});
