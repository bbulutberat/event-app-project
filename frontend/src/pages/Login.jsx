import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [identifier, setIdentifier] = useState(""); // Artık 'email' değil 'identifier'
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend'e 'identifier' (mail veya telefon) gönderiyoruz
      const response = await api.post("/users/login", { identifier, password });
      
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert(`Hoşgeldin, ${response.data.user.firstName}!`); // İsmiyle hitap edelim
        navigate("/");
      } else {
        alert("Hatalı bilgiler!");
      }
    } catch (error) {
      alert("Bir hata oluştu. Lütfen bilgileri kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Giriş Yap</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-Posta veya Telefon</label>
            <input
              type="text"
              placeholder="mail@site.com veya 5XX..."
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          >
            Giriş Yap
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-400">
          Hesabın yok mu? <Link to="/register" className="text-blue-400 hover:underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;