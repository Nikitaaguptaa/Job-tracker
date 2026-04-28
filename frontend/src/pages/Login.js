import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(formData);
      loginUser(data.user, data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}> Job Tracker</h2>
        <p style={styles.subtitle}>Login to continue</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  title: {
    fontSize: '26px',
    marginBottom: '5px',
    color: '#333'
  },
  subtitle: {
    color: '#777',
    marginBottom: '25px',
    fontSize: '14px'
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  eye: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea, #5a67d8)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s'
  },
  link: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#666'
  }
};

export default Login;
