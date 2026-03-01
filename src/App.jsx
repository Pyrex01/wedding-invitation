import { useEffect, useMemo, useState } from 'react';
import invitationsCsv from './invitations.csv?raw';

const decodeParam = (value) => {
  if (!value) return '';
  try {
    return decodeURIComponent(value).replace(/\+/g, ' ').trim();
  } catch {
    return value.trim();
  }
};

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const parseInvitationsCsv = (csvText) => {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const rows = lines.slice(1);
  return rows.map((line) => {
    const [englishName, urduName, englishMessage, urduMessage] = parseCsvLine(line);
    return {
      englishName,
      urduName,
      englishMessage,
      urduMessage
    };
  });
};

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const invitations = useMemo(() => parseInvitationsCsv(invitationsCsv), []);
  const floatingPetals = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        id: index,
        left: `${8 + ((index * 11) % 84)}%`,
        delay: `${index * 0.55}s`,
        duration: `${8 + (index % 4) * 1.4}s`
      })),
    []
  );

  const invitee = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingName = decodeParam(params.get('name')).toLowerCase();
    if (!incomingName) return null;

    return (
      invitations.find((entry) => {
        const englishName = decodeParam(entry.englishName).toLowerCase();
        const urduName = decodeParam(entry.urduName).toLowerCase();
        return englishName === incomingName || urduName === incomingName;
      }) || null
    );
  }, [invitations]);

  const handleOpenInvitation = () => {
    if (isOpening) return;
    setIsOpening(true);
    window.setTimeout(() => {
      setShowIntro(false);
      setIsOpening(false);
    }, 1700);
  };

  useEffect(() => {
    if (!showIntro) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showIntro]);

  if (!invitee) {
    return (
      <main className="relative min-h-screen bg-cream text-slate-900 invitation-shell">
        <div className="relative mx-auto flex min-h-screen w-full max-w-[96rem] items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-amber-900/35 bg-white/85 p-7 text-center shadow-glow invitation-paper">
            <p className="urdu-calligraphy text-3xl text-sindoor" dir="rtl">
              معذرت
            </p>
            <h1 className="mt-3 font-heading text-3xl text-sindoor">Oops, something went wrong</h1>
            <p className="mt-3 font-body text-sm text-slate-600">
              This invitation link is invalid. Please check the name in your URL parameter.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-slate-900 invitation-shell">
      <div className="absolute inset-0 -z-20 mughal-backdrop" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        {floatingPetals.map((petal) => (
          <span
            key={petal.id}
            className="petal"
            style={{ left: petal.left, animationDelay: petal.delay, animationDuration: petal.duration }}
          />
        ))}
      </div>
      <div
        className={`relative mx-auto flex min-h-screen w-full max-w-[96rem] flex-col overflow-hidden px-5 pb-10 pt-6 sm:my-6 sm:rounded-3xl sm:px-8 sm:shadow-glow lg:px-12 ${
          showIntro ? 'invitation-main-hidden' : 'invitation-main-reveal'
        }`}
      >
        <div className="invitation-paper mughal-paper absolute inset-0 -z-10 rounded-none sm:rounded-3xl" />
        <div className="jali-overlay absolute inset-0 -z-10 rounded-none sm:rounded-3xl" />
        <div className="lantern lantern-left" />
        <div className="lantern lantern-right" />

        <header
          className="mughal-arch animate-rise text-center shadow-[0_20px_45px_rgba(18,41,66,0.15)]"
          style={{ animationDelay: '100ms' }}
        >
          <p className="font-body text-[11px] tracking-[0.35em] text-amber-900/80 bilingual-label">
            <span className="bilingual-copy bilingual-copy-en uppercase">Daawat-E-Walima</span>
            <span className="bilingual-copy bilingual-copy-ur urdu-calligraphy" dir="rtl">
              دعوتِ ولیمہ
            </span>
          </p>
          <p className="urdu-calligraphy mt-4 text-3xl leading-tight text-sindoor" dir="rtl">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
          </p>
          <h1 className="mt-4 font-heading text-[2.3rem] leading-tight text-sindoor text-glow bilingual-name">
            <span className="bilingual-copy bilingual-copy-en">Riyan Khan</span>
            <span className="bilingual-copy bilingual-copy-ur urdu-calligraphy" dir="rtl">
              ریان خان
            </span>
          </h1>
          <p className="font-body text-xs tracking-[0.34em] text-amber-900/80 bilingual-label bilingual-connector">
            <span className="bilingual-copy bilingual-copy-en uppercase">weds</span>
            <span className="bilingual-copy bilingual-copy-ur urdu-calligraphy" dir="rtl">
              ولیمہ
            </span>
          </p>
          <h1 className="mt-1 font-heading text-[2.3rem] leading-tight text-sindoor text-glow bilingual-name">
            <span className="bilingual-copy bilingual-copy-en">Khadija Tabassum</span>
            <span className="bilingual-copy bilingual-copy-ur urdu-calligraphy" dir="rtl">
              خدیجہ تبسم
            </span>
          </h1>
          <p className="mt-4 font-body text-sm text-slate-600">With blessings of our families</p>
        </header>

        <section
          className="mughal-card shimmer-frame relative mt-6 animate-rise rounded-3xl border border-amber-900/35 bg-white/88 p-5 backdrop-blur"
          style={{ animationDelay: '240ms' }}
        >
          <p className="font-body text-[11px] tracking-[0.24em] text-peacock/80 bilingual-label">
            <span className="bilingual-copy bilingual-copy-en uppercase">Personal Invitation</span>
            <span className="bilingual-copy bilingual-copy-ur urdu-calligraphy" dir="rtl">
              ذاتی دعوت
            </span>
          </p>
          <h2 className="mt-2 font-heading text-3xl leading-tight text-mehndi bilingual-name">
            <span className="bilingual-copy bilingual-copy-en">{invitee.englishName}</span>
            <span className="bilingual-copy bilingual-copy-ur urdu-calligraphy" dir="rtl">
              {invitee.urduName}
            </span>
          </h2>
          <p className="walima-swap walima-venue mt-3 font-body text-sm leading-relaxed text-slate-700">
            <span className="walima-copy walima-copy-en">{invitee.englishMessage}</span>
            <span className="walima-copy walima-copy-ur urdu-calligraphy text-base text-sindoor/90" dir="rtl">
              {invitee.urduMessage}
            </span>
          </p>
        </section>

        <section
          className="mughal-card shimmer-frame mt-5 animate-rise rounded-3xl border border-amber-900/30 bg-gradient-to-br from-white to-amber-50 p-5"
          style={{ animationDelay: '340ms' }}
        >
          <p className="walima-swap walima-title font-body text-[11px] tracking-[0.24em] text-mehndi/80">
            <span className="walima-copy walima-copy-en uppercase">Walima Details</span>
            <span className="walima-copy walima-copy-ur urdu-calligraphy" dir="rtl">
              ولیمہ کی تفصیلات
            </span>
          </p>
          <div className="mt-4 space-y-3">
            <div className="timeline-item">
              <p className="walima-swap walima-label font-body text-xs tracking-[0.2em] text-slate-500">
                <span className="walima-copy walima-copy-en uppercase">Date</span>
                <span className="walima-copy walima-copy-ur urdu-calligraphy" dir="rtl">
                  تاریخ
                </span>
              </p>
              <p className="walima-swap walima-value text-sindoor">
                <span className="walima-copy walima-copy-en font-heading text-2xl">10 May 2026</span>
                <span className="walima-copy walima-copy-ur urdu-calligraphy text-[1.65rem]" dir="rtl">
                  10 مئی 2026
                </span>
              </p>
            </div>
            <div className="timeline-item">
              <p className="walima-swap walima-label font-body text-xs tracking-[0.2em] text-slate-500">
                <span className="walima-copy walima-copy-en uppercase">Time</span>
                <span className="walima-copy walima-copy-ur urdu-calligraphy" dir="rtl">
                  وقت
                </span>
              </p>
              <p className="walima-swap walima-value font-body text-base font-medium text-slate-700">
                <span className="walima-copy walima-copy-en">8:00 PM onwards</span>
                <span className="walima-copy walima-copy-ur urdu-calligraphy text-lg" dir="rtl">
                  رات 8:00 بجے سے
                </span>
              </p>
            </div>
            <div className="timeline-item">
              <p className="walima-swap walima-label font-body text-xs tracking-[0.2em] text-slate-500">
                <span className="walima-copy walima-copy-en uppercase">Venue</span>
                <span className="walima-copy walima-copy-ur urdu-calligraphy" dir="rtl">
                  مقام
                </span>
              </p>
              <p className="walima-swap walima-venue font-body text-sm leading-relaxed text-slate-700">
                <span className="walima-copy walima-copy-en">Mubarak Hall, behind Mumbra Virani Petrol Pump</span>
                <span className="walima-copy walima-copy-ur urdu-calligraphy text-base" dir="rtl">
                  مبارک ہال، ممبرا ویرانی پیٹرول پمپ کے پیچھے
                </span>
              </p>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=Mubarak+Hall+Mumbra"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-sindoor px-4 py-3 font-body text-sm font-semibold text-white transition duration-300 hover:scale-[1.02] hover:bg-rose-700"
          >
            <span className="walima-swap walima-button w-full text-center">
              <span className="walima-copy walima-copy-en uppercase">View Location</span>
              <span className="walima-copy walima-copy-ur urdu-calligraphy" dir="rtl">
                مقام دیکھیں
              </span>
            </span>
          </a>
        </section>
      </div>

      {showIntro && (
        <div
          className={`intro-overlay fixed inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-amber-950 via-sindoor to-amber-900 px-6 text-center text-white ${
            isOpening ? 'intro-overlay-opening' : ''
          }`}
        >
          <div className="intro-door intro-door-left" />
          <div className="intro-door intro-door-right" />
          <div className={`intro-burst ${isOpening ? 'intro-burst-active' : ''}`} />
          <div
            className={`intro-card w-full max-w-sm animate-rise rounded-3xl border border-white/30 bg-white/10 px-6 py-8 backdrop-blur ${
              isOpening ? 'intro-card-opening' : ''
            }`}
          >
            <p className="urdu-calligraphy text-4xl leading-tight" dir="rtl">
              دعوتِ ولیمہ
            </p>
            <h2 className="mt-4 font-heading text-3xl">You Are Invited to Dawat-e-Walima</h2>
            <button
              type="button"
              onClick={handleOpenInvitation}
              disabled={isOpening}
              className="mt-6 rounded-full bg-marigold px-5 py-2 font-body text-sm font-semibold text-slate-900 transition duration-300 hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isOpening ? 'Unveiling...' : 'Open Invitation'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
