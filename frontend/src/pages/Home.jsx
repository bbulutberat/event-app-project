import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // --- KATILIMCI MODAL STATE ---
  const [participants, setParticipants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEventTitle, setCurrentEventTitle] = useState("");

  // --- DÜZENLEME MODAL STATE ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  
  // Düzenleme Formu Verileri
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLoc, setEditLoc] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // --- ETKİNLİKLERİM MODAL STATE (YENİ) ---
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [showMyRegModal, setShowMyRegModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Etkinlikler çekilemedi");
    }
  };

  const handleJoin = async (eventId) => {
    try {
      await api.post("/registrations", {
        user: { id: user.id },
        event: { id: eventId }
      });
      alert("Etkinliğe başarıyla kayıt oldunuz! 🎉");
    } catch (error) {
      alert("Kayıt başarısız veya zaten kayıtlısınız.");
    }
  };

  // --- SİLME FONKSİYONU ---
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Bu etkinliği silmek istediğinize emin misiniz? (Bu işlem geri alınamaz)")) {
      try {
        await api.delete(`/events/${eventId}`);
        alert("Etkinlik silindi.");
        fetchEvents();
      } catch (error) {
        alert("Silme işlemi başarısız oldu.");
      }
    }
  };

  const handleShowParticipants = async (event) => {
    try {
      const res = await api.get(`/registrations/event/${event.id}`);
      setParticipants(res.data);
      setCurrentEventTitle(event.title);
      setShowModal(true);
    } catch (error) {
      alert("Liste çekilemedi.");
    }
  };

  // --- DÜZENLEME PENCERESİNİ AÇMA ---
  const handleEditClick = (event) => {
    setEditEventId(event.id);
    setEditTitle(event.title);
    setEditDesc(event.description);
    // Tarih formatını HTML input'a (YYYY-MM-DD) uyumlu hale getir
    setEditDate(event.date ? event.date.toString().split('T')[0] : "");
    setEditLoc(event.location);
    setEditPrice(event.price);
    
    setShowEditModal(true); // Modalı aç
  };

  // --- GÜNCELLEMEYİ KAYDETME ---
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/events/${editEventId}`, {
        title: editTitle,
        description: editDesc,
        date: editDate,
        location: editLoc,
        price: Number(editPrice)
      });

      alert("Etkinlik Güncellendi! ✅");
      setShowEditModal(false); // Modalı kapat
      fetchEvents(); // Listeyi yenile ki değişiklik görünsün
    } catch (error) {
      alert("Güncelleme başarısız oldu.");
    }
  };

  // --- KULLANICININ KAYITLARINI ÇEK (YENİ) ---
  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get(`/registrations/user/${user.id}`);
      setMyRegistrations(res.data);
      setShowMyRegModal(true);
    } catch (error) {
      alert("Kayıtlarınız çekilemedi.");
    }
  };

  // --- KAYIT İPTAL ETME (YENİ) ---
  const handleCancelRegistration = async (regId) => {
    if (window.confirm("Bu etkinlik kaydını iptal etmek istediğine emin misin?")) {
      try {
        await api.delete(`/registrations/${regId}`);
        alert("Kayıt iptal edildi.");
        // Listeyi anlık güncellemek için tekrar çekiyoruz
        const res = await api.get(`/registrations/user/${user.id}`);
        setMyRegistrations(res.data);
      } catch (error) {
        alert("İptal işlemi başarısız.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">EventApp 🚀</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Hoşgeldin, {user.firstName} {user.lastName}</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded uppercase border border-gray-600">{user.role}</span>
          </div>
        </div>

        <div className="flex gap-4">
          {/* YENİ BUTON: Etkinliklerim */}
          <button 
            onClick={fetchMyRegistrations} 
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white font-bold transition"
          >
            📅 Etkinliklerim
          </button>

          {user.role === 'admin' && (
            <Link to="/admin" className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 text-white font-bold transition">
              ⚙️ Yönetici Paneli
            </Link>
          )}
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Etkinlik Listesi */}
      <h2 className="text-2xl font-bold mb-6">Güncel Etkinlikler</h2>
      
      {events.length === 0 ? (
        <div className="text-center py-10 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">Henüz yayınlanmış bir etkinlik yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500 transition flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded uppercase font-bold">
                    {event.category?.name || "Genel"}
                  </span>
                  <span className="text-green-400 font-bold text-lg">{event.price} ₺</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{event.description}</p>
                
                <div className="text-sm text-gray-500 mb-6 space-y-1 bg-gray-900 p-3 rounded">
                  <p>📅 {event.date ? new Date(event.date).toLocaleDateString('tr-TR') : event.date}</p>
                  <p>📍 {event.location}</p>
                </div>
              </div>

              {/* BUTONLAR */}
              <div className="p-4 bg-gray-900 flex gap-2">
                 <button 
                  onClick={() => handleJoin(event.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
                >
                  Etkinliğe Katıl
                </button>

                {/* SADECE ADMIN GÖRÜR */}
                {user.role === 'admin' && (
                  <>
                    <button 
                      onClick={() => handleShowParticipants(event)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition"
                      title="Katılımcıları Gör"
                    >
                      👥
                    </button>
                    {/* DÜZENLE BUTONU */}
                    <button 
                      onClick={() => handleEditClick(event)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded transition"
                      title="Düzenle"
                    >
                      ✏️
                    </button>
                    {/* SİL BUTONU */}
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition"
                      title="Etkinliği Sil"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- KATILIMCI MODAL (ADMİN İÇİN) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-600 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-purple-400 border-b border-gray-700 pb-2">
              {currentEventTitle} - Katılımcılar
            </h3>
            <div className="max-h-60 overflow-y-auto">
              {participants.length === 0 ? (
                <p className="text-gray-500 text-center">Henüz kimse kayıt olmamış.</p>
              ) : (
                <ul className="space-y-3">
                  {participants.map((reg, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                      <div>
                        <p className="font-bold text-white">{reg.user.firstName} {reg.user.lastName}</p>
                        <p className="text-xs text-gray-400">{reg.user.email}</p>
                      </div>
                      <span className="text-green-400 text-sm">{reg.user.phoneNumber}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ETKİNLİKLERİM MODALI (HERKES İÇİN - YENİ) --- */}
      {showMyRegModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl border border-blue-500 relative shadow-2xl">
            <button 
              onClick={() => setShowMyRegModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">
              📅 Katıldığım Etkinlikler
            </h3>
            
            <div className="max-h-80 overflow-y-auto">
              {myRegistrations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Henüz bir etkinliğe kayıt olmadınız.</p>
              ) : (
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                    <tr>
                      <th className="p-3">Etkinlik</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Etkinlik Tarihi</th>
                      <th className="p-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRegistrations.map((reg) => (
                      <tr key={reg.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                        <td className="p-3 font-bold text-white">{reg.event.title}</td>
                        <td className="p-3">
                            <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs uppercase font-bold">
                                {reg.event.category?.name || "-"}
                            </span>
                        </td>
                        <td className="p-3">{new Date(reg.event.date).toLocaleDateString('tr-TR')}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleCancelRegistration(reg.id)}
                            className="text-red-400 hover:text-red-200 hover:underline bg-red-900/20 px-3 py-1 rounded border border-red-900/50"
                          >
                            İptal Et ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- DÜZENLEME MODALI (ADMİN İÇİN) --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-yellow-500 relative shadow-2xl shadow-yellow-900/50">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
              ✏️ Etkinliği Düzenle
            </h3>
            
            <form onSubmit={handleUpdateEvent} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Başlık</label>
                <input className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Açıklama</label>
                <textarea className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-20" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="text-xs text-gray-400">Tarih</label>
                  <input type="date" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                </div>
                <div className="w-1/2">
                  <label className="text-xs text-gray-400">Fiyat</label>
                  <input type="number" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" value={editPrice} onChange={e => setEditPrice(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Konum</label>
                <input className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" value={editLoc} onChange={e => setEditLoc(e.target.value)} required />
              </div>

              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 rounded mt-2 transition">
                Değişiklikleri Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;