import { auth, db } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { collection, query, where, getDocs} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import back from './back.jpg';

function Login() {
  const navigate = useNavigate(); 
  //const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
   
    try{
      
      const q = query(collection(db, "users"), where("studentCode", "==", studentCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Student code not found");
        return;
      }

      const userData = querySnapshot.docs[0].data();
       const email = userData.email;
      const userSignIn = await signInWithEmailAndPassword(auth, email, password);

      if (userData.role == "admin") {
        navigate("/admin");
      } else if (userData.role == "student") {
        navigate("/student");
      } else {
        setError("Unknown role");
      }
    }catch(error){
        setError(error.message);
    }
  };

  return (
     
    <div style={{ padding: "280px", textAlign: "center", maxWidth: "1100px", margin: "auto",backgroundImage: `url(${back})`,backgroundSize: "cover" }}>
      
      <h2 >logIn</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input 
          type="text" 
          placeholder="id" 
          style={{ width: '35%', padding: '10px', marginBottom: '10px' }}
          onChange={(e) => setStudentCode(e.target.value)} 
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