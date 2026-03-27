import { Link, useParams, Navigate } from 'react-router-dom';
import { ARTICLES } from '../data/articles';

const CATEGORY_COLORS: Record<string, string> = {
  '커플': 'bg-rose-100 text-rose-600',
  '펫': 'bg-teal-100 text-teal-600',
  '부부': 'bg-amber-100 text-amber-600',
  '일기 팁': 'bg-purple-100 text-purple-600',
  '개발 이야기': 'bg-blue-100 text-blue-600',
  '갤러리': 'bg-orange-100 text-orange-600',
  '커뮤니티': 'bg-green-100 text-green-600',
};

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/story" replace />;

  const categoryColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-100 text-gray-600';
  const others = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-gray-900 no-underline">우리</Link>
          <div className="flex items-center gap-5">
            <Link to="/#apps" className="text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">서비스</Link>
            <Link to="/story" className="text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">스토리</Link>
            <a href="mailto:contact@weourus.xyz" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">문의</a>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-24">
        {/* Hero */}
        <div className="max-w-2xl mx-auto px-6 mb-12">
          <Link to="/story" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-6 no-underline">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            스토리 목록으로
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
              {article.category}
            </span>
            <span className="text-xs text-gray-400">{article.readTime}분 읽기</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{article.date}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-base text-gray-500 leading-relaxed border-l-4 border-gray-100 pl-4">
            {article.summary}
          </p>
        </div>

        {/* Divider emoji */}
        <div className="text-center text-4xl mb-12">{article.emoji}</div>

        {/* Article body */}
        <article className="max-w-2xl mx-auto px-6 space-y-8">
          {article.content.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="text-lg font-bold text-gray-900 mb-3">{section.heading}</h2>
              )}
              <p className="text-base text-gray-600 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </article>

        {/* CTA */}
        <div className="max-w-2xl mx-auto px-6 mt-16">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center">
            <p className="text-white font-bold text-lg mb-2">지금 바로 시작해보세요</p>
            <p className="text-gray-400 text-sm mb-6">회원가입 없이도 일기와 갤러리를 이용할 수 있어요.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="https://couple.weourus.xyz" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                💑 우리, 커플
              </a>
              <a href="https://pet.weourus.xyz" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                🐾 우리, 아이
              </a>
              <a href="https://marriage.weourus.xyz" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                💍 우리, 부부
              </a>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {others.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 mt-20">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 text-center">더 읽어보기</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {others.map((a) => {
                const cc = CATEGORY_COLORS[a.category] ?? 'bg-gray-100 text-gray-600';
                return (
                  <Link
                    key={a.slug}
                    to={`/story/${a.slug}`}
                    className="group flex flex-col rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden no-underline"
                  >
                    <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-4xl">
                      {a.emoji}
                    </div>
                    <div className="p-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cc} inline-block mb-2`}>
                        {a.category}
                      </span>
                      <p className="text-sm font-bold text-gray-900 leading-snug group-hover:text-rose-500 transition-colors line-clamp-2">
                        {a.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-sm font-bold text-gray-900 no-underline">우리</Link>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <a href="https://couple.weourus.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">커플</a>
            <a href="https://pet.weourus.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">아이</a>
            <a href="https://marriage.weourus.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">부부</a>
            <a href="mailto:contact@weourus.xyz" className="hover:text-gray-700 transition-colors">문의</a>
          </div>
          <p className="text-xs text-gray-400">© 2026 weourus.xyz</p>
        </div>
      </footer>
    </div>
  );
}
