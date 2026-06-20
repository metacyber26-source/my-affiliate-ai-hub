import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [productName, setProductName] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem('affilix_last_result');
    if (savedResult) setResult(savedResult);
  }, []);

  const generateContent = async () => {
    if (!productName.trim()) return alert('Masukkan nama atau link produk dulu!');
    setLoading(true);
    setResult('');
    setCopied(false);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key Gemini belum diatur di Vercel!");

      const ai = new GoogleGenerativeAI(apiKey);
      
      // Perbaikan: Menambahkan apiVersion 'v1beta' agar model gemini-1.5-flash bisa ditemukan
      const model = ai.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        apiVersion: 'v1beta'
      });

      const prompt = `Kamu adalah ahli digital marketing dan affiliate top. Buatkan copywriting yang sangat persuasif, viral, dan menghasilkan konversi penjualan tinggi untuk produk "${productName}" khusus untuk platform ${platform}. Berikan hook 3 detik pertama yang mematikan, isi yang bikin penasaran, dan Call to Action (CTA) yang kuat agar penonton mengklik link afiliasi di bio. Tambahkan juga beberapa rekomendasi hashtag tren.`;

      const response = await model.generateContent(prompt);
      const textResult = response.response.text();
      
      setResult(textResult);
      localStorage.setItem('affilix_last_result', textResult);
    } catch (error) {
      setResult(`Gagal membuat konten: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto flex flex-col justify-between select-none">
      <header className="py-4 border-b border-slate-800 text-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          🚀 AffiliX AI Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">Asisten Afiliasi Privat Mandiri</p>
      </header>

      <main className="flex-1 my-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Nama / Link Produk
          </label>
          <input
            type="text"
            placeholder="Contoh: Kemeja Oversize Pria Linen"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Target Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['TikTok', 'Shopee Video', 'Lazada', 'Tokopedia'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`py-2.5 px-4 text-xs font-medium rounded-xl border transition-all active:scale-[0.97] ${
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
          type="button"
          onClick={generateContent}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sedang Memikirkan Konten...</span>
            </>
          ) : (
            <span>✨ Tembak Traffic Konten</span>
          )}
        </button>

        {result && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-xs font-bold text-indigo-400">Hasil Copywriting AI:</span>
              <button
                type="button"
                onClick={handleCopy}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {copied ? 'Tersalin! ✓' : 'Salin Teks'}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text">
              {result}
            </p>
          </div>
        )}
      </main>

      <footer className="text-center py-2 text-[10px] text-slate-500 border-t border-slate-800/50">
        AffiliX AI • Di-host via Vercel HP
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
