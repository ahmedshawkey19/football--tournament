import { auth, db } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import back from './back.jpg';

function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const handleLogin = async () => {
    
   
    try{
        await signInWithEmailAndPassword(auth , email ,password);
        alert("succes");
    }catch(error){
        alert(error.message);
    }
    

  };

  return (
     
    <div style={{ padding: "280px", textAlign: "center", maxWidth: "1100px", margin: "auto",backgroundImage: `url(${back})`,backgroundSize: "cover" }}>
      
      <h2 >logIn</h2>
      <form onSubmit={handleLogin} >
        <input 
          type="email" 
          placeholder="Email" 
          style={{ width: '35%', padding: '10px', marginBottom: '10px' }}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ width: '35%', padding: '10px', marginBottom: '10px' }}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        {error && <p style={{ color: '#ff4d4d', fontSize: '13px' }}>{error}</p>}
        
        <button type="submit" style={{ padding: '10px 30px',color:'#000000', cursor: 'pointer',background:'#0ebc70' }}>Login</button>
      </form>
      <br />
      <Link to="/register">Don't have an account? Create one</Link>
    </div>
  );
}

export default Login;