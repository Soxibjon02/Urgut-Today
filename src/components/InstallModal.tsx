'use client'

import React from 'react'
import { X, Download, Smartphone, Monitor, Share, PlusSquare, CheckCircle2, Zap, Shield, WifiOff } from 'lucide-react'
import { usePWA } from './PWAContext'

export function InstallModal() {
  const { isModalOpen, closeInstallModal, promptInstall, isIOS, isDesktop, isInstalled } = usePWA()

  if (!isModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeInstallModal}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header close */}
        <button
          onClick={closeInstallModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Branding */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
            UT
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 mb-1">
              <Zap className="w-3 h-3" /> Rasmiy ilova
            </div>
            <h3 className="text-xl font-black tracking-tight">Urgut Today</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Samarqand & Urgut tumani yangiliklar ilovasi
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-6 text-center">
          <div className="flex flex-col items-center">
            <Zap className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-[11px] font-bold">2x Tezkor</span>
            <span className="text-[10px] text-slate-400">Tez ochiladi</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200 dark:border-slate-800 px-2">
            <WifiOff className="w-5 h-5 text-blue-500 mb-1" />
            <span className="text-[11px] font-bold">Offline rejim</span>
            <span className="text-[10px] text-slate-400">Saqlab o&apos;qish</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="text-[11px] font-bold">0 MB joy</span>
            <span className="text-[10px] text-slate-400">Xotirani olmaydi</span>
          </div>
        </div>

        {isInstalled ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
              Ilova allaqachon qurilmangizga o&apos;rnatilgan!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Siz Urgut Today ilovasidan to&apos;liq formatda foydalanmoqdasiz.
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Instructions */
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> iPhone va iPad uchun o&apos;rnatish:
              </h4>
              <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Safari brauzerining pastki qismidagi{' '}
                    <strong className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-bold">
                      <Share className="w-3.5 h-3.5 inline" /> Ulashish (Share)
                    </strong>{' '}
                    tugmasini bosing.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Ochilgan ro&apos;yxatdan pastroqqa tushib{' '}
                    <strong className="inline-flex items-center gap-0.5 font-bold text-slate-900 dark:text-slate-100">
                      <PlusSquare className="w-3.5 h-3.5 inline" /> &quot;Asosiy ekranga qo&apos;shish&quot; (Add to Home Screen)
                    </strong>{' '}
                    bandini tanlang.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Yuqori o&apos;ng burchakdagi <strong>&quot;Qo&apos;shish&quot; (Add)</strong> tugmasini bosing. Ilova ish stolingizda paydo bo&apos;ladi!
                  </span>
                </li>
              </ol>
            </div>
          </div>
        ) : (
          /* Android / Desktop One-click Install */
          <div className="space-y-4">
            <button
              onClick={() => promptInstall()}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-700/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98]"
            >
              <Download className="w-5 h-5 animate-bounce" />
              {isDesktop ? "Kompyuterga (Windows/Mac) o'rnatish" : "Telefoningizga o'rnatish"}
            </button>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                {isDesktop ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                O&apos;rnatilgach, ilova brauzersiz alohida to&apos;liq oyna rejimida ishlaydi.
              </p>
              <p>Chrome, Edge, Samsung Internet va barcha zamonaviy brauzerlarni qo&apos;llab-quvvatlaydi.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
