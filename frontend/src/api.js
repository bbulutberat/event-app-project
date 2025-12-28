import axios from "axios";

const api = axios.create({
  // ESKİSİ: baseURL: "http://localhost:3000",
  
  // YENİSİ: Render'dan kopyaladığın adresi buraya yapıştır.
  // (Sonunda taksim işareti / olmasın)
  baseURL: "https://event-app-project-jy0n.onrender.com",
});

// Token ekleme kısmı aynen kalsın
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) { // Eğer token varsa (login olduysa)
     // Burası önemli: Backend'e "Benim kimliğim bu" diyoruz.
     // Backend'de JWT auth eklemedik ama ileride eklersek hazır olsun.
     config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;