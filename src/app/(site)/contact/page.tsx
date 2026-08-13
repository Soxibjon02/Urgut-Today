'use client'

import React, { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase">Bog'lanish va Takliflar</h1>
        <p className="text-slate-600 text-sm mt-1">Tahririyat bilan bog'lanish yoki yangilik yuborish</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
        {sent && (
          <div className="p-4 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg">
            Xabaringiz muvaffaqiyatli yuborildi! Tahririyat tez orada siz bilan bog'lanadi.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ism va Familiyangiz *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Raqamingiz *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Xabar yoki Yangilik Matni *</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Taklif, murojaat yoki foto/foto lavhalar bo'yicha izoh..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-red-700"
            />
          </div>

          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors"
          >
            Xabarni Yuborish
          </button>
        </form>
      </div>
    </div>
  );
}
