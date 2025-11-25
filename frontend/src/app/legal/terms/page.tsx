import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="card p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Conditions d'Utilisation
            </h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-sm text-gray-600 mb-6">
                Dernière mise à jour : 20 novembre 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des conditions</h2>
                <p className="text-gray-700 mb-4">
                  En accédant et en utilisant Annonces Auto CI, vous acceptez d'être lié par ces conditions d'utilisation. 
                  Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description du service</h2>
                <p className="text-gray-700 mb-4">
                  Annonces Auto CI est une plateforme en ligne permettant aux utilisateurs de publier, rechercher et 
                  consulter des annonces de véhicules automobiles en Côte d'Ivoire.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et compte utilisateur</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Vous devez fournir des informations exactes et à jour lors de votre inscription</li>
                  <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
                  <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
                  <li>Un seul compte par utilisateur est autorisé</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Publication d'annonces</h2>
                <p className="text-gray-700 mb-4">En publiant une annonce, vous vous engagez à :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Fournir des informations exactes et véridiques sur le véhicule</li>
                  <li>Être le propriétaire légitime du véhicule ou avoir l'autorisation de le vendre</li>
                  <li>Utiliser des photos authentiques du véhicule</li>
                  <li>Respecter les lois en vigueur en Côte d'Ivoire</li>
                  <li>Ne pas publier de contenu illégal, trompeur ou offensant</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Modération</h2>
                <p className="text-gray-700 mb-4">
                  Toutes les annonces sont soumises à modération avant publication. Nous nous réservons le droit de :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Refuser ou supprimer toute annonce non conforme</li>
                  <li>Suspendre ou fermer tout compte enfreignant nos règles</li>
                  <li>Modifier ou retirer du contenu sans préavis</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Transactions</h2>
                <p className="text-gray-700 mb-4">
                  Annonces Auto CI est une plateforme de mise en relation. Nous ne sommes pas partie aux transactions 
                  entre acheteurs et vendeurs. Les utilisateurs sont seuls responsables de leurs transactions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Services payants</h2>
                <p className="text-gray-700 mb-4">
                  Certains services (boost d'annonces, annonces premium) sont payants. Les tarifs sont affichés 
                  clairement avant l'achat. Les paiements sont non remboursables sauf disposition légale contraire.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propriété intellectuelle</h2>
                <p className="text-gray-700 mb-4">
                  Le contenu de la plateforme (logo, design, code) est protégé par le droit d'auteur. 
                  En publiant du contenu, vous accordez à Annonces Auto CI une licence d'utilisation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation de responsabilité</h2>
                <p className="text-gray-700 mb-4">
                  Annonces Auto CI n'est pas responsable de :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>L'exactitude des informations publiées par les utilisateurs</li>
                  <li>La qualité ou l'état des véhicules annoncés</li>
                  <li>Les litiges entre acheteurs et vendeurs</li>
                  <li>Les pertes ou dommages résultant de l'utilisation de la plateforme</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications des conditions</h2>
                <p className="text-gray-700 mb-4">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront 
                  informés des modifications importantes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
                <p className="text-gray-700 mb-4">
                  Pour toute question concernant ces conditions, contactez-nous :
                </p>
                <ul className="list-none text-gray-700 space-y-2">
                  <li>📧 Email : <a href="mailto:annonceautoci@gmail.com" className="text-primary-600 hover:underline">annonceautoci@gmail.com</a></li>
                  <li>📞 Téléphone : <a href="tel:+2250778030075" className="text-primary-600 hover:underline">+225 07 78 03 00 75</a></li>
                  <li>💬 WhatsApp : <a href="https://wa.me/2250778030075" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">+225 07 78 03 00 75</a></li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

