import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  const displayName = (siteSettings?.site_name && siteSettings.site_name !== 'Beracah Cafe')
    ? siteSettings.site_name
    : 'For Rent PH';

  // Prefer local logo unless a non-pexels custom URL is set
  const imageSrc = siteSettings?.site_logo && !siteSettings.site_logo.includes('pexels.com')
    ? siteSettings.site_logo
    : '/logo.jpg';

  return (
    <header className="sticky top-0 z-50 bg-rental-off-white border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-3 group"
          >
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                <div className="relative">
                  <img 
                    src={imageSrc} 
                    alt={displayName}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/logo.jpg";
                    }}
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-poppins font-bold text-rental-dark group-hover:text-rental-purple transition-colors duration-200">
                  {loading ? (
                    <div className="w-32 h-7 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    displayName
                  )}
                </h1>
                <p className="text-xs text-rental-slate font-medium">Inflatable Costume Rentals</p>
              </div>
            </div>
          </button>

          <div className="flex items-center space-x-2">
            <button 
              onClick={onCartClick}
              className="relative p-3 bg-rental-dark text-white hover:bg-rental-dark-hover rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rental-purple text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce-gentle border-2 border-rental-off-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;