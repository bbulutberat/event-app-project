import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basit doğrulama: Telefon başında 0 varsa uyar
    if (phone.startsWith("0")) {
      alert("Lütfen telefon numarasını başında '0' olmadan giriniz. (Örn: 532...)");
      return;
    }

    try {
      await api.post("/users", { 
        firstName, 
        lastName, 
        phoneNumber: phone, 
        email, 
        password, 
        role: "user" 
      });
      alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      alert("Kayıt sırasında hata oluştu. (Mail veya telefon kullanılıyor olabilir)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-500">Kayıt Ol</h2>
        <form onSubmit={handleRegister} className="space-y-3">
          
          <div className="flex gap-2">
            <input 
              className="w-1/2 p-2 rounded bg-gray-700 border border-gray-600" 
              placeholder="Ad" 
              value={firstName} onChange={e => setFirstName(e.target.value)} required 
            />
            <input 
              className="w-1/2 p-2 rounded bg-gray-700 border border-gray-600" 
              placeholder="Soyad" 
              value={lastName} onChange={e => setLastName(e.target.value)} required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefon (Başında 0 olmadan)</label>
            <input
              type="text"
              placeholder="5XX1234567"
              maxLength="10"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Sadece rakam girilmesine izin ver
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-Posta</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
          >
            Kayıt Ol
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-400">
          Zaten hesabın var mı? <Link to="/login" className="text-blue-400 hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;