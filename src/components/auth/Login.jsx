import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveUser } from '../../utils/storage';
import { useToast } from '../shared/ToastProvider';
import { Leaf } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAuth = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const bodyPayload = isLogin ? { email, password } : { email, password, name, role };
      
      const response = await fetch(`https://ayursutra-panchakarma-f8cg.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (response.ok) {
        const user = await response.json();
        saveUser(user);
        showToast(isLogin ? `Welcome back, ${user.name}!` : `Account created! Welcome, ${user.name}!`, 'success');
        navigate(`/${user.role}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.error || (isLogin ? 'Invalid credentials' : 'Error creating account'), 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error connecting to backend', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ayur-light to-ayur-beige">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ayur-primary rounded-full mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-ayur-dark mb-2">AyurSutra Panchakarma</h1>
          <p className="text-gray-600">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="therapist">Doctor / Therapist</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full bg-ayur-primary text-white py-3 rounded-lg hover:bg-ayur-dark transition">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-ayur-primary hover:underline font-medium"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>


      </div>
    </div>
  );
};

export default Login;
