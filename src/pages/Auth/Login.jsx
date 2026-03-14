import React, { useState } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='Santé App' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px d-block'>
              <div className="w-60-px h-60-px bg-primary-600 rounded-circle d-flex justify-content-center align-items-center mb-16">
                <Icon icon="solar:health-bold" className="text-white text-3xl" />
              </div>
            </Link>
            <h4 className='mb-12'>Connexion à votre compte</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Bon retour ! Veuillez entrer votre email
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
              <input
                type='email'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-8 px-16 mb-24 radius-8 border-0 mt-3">
                <Icon icon="material-symbols:error-outline" className="text-xl" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                "Se connecter"
              )}
            </button>

            <div className='mt-32 text-center text-sm'>
              <p className='mb-0'>
                Vous n'avez pas de compte ?{" "}
                <Link to='/register' className='text-primary-600 fw-semibold'>
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
