import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
 
function Register({ onRegister }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [incomePerAnnum, setIncomePerAnnum] = useState("");
  const [idProofFile, setIdProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
 
    // Validation
    if (!firstName) {
      setError("First name is required.");
      setLoading(false);
      return;
    }
 
    if (firstName.length < 2) {
      setError("First name must be at least 2 characters long.");
      setLoading(false);
      return;
    }
 
    if (!/^[A-Za-z]+$/.test(firstName)) {
      setError("First name must contain only alphabets");
      setLoading(false);
      return;
    }
 
    if (!lastName) {
      setError("Last name is required.");
      setLoading(false);
      return;
    }
 
    if (lastName.length < 2) {
      setError("Last name must be at least 2 characters long.");
      setLoading(false);
      return;
    }
 
    if (!/^[A-Za-z]+$/.test(lastName)) {
      setError("Last name must contain only alphabets");
      setLoading(false);
      return;
    }
 
    if (!username || username.length < 3 || username.length > 20) {
      setError("Username must be 3-20 characters long");
      setLoading(false);
      return;
    }
 
    if (
      !password ||
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[@$!%*?&]/.test(password)
    ) {
      setError(
        "Password must have 8 characters and include uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }
 
    const domainRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]{2,}@gmail\.com$/;
    if (!domainRegex.test(email)) {
      setError("Enter a valid email address");
      setLoading(false);
      return;
    }
 
    try {
      const userData = {
        firstName,
        lastName,
        username,
        password,
        email,
        role,
        incomePerAnnum: incomePerAnnum ? parseFloat(incomePerAnnum) : null,
      };
 
      const result = await registerUser(userData, idProofFile);
      setSuccess(result.message);
 
      // Navigate to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <form className="register-form" onSubmit={handleRegister}>
      <h2>Register</h2>
 
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="success-message"
          style={{ color: "green", marginBottom: "10px" }}
        >
          {success}
        </div>
      )}
 
      <input
        type="text"
        placeholder="First Name (2-50 characters)"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        // minLength={2}
        // maxLength={50}
      />
 
      <input
        type="text"
        placeholder="Last Name (2-50 characters)"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        // minLength={2}
        // maxLength={50}
      />
 
      <input
        type="text"
        placeholder="Username (3-20 characters)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        minLength={3}
        maxLength={20}
      />
 
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
 
      <input
        type="password"
        placeholder="Password (6-40 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        maxLength={20}
      />
 
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select>
 
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
 
      <p
        className="login-link"
        style={{ marginTop: "15px", textAlign: "center" }}
      >
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Login here
        </span>
      </p>
    </form>
  );
}
 
export default Register;