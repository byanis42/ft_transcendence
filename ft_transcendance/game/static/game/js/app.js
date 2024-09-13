// Imports
import { updateAvatar } from './playerInfo.js';
import { startPongGame, stopPongGame } from './pongGame.js';

// Function to load the Dashboard view
export function loadDashboard() {
    fetch('/dashboard/')
    .then(response => response.text())
    .then(html => {
        // Injecter le contenu du dashboard dans le conteneur #app
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const contentElement = doc.querySelector('#app');
        if (contentElement) {
            document.getElementById('app').innerHTML = contentElement.innerHTML;

            // Lier le bouton de démarrage du jeu à la fonction startPongGame
            document.getElementById('start-game-btn').addEventListener('click', function() {
                startPongGame();  // Démarrer le jeu Pong
            });
        } else {
            console.error('Élément #app non trouvé dans le document récupéré.');
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement du tableau de bord :', error);
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
            document.getElementById('app').innerHTML = contentElement.innerHTML;

            setupAvatarSelection();  // Setup avatar selection functionality
        } else {
            console.error('Element #app not found in the fetched document.');
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

// Add event listeners for each avatar to allow selection
function setupAvatarSelection() {
    const avatars = document.querySelectorAll('.selectable-avatar');

    avatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            // Enlever la classe 'selected' de tous les avatars
            avatars.forEach(a => a.classList.remove('selected'));

            // Ajouter la classe 'selected' à l'avatar cliqué
            this.classList.add('selected');

            const selectedAvatar = this.getAttribute('data-avatar');
            updateAvatar(selectedAvatar);  // Appel de la fonction pour mettre à jour l'avatar
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("dashboard-link").addEventListener("click", function (e) {
        e.preventDefault();
        loadDashboard();
    });

    document.getElementById("change-avatar-link").addEventListener("click", function (e) {
        e.preventDefault();
        loadProfile();
    });

    document.getElementById("launch-game").addEventListener("click", function () {
        // Afficher la fenêtre des paramètres du jeu
        document.getElementById("game-settings").style.display = "block";
        document.getElementById("pongCanvas").style.display = "none";  // Masquer le canvas du jeu
    });

    document.getElementById("start-game").addEventListener("click", function () {
        // Récupérer les paramètres sélectionnés
        const ballSpeed = parseInt(document.getElementById("ball-speed").value);
        const paddleSize = parseInt(document.getElementById("paddle-size").value);

        // Masquer la fenêtre des paramètres
        document.getElementById("game-settings").style.display = "none";
        document.getElementById("pongCanvas").style.display = "block";  // Afficher le canvas du jeu

        // Démarrer le jeu avec les paramètres choisis
        startPongGame(ballSpeed, paddleSize);
    });
});

// Load the dashboard by default when the page is first loaded
window.onload = function () {
    document.getElementById("launch-game").addEventListener("click", function () {
        // Afficher la fenêtre des paramètres du jeu
        document.getElementById("game-settings").style.display = "block";
        document.getElementById("pongCanvas").style.display = "none";  // Masquer le canvas du jeu
    });

    document.getElementById("start-game").addEventListener("click", function () {
        // Récupérer les paramètres sélectionnés
        const ballSpeed = parseInt(document.getElementById("ball-speed").value);
        const paddleSize = parseInt(document.getElementById("paddle-size").value);

        // Masquer la fenêtre des paramètres
        document.getElementById("game-settings").style.display = "none";
        document.getElementById("pongCanvas").style.display = "block";  // Afficher le canvas du jeu

        // Démarrer le jeu avec les paramètres choisis
        startPongGame(ballSpeed, paddleSize);
    });
};
