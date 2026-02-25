import { auth, db } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        if (userData.role === "admin") {
          navigate('/admin-dashboard'); 
        } else {
          navigate('/dashboard'); 
        }
      } else {
        setError("User data not found in database.");
      }

    } catch (err) {
      console.error(err.code); 
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email format.");
      } else {
        setError("Login failed. Please try again.");
      } 
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", maxWidth: "400px", margin: "auto" }}>
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        {error && <p style={{ color: '#ff4d4d', fontSize: '13px' }}>{error}</p>}
        
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
      </form>
      <br />
      <Link to="/register">Don't have an account? Create one</Link>
    </div>
  );
}

export default Login;