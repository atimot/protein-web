import React from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const handleLogoClick = () => {
    // TODO: ナビゲーション処理を実装
    console.log('Logo clicked');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 lg:px-8 max-w-4xl mx-auto">
        <button
          onClick={handleLogoClick}
          className="flex items-center p-2 -ml-2 md:p-3 md:-ml-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          aria-label="ホームに戻る"
        >
          <h1 className="m-0 text-2xl md:text-3xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 font-sans tracking-tight">
              proteInternet
            </span>
          </h1>
        </button>
      </div>
    </header>
  );
};

export default Header; 
