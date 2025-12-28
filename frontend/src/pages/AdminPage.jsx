import { Link, useNavigate } from "react-router-dom";
import AdminPanel from "../components/AdminPanel"; // Bileşenimizi buraya çağırdık

function AdminPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Güvenlik Önlemi: Eğer admin değilse bu sayfaya girmesin, ana sayfaya atılsın
  if (!user || user.role !== 'admin') {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      {/* Üst Kısım: Geri Dön Butonu */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-600 pb-4">
        <h1 className="text-3xl font-bold text-yellow-500">Yönetici Paneli 🛠️</h1>
        <Link to="/" className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition">
          ⬅️ Ana Sayfaya Dön
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <p className="mb-4 text-gray-400">Buradan sisteme yeni kategoriler ve etkinlikler ekleyebilirsin.</p>
        
        {/* Admin Paneli Bileşenini Buraya Koyduk */}
        <AdminPanel onEventAdded={() => alert("İçerik Eklendi! Ana sayfada görünecek.")} />
      </div>
    </div>
  );
}

export default AdminPage;