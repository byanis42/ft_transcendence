import { updateAvatar } from './playerInfo.js';  // Import the function to update the avatar

// Function to load the Dashboard view
export function loadDashboard() {
    fetch('/dashboard/')
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const contentElement = doc.querySelector('#app');
        if (contentElement) {
            document.getElementById('app').innerHTML = contentElement.innerHTML;
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
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const contentElement = doc.querySelector('#app');
        if (contentElement) {
            const content = contentElement.innerHTML;
            document.getElementById('app').innerHTML = content;

            setupAvatarSelection();  // Set up avatar selection after loading profile
        } else {
            console.error('Element #app not found in the fetched document.');
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

// Function to handle avatar selection and apply visual effects
function setupAvatarSelection() {
    const avatars = document.querySelectorAll('.selectable-avatar');

    avatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            avatars.forEach(a => a.classList.remove('selected'));
            this.classList.add('selected');

            const selectedAvatar = this.getAttribute('data-avatar');
            updateAvatar(selectedAvatar);  // Call the function to update the avatar
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

// Load the dashboard by default when the page is first loaded
window.onload = function() {
    loadDashboard();
};
