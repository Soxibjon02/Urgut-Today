import { Sparkles, Shield, Zap, Target } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
          Biz Haqimizda
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Urgut Today axborot portali va mustaqil media platformasi
        </p>
      </div>

      <div className="bg-white dark:bg-[#1c2128] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 md:p-10 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-red-600" /> Loyiha Maqsadi
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">&quot;Urgut Today&quot;</strong> — Samarqand viloyati Urgut tumani hayoti, ijtimoiy-iqtisodiy rivojlanishi,
            ta&apos;lim, sport hamda madaniyat sohalaridagi eng so&apos;nggi va ishonchli xabarlarni tezkor yoritib boruvchi mustaqil raqamli media platformasidir.
          </p>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-600" /> Bizning Tamoyillarimiz
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-sm text-red-700 dark:text-red-400 block mb-1">
                Xolis Axborot
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Har bir xabar tasdiqlangan manbalar va mutasaddi idoralar axborotiga asoslanadi.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-sm text-red-700 dark:text-red-400 block mb-1">
                Tezkorlik
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tuman hayotidagi muhim hodisa va xabarlarni zudlik bilan aholiga yetkazish.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-sm text-red-700 dark:text-red-400 block mb-1">
                Jamiyat Manfaati
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Mahalliy aholi uchun foydali e&apos;lonlar va muhim eslatmalarni taqdim etish.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-l-4 border-red-700 font-medium text-slate-800 dark:text-slate-200 text-sm">
          Urgut tumani va unga tutash hududlarda yashovchi barcha fuqarolar uchun qulay, zamonaviy hamda sifatli axborot muhitini yaratish bizning bosh maqsadimizdir.
        </div>
      </div>
    </div>
  )
}
