import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from '@google/generative-ai';

function App() {
  const [productName, setProductName] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!productName) return alert('Masukkan nama atau link produk dulu!');
    setLoading(true);
    setResult('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key Gemini belum diatur di Vercel!");

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Kamu adalah ahli digital marketing dan affiliate top. Buatkan copywriting yang sangat persuasif, viral, dan menghasilkan konversi penjualan tinggi untuk produk "${productName}" khusus untuk platform ${platform}. Berikan hook 3 detik pertama yang mematikan, isi yang bikin penasaran, dan Call to Action (CTA) yang kuat agar penonton mengklik link afiliasi di bio. Tambahkan juga rekomendasi hashtag tren.`;

      const response = await model.generateContent(prompt);
      setResult(response.response.text());
    } catch (error) {
      setResult(`Gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto flex flex-col justify-between">
      <header className="py-4 border-b border-slate-800 text-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">🚀 AffiliX AI Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Asisten Afiliasi Privat Mandiri</p>
      </header>

      <main className="flex-1 my-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nama / Link Produk</label>
          <input type="text" placeholder="Contoh: Kemeja Oversize Pria Linen" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Platform</label>
          <div className="grid grid-cols-2 gap-2">
            {['TikTok', 'Shopee Video', 'Lazada', 'Tokopedia'].map((p) => (
              <button key={p} onClick={() => setPlatform(p)} className={`py-2.5 px-4 text-xs font-medium rounded-xl border ${platform === p ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>{p}</button>
            ))}
          </div>
        </div>

        <button onClick={generateContent} disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md disabled:opacity-50">
          {loading ? 'Sedang Memikirkan Konten...' : '✨ Tembak Traffic Konten'}
        </button>

        {result && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-xs font-bold text-indigo-400">Hasil Copywriting AI:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); alert('Konten berhasil disalin!'); }} className="text-[11px] bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md">Salin Teks</button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </main>
      <footer className="text-center py-2 text-[10px] text-slate-500 border-t border-slate-800/50">AffiliX AI • Di-host via Vercel HP</footer>
    </div>
  );
}

export default App;
