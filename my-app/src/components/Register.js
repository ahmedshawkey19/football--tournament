import { auth, db } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link,useNavigate } from 'react-router-dom';

function Register() {
   const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [error,setError] =useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
    setError("Please enter your full name.");
    return;
  }
  const universityDomain = ".edu.eg"; 
  if (!email.includes(universityDomain)) {
    setError("Access denied. You must use a university email");
    return;
  }
    if (password !== confirmPassword) {
    setError("Passwords do not match! Please check again.");
    return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        studentCode: studentCode,
        email: email,
        role: "student" 
      });
      navigate('/Login')
      alert("تم التسجيل بنجاح!");
    } catch (error) {
        if(error.code==='auth/invalid-email'){
          setError("Please enter a valid email address.");
        }else if(error.code==='auth/email-already-in-use'){
          setError("This email isalready in use.");
        }else{
          setError("Something went wrong. try agin.")
        }
    }
  };

  return (
    <div>
     <h2>Create Account</h2>
    <form onSubmit={handleRegister}>
      <input type="text" placeholder=" Full Name" onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder=" ID" onChange={(e) => setStudentCode(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password " onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password"  onChange={(e)=>setConfirmPassword(e.target.value)}/>
      {error && (
        <p style={{ 
          color: '#ff4d4d', 
          fontSize: '13px', 
          marginBottom: '10px',
          textAlign: 'center',
          fontWeight: 'bold' 
        }}>
      {error}
    </p>
    )}
      <button type="submit">Sign Up</button>
    </form>
    <Link to="/login">
        Already have an account? Sign In
      </Link>
    </div>
  );
}

export default Register;