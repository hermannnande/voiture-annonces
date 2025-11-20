import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="card p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Politique de Confidentialité
            </h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-sm text-gray-600 mb-6">
                Dernière mise à jour : 20 novembre 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Annonces Auto CI s'engage à protéger la confidentialité de vos données personnelles. 
                  Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>
                <p className="text-gray-700 mb-4">Nous collectons les données suivantes :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Informations d'inscription :</strong> nom, prénom, email, téléphone</li>
                  <li><strong>Informations de profil :</strong> photo, description</li>
                  <li><strong>Annonces :</strong> photos et descriptions de véhicules, prix, localisation</li>
                  <li><strong>Messages :</strong> conversations entre utilisateurs</li>
                  <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
                  <li><strong>Données de paiement :</strong> informations de transaction (via prestataires sécurisés)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des données</h2>
                <p className="text-gray-700 mb-4">Vos données sont utilisées pour :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Créer et gérer votre compte</li>
                  <li>Publier et gérer vos annonces</li>
                  <li>Faciliter la communication entre acheteurs et vendeurs</li>
                  <li>Traiter les paiements des services premium</li>
                  <li>Améliorer nos services et votre expérience utilisateur</li>
                  <li>Vous envoyer des notifications importantes</li>
                  <li>Prévenir la fraude et assurer la sécurité</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des données</h2>
                <p className="text-gray-700 mb-4">
                  Nous ne vendons jamais vos données personnelles. Vos informations peuvent être partagées :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Avec d'autres utilisateurs :</strong> informations de contact dans les annonces</li>
                  <li><strong>Prestataires de services :</strong> hébergement, paiement, analyses</li>
                  <li><strong>Autorités légales :</strong> si requis par la loi</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité des données</h2>
                <p className="text-gray-700 mb-4">
                  Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Chiffrement des mots de passe</li>
                  <li>Connexions sécurisées (HTTPS)</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Surveillance et audits de sécurité réguliers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience. Les cookies sont de petits fichiers 
                  stockés sur votre appareil qui nous aident à :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Maintenir votre session de connexion</li>
                  <li>Mémoriser vos préférences</li>
                  <li>Analyser l'utilisation du site</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais cela peut 
                  affecter certaines fonctionnalités.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits</h2>
                <p className="text-gray-700 mb-4">Vous avez le droit de :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Accéder</strong> à vos données personnelles</li>
                  <li><strong>Rectifier</strong> vos données inexactes</li>
                  <li><strong>Supprimer</strong> votre compte et vos données</li>
                  <li><strong>Limiter</strong> le traitement de vos données</li>
                  <li><strong>Porter</strong> vos données vers un autre service</li>
                  <li><strong>Vous opposer</strong> au traitement de vos données</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  Pour exercer ces droits, contactez-nous à <a href="mailto:annonceautoci@gmail.com" className="text-primary-600 hover:underline">annonceautoci@gmail.com</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conservation des données</h2>
                <p className="text-gray-700 mb-4">
                  Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services et respecter 
                  nos obligations légales. Après suppression de votre compte, certaines données peuvent être conservées 
                  pour des raisons légales ou de sécurité.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Utilisateurs mineurs</h2>
                <p className="text-gray-700 mb-4">
                  Notre service est réservé aux personnes âgées de 18 ans et plus. Nous ne collectons pas 
                  sciemment de données de mineurs.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Transferts internationaux</h2>
                <p className="text-gray-700 mb-4">
                  Vos données peuvent être transférées et stockées sur des serveurs situés hors de Côte d'Ivoire. 
                  Nous veillons à ce que ces transferts respectent les normes de protection des données.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications de la politique</h2>
                <p className="text-gray-700 mb-4">
                  Nous pouvons modifier cette politique de confidentialité. Les modifications importantes seront 
                  communiquées par email ou notification sur le site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
                <p className="text-gray-700 mb-4">
                  Pour toute question concernant cette politique ou vos données personnelles :
                </p>
                <ul className="list-none text-gray-700 space-y-2">
                  <li>📧 Email : <a href="mailto:annonceautoci@gmail.com" className="text-primary-600 hover:underline">annonceautoci@gmail.com</a></li>
                  <li>📞 Téléphone : <a href="tel:+2250778030075" className="text-primary-600 hover:underline">+225 07 78 03 00 75</a></li>
                  <li>💬 WhatsApp : <a href="https://wa.me/2250778030075" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">+225 07 78 03 00 75</a></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Conformité légale</h2>
                <p className="text-gray-700 mb-4">
                  Cette politique est conforme aux lois en vigueur en Côte d'Ivoire concernant la protection 
                  des données personnelles.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

