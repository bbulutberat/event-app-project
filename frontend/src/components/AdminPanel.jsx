import { useState, useEffect } from "react";
import api from "../api";

function AdminPanel({ onEventAdded }) {
  // Kategori Ekleme State'leri
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Etkinlik Ekleme State'leri
  const [categories, setCategories] = useState([]); // Kategorileri listelemek için
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [loc, setLoc] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  // Sayfa açılınca mevcut kategorileri çek (Dropdown için)
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  // Kategori Kaydetme
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name: catName, description: catDesc });
      alert("Kategori Eklendi!");
      setCatName(""); setCatDesc("");
      fetchCategories(); // Listeyi güncelle
    } catch (error) {
      alert("Hata oluştu!");
    }
  };

  // Etkinlik Kaydetme
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if(!selectedCat) return alert("Lütfen bir kategori seçin!");
    
    try {
      await api.post("/events", {
        title,
        description: desc,
        date,
        location: loc,
        price: Number(price),
        category: { id: selectedCat } // İlişkiyi burada kuruyoruz
      });
      alert("Etkinlik Başarıyla Eklendi!");
      // Formu temizle
      setTitle(""); setDesc(""); setDate(""); setLoc(""); setPrice("");
      // Ana sayfadaki listeyi güncellemesi için üstteki fonksiyonu tetikle
      if(onEventAdded) onEventAdded();
    } catch (error) {
      alert("Etkinlik eklenirken hata oluştu.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Admin Paneli (Veri Girişi)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kategori Ekleme Formu */}
        <form onSubmit={handleAddCategory} className="bg-gray-700 p-4 rounded">
          <h3 className="text-xl font-bold mb-2 text-blue-400">1. Kategori Ekle</h3>
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Kategori Adı (Örn: Konser)" value={catName} onChange={e => setCatName(e.target.value)} required />
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Açıklama" value={catDesc} onChange={e => setCatDesc(e.target.value)} />
          <button className="bg-blue-600 px-4 py-2 rounded text-white w-full hover:bg-blue-700">Kategori Ekle</button>
        </form>

        {/* Etkinlik Ekleme Formu */}
        <form onSubmit={handleAddEvent} className="bg-gray-700 p-4 rounded">
          <h3 className="text-xl font-bold mb-2 text-green-400">2. Etkinlik Ekle</h3>
          
          <select className="w-full p-2 mb-2 rounded text-black" value={selectedCat} onChange={e => setSelectedCat(e.target.value)} required>
            <option value="">Kategori Seçiniz...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Etkinlik Başlığı" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Açıklama" value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="flex gap-2">
             <input type="date" className="w-1/2 p-2 mb-2 rounded text-black" value={date} onChange={e => setDate(e.target.value)} required />
             <input type="number" className="w-1/2 p-2 mb-2 rounded text-black" placeholder="Fiyat" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <input className="w-full p-2 mb-2 rounded text-black" placeholder="Konum (Mekan)" value={loc} onChange={e => setLoc(e.target.value)} required />
          
          <button className="bg-green-600 px-4 py-2 rounded text-white w-full hover:bg-green-700">Etkinlik Ekle</button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;