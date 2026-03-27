import { Link } from 'react-router-dom';
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

export function StoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-gray-900 no-underline">우리</Link>
          <div className="flex items-center gap-5">
            <Link to="/#apps" className="text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">서비스</Link>
            <Link to="/story" className="text-sm text-gray-900 font-semibold transition-colors no-underline">스토리</Link>
            <a href="mailto:contact@weourus.xyz" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">문의</a>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-24 max-w-5xl mx-auto px-6">
        {/* Page heading */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">스토리</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">우리의 이야기</h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            일상을 기록하는 방법, 관계를 더 깊게 만드는 습관, 그리고 서비스를 만드는 이야기를 나눕니다.
          </p>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => {
            const categoryColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-100 text-gray-600';
            return (
              <Link
                key={article.slug}
                to={`/story/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden no-underline"
              >
                {/* Thumbnail */}
                <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <span className="text-5xl">{article.emoji}</span>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.readTime}분 읽기</span>
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-rose-500 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">
                    {article.summary}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">{article.date}</p>
                </div>
              </Link>
            );
          })}
        </div>
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
