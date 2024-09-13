// Function to update the player info section with the new avatar

import { loadDashboard } from './app.js';

function updatePlayerInfoAvatar(newAvatarUrl) {
    const playerAvatar = document.querySelector('#player-info img.avatar');
    if (playerAvatar) {
        playerAvatar.src = newAvatarUrl;  // Update the avatar image in player info section
    }
}

// Fonction pour mettre à jour l'avatar de l'utilisateur
function updateAvatar(avatar) {
    const csrfToken = document.querySelector('#csrf-form [name=csrfmiddlewaretoken]').value;

    fetch('/profile/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ 'avatar': avatar })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Avatar mis à jour');
            const newAvatarUrl = data.new_avatar_url;  // URL du nouvel avatar
            updatePlayerInfoAvatar(newAvatarUrl);  // Mettre à jour la section des infos du joueur

            // Ne plus rediriger vers le tableau de bord après la mise à jour de l'avatar.
            // Retirer ou commenter la ligne suivante :
            // loadDashboard();
        }
    })
    .catch(error => {
        console.error('Error updating avatar:', error);
    });
}


// Export functions if needed elsewhere
export { updateAvatar, updatePlayerInfoAvatar };
