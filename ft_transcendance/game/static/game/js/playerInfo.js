// Function to update the player info section with the new avatar
export function updatePlayerInfoAvatar(newAvatarUrl) {
    const playerAvatar = document.querySelector('#player-info img.avatar');
    if (playerAvatar) {
        playerAvatar.src = newAvatarUrl;  // Update the avatar image in player info section
    }
}

// Function to update the user's avatar
export function updateAvatar(avatar) {
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
            console.log('Avatar successfully updated');
            const newAvatarUrl = data.new_avatar_url;
            updatePlayerInfoAvatar(newAvatarUrl);  // Update the avatar in player info section
        }
    })
    .catch(error => {
        console.error('Error updating avatar:', error);
    });
}
