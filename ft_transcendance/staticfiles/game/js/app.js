// Fonction pour charger la page de connexion
function loadLoginPage() {
	const app = document.getElementById('app');
	app.innerHTML = `
		<div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
			<div class="card p-4" style="width: 400px;">
				<h3 class="text-center">Connexion</h3>
				<div class="text-center mt-4">
					<a href="/login" class="btn btn-primary btn-lg w-100">
						Se connecter avec 42
					</a>
				</div>
			</div>
		</div>
	`;
}

// Charger la page de connexion au lancement
loadLoginPage();
