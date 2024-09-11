// Function to load the Dashboard view
function loadDashboard() {
    fetch('/dashboard/')
    .then(response => response.text())
    .then(html => {
        // Extract only the content inside the block "content"
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Make sure #app exists before trying to update its innerHTML
        const contentElement = doc.querySelector('#app');
        if (contentElement) {
            const content = contentElement.innerHTML;
            document.getElementById('app').innerHTML = content;
        } else {
            console.error('Element #app not found in the fetched document.');
        }
    })
    .catch(error => {
        console.error('Error fetching dashboard:', error);
    });
}

// Function to load the Profile view
function loadProfile() {
    fetch('/profile/')
    .then(response => response.text())
    .then(html => {
        // Extract only the content inside the block "content"
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Make sure #app exists before trying to update its innerHTML
        const contentElement = doc.querySelector('#app');
        if (contentElement) {
            const content = contentElement.innerHTML;
            document.getElementById('app').innerHTML = content;

            // Setup avatar selection after profile view is loaded
            setupAvatarSelection();
        } else {
            console.error('Element #app not found in the fetched document.');
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

// Fonction pour mettre à jour l'avatar de l'utilisateur
function updateAvatar(avatar) {
    // Récupérer le token CSRF à partir du formulaire caché
    const csrfToken = document.querySelector('#csrf-form [name=csrfmiddlewaretoken]').value;

    fetch('/profile/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Utilisation du token CSRF récupéré
        },
        body: JSON.stringify({
            'avatar': avatar
        })
    }).then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              console.log('Avatar mis à jour');
              loadDashboard(); // Reload dashboard after avatar update to reflect changes
          }
      })
      .catch(error => {
          console.error('Error updating avatar:', error);
      });
}

// Ajouter un événement de clic à chaque avatar
function setupAvatarSelection() {
    const avatars = document.querySelectorAll('.selectable-avatar');

    avatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            // Enlever la classe 'selected' de tous les avatars
            avatars.forEach(a => a.classList.remove('selected'));

            // Ajouter la classe 'selected' à l'avatar cliqué
            this.classList.add('selected');

            // Mettre à jour l'avatar de l'utilisateur
            const selectedAvatar = this.getAttribute('data-avatar');
            updateAvatar(selectedAvatar);
        });
    });
}

// Event listeners for the navbar links
document.getElementById('dashboard-link').addEventListener('click', function(e) {
    e.preventDefault();
    loadDashboard();
});

document.getElementById('change-avatar-link').addEventListener('click', function(e) {
    e.preventDefault();
    loadProfile();
});

// Optionally load the dashboard by default when the page is first loaded
window.onload = function() {
    loadDashboard(); // Load dashboard when the app starts
};
