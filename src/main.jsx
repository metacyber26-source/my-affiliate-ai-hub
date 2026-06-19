import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from '@google/generative-ai';

function App() {
  const [productName, setProductName] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Fungsi untuk memanggil AI langsung dari browser HP Anda
  const generateContent = async () => {
    if (!productName) return alert('Masukkan nama/link produk terlebih dahulu!');
    setLoading(true);
    setResult('');

    try {
      // Mengambil API Key yang nanti aman disimpan di Environment Variables Vercel
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key Gemini belum diatur di Vercel!");
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Kamu adalah ahli digital marketing dan affiliate top. Buatkan copywriting yang sangat persuasif, viral, dan menghasilkan konversi penjualan tinggi untuk produk "${productName}" khusus untuk platform ${platform}. Berikan hook 3 detik pertama yang mematikan, isi yang bikin penasaran, dan Call to Action (CTA) yang kuat agar penonton mengklik link afiliasi di bio. Tambahkan juga rekomendasi hashtag tren.`;

      const response = await model.generateContent(prompt);
      setResult(response.response.text());
    } catch (error) {
      console.error(error);
      setResult(`Gagal membuat konten: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen p-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Header */}
      <header class="py-4 border-b border-slate-800 text-center">
        <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          🚀 AffiliX AI Hub
        </h1>
        <p class="text-xs text-slate-400 mt-1">Asisten Afiliasi Privat Mandiri</p>
      </header>

      {/* Main Form */}
      <main class="flex-1 my-6 space-y-5">
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Nama / Link Produk
          </label>
          <input
            type="text"
            placeholder="Contoh: Kemeja Oversize Pria Linen"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Target Platform Afiliasi
          </label>
          <div class="grid grid-cols-2 gap-2">
            {['TikTok', 'Shopee Video', 'Lazada', 'Tokopedia'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                class={`py-2.5 px-4 text-xs font-medium rounded-xl border transition-all ${
                  platform === p
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateContent}
          disabled={loading}
          class="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Sedang Memikirkan Konten...' : '✨ Tembak Traffic Konten'}
        </button>

        {/* Output Area */}
        {result && (
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div class="flex justify-between items-center border-b border-slate-700 pb-2">
              <span class="text-xs font-bold text-indigo-400">Hasil Copywriting AI:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert('Konten berhasil disalin!');
                }}
                class="text-[11px] bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded-md transition-all"
              >
                Salin Teks
              </button>
            </div>
            <p class="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap selection:bg-indigo-500">
              {result}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer class="text-center py-2 text-[10px] text-slate-500 border-t border-slate-800/50">
        AffiliX AI • Di-host via Vercel HP
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
