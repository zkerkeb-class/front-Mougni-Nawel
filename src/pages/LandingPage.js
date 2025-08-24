import React, { useEffect } from 'react';
import {
  FiZap,
  FiTarget,
  FiFileText,
  FiLock,
  FiHelpCircle,
  FiLayout,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiMail,
  FiPhone,
  FiBook
} from 'react-icons/fi';
import { FaRegGem, FaRegLightbulb } from 'react-icons/fa';
import { GiJusticeStar } from 'react-icons/gi';
import { FaBalanceScale } from 'react-icons/fa';


const LandingPage = () => {

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    textDecoration: 'none',
    color: '#4b5563',
    fontWeight: 500,
    transition: 'color 0.2s ease'
  };

  const buttonStyle = {
    background: '#111827',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  };
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .pricing-card').forEach(el => {
      observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });



    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <div className="min-h-screen">
      <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f9fafb;
        }

        /* Logo Thémis stylisé */
        .themis-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111827;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }


        /* Typographie */
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .brand-subtitle {
          font-family: 'Inter', sans-serif;
          font-style: normal;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Header */
        header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.95);
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          color: #6b7280;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-links a:hover {
          color: #111827;
        }

        .login-btn {
          background: #111827;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .login-btn:hover {
          background: #374151;
          transform: translateY(-1px);
        }

        /* Hero Section */
        .hero {
          padding: 6rem 0 4rem;
          text-align: center;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .hero h1 {
          font-size: 3rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-primary {
          background: #111827;
          color: white;
        }

        .btn-primary:hover {
          background: #374151;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          color: #111827;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .stat {
          text-align: center;
          padding: 1.5rem;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 600;
          color: #111827;
          display: block;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        /* Features Section */
        .features {
          padding: 6rem 0;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
          position: relative;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        .feature-icon {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #e6e6e6 0%, #c2c2c2 100%);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: white;
          border: 1px solid #d1d5db;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .feature-icon svg {
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
        }

        /* Pour la carte featured dans pricing */
        .pricing-card.featured .feature-icon {
          background: linear-gradient(135deg, #4b5563 0%, #1f2937 100%);
          border-color: #374151;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Pricing Section */
        .pricing {
          padding: 6rem 0;
          background: #f9fafb;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .pricing-card {
          background: white;
          padding: 2.5rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          text-align: center;
          position: relative;
          transition: all 0.2s ease;
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .pricing-card.featured {
          border-color: #111827;
          border-width: 2px;
          background: linear-gradient(135deg, #111827 0%, #374151 100%);
          color: white;
        }

        .pricing-card.featured::before {
          content: 'POPULAIRE';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .plan-name {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .plan-price {
          font-size: 3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .plan-period {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .pricing-card.featured .plan-period {
          color: #d1d5db;
        }

        .plan-features {
          list-style: none;
          margin-bottom: 2rem;
          text-align: left;
        }

        .plan-features li {
          padding: 0.5rem 0;
          position: relative;
          padding-left: 2rem;
        }

        .plan-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 600;
        }

        .pricing-card.featured .plan-features li::before {
          color: #9ca3af;
        }

        .btn-full {
          width: 100%;
        }

        /* Disclaimer */
        .disclaimer {
          margin-top: 3rem;
          padding: 2rem;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          text-align: center;
        }

        .disclaimer-title {
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .disclaimer-text {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Footer */
        footer {
          background: #111827;
          color: white;
          padding: 3rem 0;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          margin-bottom: 1rem;
          color: #f9fafb;
          font-weight: 600;
        }

        .footer-section p, .footer-section a {
          color: #9ca3af;
          text-decoration: none;
          margin-bottom: 0.5rem;
          display: block;
        }

        .footer-section a:hover {
          color: #f9fafb;
        }

        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 2rem;
          text-align: center;
          color: #9ca3af;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero-cta {
            flex-direction: column;
          }
          
          .nav-links {
            display: none;
          }
          
          .hero-stats {
            grid-template-columns: 1fr;
          }
          
          .container {
            padding: 0 0.5rem;
          }
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-on-scroll {
          animation: fadeInUp 0.6s ease-out;
        }
          /* Thèmes colorés pour les icônes de fonctionnalités */
/* Fond neutre pour toutes les icônes */
.feature-icon {
  background: #f3f4f6; /* Gris clair neutre */
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

/* Couleurs de texte (icônes SVG) spécifiques */
.feature-icon--speed svg {
  color: #6366f1; /* Bleu lavande */
}

.feature-icon--focus svg {
  color: #facc15; /* Jaune doré */
}

.feature-icon--report svg {
  color: #10b981; /* Vert menthe */
}

.feature-icon--secure svg {
  color: #ef4444; /* Rouge sécurité */
}

.feature-icon--lightbulb svg {
  color: #f59e0b; /* Jaune idée */
}

.feature-icon--layout svg {
  color: #6b7280; /* Gris UI */
}

/* Animation au hover */
.feature-icon:hover svg {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}


      `}</style>

      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '1.25rem 0',
      }}>
        <nav className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            <div className="themis-icon">
              <FaBalanceScale size={24} color="white" />
            </div>



            <div>
              <div className="brand-name" style={{
                fontSize: '1.5rem',
                color: '#111827',
              }}>ContractAI</div>
              <div className="brand-subtitle" style={{
                fontSize: '0.75rem',
                color: '#6b7280',
              }}>L'IA au service du droit</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{
              textDecoration: 'none',
              color: '#4b5563',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
            }}>
              <FiFileText style={{ marginRight: '8px', fontSize: '18px' }} />
              Fonctionnalités
            </a>
          </nav>
        </nav>
      </header>



      <section className="hero">
        <div className="container">
          <h1>Analysez vos contrats<br />en 30 secondes</h1>
          <p className="hero-subtitle">
            Notre IA examine vos documents juridiques et vous fournit une analyse claire et détaillée.
            Gagnez du temps sur votre consultation professionnelle.
          </p>

          <div className="hero-cta">
            <a href="/login" className="btn btn-primary">Commencer gratuitement</a>
            <a href="#" className="btn btn-secondary">Voir la démo</a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">30s</span>
              <span className="stat-label">Temps d'analyse</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Précision</span>
            </div>
            <div className="stat">
              <span className="stat-number">1h</span>
              <span className="stat-label">Temps économisé</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Pourquoi choisir ContractAI ?</h2>
            <p className="section-subtitle">
              Un outil de consultation rapide qui complète l'expertise professionnelle
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon--speed"><FiZap size={20} /></div>
              <h3>Analyse Ultra-Rapide</h3>
              <p>Obtenez une première analyse complète de votre contrat en moins de 30 secondes, là où une consultation traditionnelle prendrait 1 heure.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--focus"><FiTarget size={20} /></div>
              <h3>Points Clés Identifiés</h3>
              <p>Notre IA détecte automatiquement les clauses importantes, les risques potentiels et les points d'attention à retenir.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--report"><FiFileText size={20} /></div>
              <h3>Rapport Détaillé</h3>
              <p>Recevez un rapport structuré avec les éléments essentiels, parfait pour préparer votre consultation avec un professionnel.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--secure"><FiLock size={20} /></div>
              <h3>Sécurité Garantie</h3>
              <p>Vos documents sont traités de manière sécurisée et confidentielle. Aucune donnée n'est conservée après analyse.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--lightbulb"><FaRegLightbulb size={20} /></div>
              <h3>Consultation Préparatoire</h3>
              <p>Optimisez votre temps avec votre avocat en arrivant avec une première analyse et les bonnes questions à poser.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--layout"><FiLayout size={20} /></div>
              <h3>Interface Intuitive</h3>
              <p>Uploadez simplement votre contrat et recevez une analyse claire, même sans connaissances juridiques approfondies.</p>
            </div>

          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choisissez votre formule</h2>
            <p className="section-subtitle">
              Commencez gratuitement ou optez pour un accès illimité
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <h3 className="plan-name">Gratuit</h3>
              <div className="plan-price">0€</div>
              <div className="plan-period">Pour découvrir</div>
              <ul className="plan-features">
                <li>3 analyses gratuites</li>
                <li>Rapport de base</li>
                <li>Points clés identifiés</li>
                <li>Sécurité garantie</li>
                <li>Support par email</li>
              </ul>
              <a href="#" className="btn btn-secondary btn-full">Commencer gratuitement</a>
            </div>

            <div className="pricing-card featured">
              <h3 className="plan-name">Premium</h3>
              <div className="plan-price">19€</div>
              <div className="plan-period">par mois</div>
              <ul className="plan-features">
                <li>Analyses illimitées</li>
                <li>Rapport détaillé avancé</li>
                <li>Historique des analyses</li>
                <li>Comparaison de contrats</li>
                <li>Alertes personnalisées</li>
                <li>Support prioritaire</li>
                <li>Export PDF/Word</li>
              </ul>
              <a href="#" className="btn btn-primary btn-full">Passer à Premium</a>
            </div>
          </div>

          <div className="disclaimer">
            <div className="disclaimer-title">Important : ContractAI est un outil de consultation préparatoire</div>
            <div className="disclaimer-text">
              Nos analyses ne remplacent pas les conseils d'un professionnel du droit.
              Elles vous permettent de gagner du temps et d'optimiser votre consultation avec votre avocat ou notaire.
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>ContractAI</h3>
              <p>L'analyse de contrats par IA pour optimiser votre consultation juridique.</p>
            </div>

            <div className="footer-section">
              <h3>Contact</h3>
              <a href="mailto:contact@contractai.fr"><FiMail style={{ marginRight: '8px' }} /> contact@contractai.fr</a>
              <a href="tel:+33123456789"><FiPhone style={{ marginRight: '8px' }} /> +33 1 23 45 67 89</a>
            </div>

            <div className="footer-section">
              <h3>Légal</h3>
              <a href="#"><FiBook style={{ marginRight: '8px' }} /> Mentions légales</a>
              <a href="#"><FiCheckCircle style={{ marginRight: '8px' }} /> Politique de confidentialité</a>
              <a href="#"><FiFileText style={{ marginRight: '8px' }} /> CGU</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 ContractAI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;