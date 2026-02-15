import { useState } from 'react';
import { Icon } from "@iconify/react";

const API_URL = 'http://localhost:3001';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('user_email', user.email);
        onLogin(user);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setError('Impossible de contacter le serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="card shadow border-0 radius-12" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-40">
          <div className="text-center mb-32">
            <div className="w-60-px h-60-px bg-primary-600 rounded-circle d-flex justify-content-center align-items-center mx-auto mb-16">
              <Icon icon="solar:user-bold" className="text-white text-3xl" />
            </div>
            <h4 className="mb-8">Connexion</h4>
            <p className="text-secondary-light">Entrez votre email pour accéder à vos données de santé</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-24">
              <label className="form-label text-secondary-light fw-medium mb-8">Adresse Email</label>
              <div className="position-relative">
                <input
                  type="email"
                  className="form-control h-48-px ps-40"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="position-absolute start-0 top-50 translate-middle-y ms-16 text-secondary-light">
                  <Icon icon="mdi:email-outline" />
                </span>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-8 px-16 mb-24 radius-8 border-0">
                <Icon icon="material-symbols:error-outline" className="text-xl" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary-600 w-100 h-48-px d-flex justify-content-center align-items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  Se connecter
                  <Icon icon="solar:arrow-right-bold" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
