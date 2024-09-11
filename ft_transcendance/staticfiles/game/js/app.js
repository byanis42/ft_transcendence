// Fonction pour charger la page de dashboard
function loadDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div>
            <h1 class="mb-4">Bienvenue sur le tableau de bord</h1>
            <p class="welcome-text">Bonjour, ${userDisplayName} !</p>
            <div>
                <img src="${userAvatarUrl}" alt="Avatar de ${userDisplayName}" class="avatar img-thumbnail">
            </div>
            <button class="btn btn-success mt-3">Jouer</button>
        </div>
    `;
}

// Fonction pour charger la page de changement d'avatar
function loadChangeAvatarPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container text-center mt-5">
            <h1>Changer d'avatar</h1>
            <div class="row mt-4" id="avatar-selection">
            </div>
        </div>
    `;

    // Charger les avatars
    fetch('/api/avatars/') // Assume an API endpoint exists to fetch avatars
        .then(response => response.json())
        .then(avatars => {
            const avatarSelection = document.getElementById('avatar-selection');
            avatarSelection.innerHTML = avatars.map(avatar => `
                <div class="col-2">
                    <img src="${avatar.url}" class="avatar img-thumbnail" alt="Avatar" data-avatar="${avatar.name}">
                </div>
            `).join('');

            // Ajouter un event listener sur chaque avatar pour mise à jour
            document.querySelectorAll('[data-avatar]').forEach(avatarEl => {
                avatarEl.addEventListener('click', () => {
                    const selectedAvatar = avatarEl.getAttribute('data-avatar');
                    // Changer l'avatar de l'utilisateur via l'API
                    fetch('/profile/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,  // Assume CSRF token is globally available
                        },
                        body: JSON.stringify({ 'avatar': selectedAvatar })
                    })
                    .then(() => {
                        // Actualiser l'avatar et revenir au dashboard
                        userAvatarUrl = avatarEl.src; // mettre à jour l'URL de l'avatar localement
                        loadDashboard();
                    });
                });
            });
        });
}

// Gestion des liens dans la navbar pour une navigation SPA
document.getElementById('dashboard-link').addEventListener('click', loadDashboard);
document.getElementById('change-avatar-link').addEventListener('click', loadChangeAvatarPage);

// Initialiser le tableau de bord au chargement de la page
window.addEventListener('load', loadDashboard);
