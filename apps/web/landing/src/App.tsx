import { Link } from 'react-router-dom';
import { ARTICLES } from './data/articles';

interface AppInfo {
  key: string;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  gradient: string;
  border: string;
  badge: string;
  btn: string;
  ring: string;
  features: string[];
  soon?: boolean;
}

const APPS: AppInfo[] = [
  {
    key: 'couple',
    emoji: '💑',
    name: '우리, 커플',
    tagline: '연인과 함께',
    description: '소중한 사람과의 하루를 기록하고 추억을 쌓아가세요. 둘만의 공간에서 더 가까워질 수 있어요.',
    href: 'https://couple.weourus.xyz',
    gradient: 'from-rose-50 to-pink-100',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-500',
    btn: 'bg-rose-400 hover:bg-rose-500',
    ring: 'ring-rose-200',
    features: ['커플 일기장', '사진 갤러리', '커뮤니티'],
  },
  {
    key: 'pet',
    emoji: '🐾',
    name: '우리, 아이',
    tagline: '반려동물과 함께',
    description: '내 아이의 성장을 기록하고 가족과 공유하세요. 펫 다이어리와 커뮤니티로 더 특별한 반려 생활을.',
    href: 'https://pet.weourus.xyz',
    gradient: 'from-teal-50 to-cyan-100',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-600',
    btn: 'bg-teal-400 hover:bg-teal-500',
    ring: 'ring-teal-200',
    features: ['펫 다이어리', '성장 갤러리', '커뮤니티'],
  },
  {
    key: 'marriage',
    emoji: '💍',
    name: '우리, 부부',
    tagline: '배우자와 함께',
    description: '결혼 생활의 소소한 행복을 기록하세요. 부부만의 일기와 갤러리로 함께한 날들을 오래도록 간직해요.',
    href: 'https://marriage.weourus.xyz',
    gradient: 'from-amber-50 to-yellow-100',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-600',
    btn: 'bg-amber-400 hover:bg-amber-500',
    ring: 'ring-amber-200',
    features: ['부부 일기장', '사진 갤러리', '커뮤니티'],
  },
];

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight text-gray-900 no-underline">우리</Link>
        <div className="flex items-center gap-5">
          <a href="#apps" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">서비스</a>
          <Link to="/story" className="text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">스토리</Link>
          <a
            href="mailto:contact@weourus.xyz"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            문의
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-28 pb-16 px-6 text-center">
      <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
        weourus.xyz
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
        소중한 사람과<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">
          함께하는 일상
        </span>
      </h1>

      <p className="max-w-lg mx-auto text-base sm:text-lg text-gray-500 leading-relaxed mb-10">
        연인, 반려동물, 배우자와의 매일을 기록하고 공유하세요.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        {APPS.map((app) => (
          <a
            key={app.key}
            href={`#${app.key}`}
            className={[
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
              'border transition-all duration-200 hover:-translate-y-0.5',
              app.border,
              app.badge,
            ].join(' ')}
          >
            <span>{app.emoji}</span>
            {app.name}
          </a>
        ))}
      </div>

      {/* App preview mosaic */}
      <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3 px-4">
        {APPS.map((app) => (
          <div
            key={app.key}
            className={[
              'aspect-[9/16] rounded-2xl bg-gradient-to-br',
              app.gradient,
              'border',
              app.border,
              'flex flex-col items-center justify-center gap-2 shadow-sm',
            ].join(' ')}
          >
            <span className="text-3xl">{app.emoji}</span>
            <span className="text-xs font-semibold text-gray-600">{app.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureRow() {
  const features = [
    {
      icon: '📔',
      title: '일기 & 갤러리',
      desc: '하루하루의 소중한 순간을 사진과 글로 기록해요.',
    },
    {
      icon: '👫',
      title: '함께 관리',
      desc: '커플, 가족과 공유하며 추억을 함께 쌓아가요.',
    },
    {
      icon: '💬',
      title: '커뮤니티',
      desc: '같은 마음을 가진 사람들과 이야기를 나눠요.',
    },
  ];

  return (
    <section className="bg-gray-50 border-y border-gray-100 py-16 px-6 my-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">
          주요 기능
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppCard({ app }: { app: AppInfo }) {
  return (
    <a
      id={app.key}
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'group relative flex flex-col rounded-2xl border',
        app.border,
        'bg-gradient-to-br',
        app.gradient,
        'p-7 transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-xl hover:ring-4',
        app.ring,
        'cursor-pointer no-underline',
      ].join(' ')}
    >
      <div className="flex items-start justify-between mb-5">
        <span className="text-4xl leading-none">{app.emoji}</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${app.badge}`}>
          {app.tagline}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">{app.name}</h2>
      <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">{app.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {app.features.map((f) => (
          <span key={f} className="text-xs bg-white/60 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
            {f}
          </span>
        ))}
      </div>

      <div
        className={[
          'inline-flex items-center justify-center gap-1.5',
          'text-white text-sm font-semibold',
          'px-5 py-2.5 rounded-xl',
          'transition-colors duration-200',
          app.btn,
          'self-start',
        ].join(' ')}
      >
        시작하기
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

function AppsSection() {
  return (
    <section id="apps" className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">서비스</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">우리의 앱을 만나보세요</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {APPS.map((app) => (
          <AppCard key={app.key} app={app} />
        ))}
      </div>
    </section>
  );
}

function ArticlePreviewStrip() {
  const preview = ARTICLES.slice(0, 4);
  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">스토리</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">우리의 이야기</h2>
        <p className="text-sm text-gray-500">일상을 기록하고 관계를 깊게 만드는 방법을 나눕니다.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {preview.map((article) => (
          <Link
            key={article.slug}
            to={`/story/${article.slug}`}
            className="group flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline bg-white"
          >
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
              {article.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-1">{article.category} · {article.readTime}분 읽기</p>
              <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-rose-500 transition-colors line-clamp-2">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link
          to="/story"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-6 py-2.5 rounded-xl transition-all no-underline"
        >
          전체 스토리 보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-24">
      <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-10 sm:p-14 text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">시작하기</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          오늘의 일상을 기록해보세요
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
          회원가입 없이도 일기와 갤러리를 사용할 수 있어요. 지금 바로 시작해보세요.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {APPS.map((app) => (
            <a
              key={app.key}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors duration-200"
            >
              {app.emoji} {app.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold text-gray-900">우리</span>
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <a href="https://couple.weourus.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">커플</a>
          <a href="https://pet.weourus.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">아이</a>
          <a href="https://marriage.weourus.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">부부</a>
          <Link to="/story" className="hover:text-gray-700 transition-colors no-underline">스토리</Link>
          <a href="mailto:contact@weourus.xyz" className="hover:text-gray-700 transition-colors">문의</a>
        </div>
        <p className="text-xs text-gray-400">© 2026 weourus.xyz</p>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <FeatureRow />
        <AppsSection />
        <ArticlePreviewStrip />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
