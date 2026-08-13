export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase">Biz Haqimizda</h1>
        <p className="text-slate-600 text-sm mt-1">Urgut Today axborot portali haqida to'liq ma'lumot</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6 text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">Loyiha Maqsadi</h2>
        <p>
          <strong>"Urgut Today"</strong> — Samarqand viloyati Urgut tumani hayoti, ijtimoiy-iqtisodiy rivojlanishi,
          ta'lim, sport hamda madaniyat sohalaridagi eng so'nggi va ishonchli xabarlarni tezkor yoritib boruvchi mustaqil raqamli media platformasidir.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Bizning Tamoyillarimiz</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Xolislik va Xolis Axborot:</strong> Har bir xabar tasdiqlangan manbalar asosida e'lon qilinadi.</li>
          <li><strong>Tezkorlik:</strong> Tuman hayotidagi muhim hodisalarni zudlik bilan yetkazish.</li>
          <li><strong>Jamiyat Manfaati:</strong> Mahalliy aholini qiziqtirgan masalalar va e'lonlarni birinchi o'ringa qo'yish.</li>
        </ul>

        <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-red-700 font-semibold text-slate-800">
          Urgut tumani va unga tutash hududlarda yashovchi barcha fuqarolar uchun qulay hamda sifatli axborot muhitini yaratish bizning bosh maqsadimizdir.
        </div>
      </div>
    </div>
  );
}
