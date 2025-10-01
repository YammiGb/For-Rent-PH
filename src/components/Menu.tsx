import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  selectedCategory?: string;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity, selectedCategory }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');
  const [showMoreInfo, setShowMoreInfo] = React.useState(false);

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);
      
      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  // MobileNav removed; scrolling handler not needed

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {selectedCategory === 'all' && (
      <div className="text-center mb-12">
        <h2 className="text-4xl font-noto font-semibold text-black mb-4">Our Customes</h2>
        <div className="text-gray-700 max-w-3xl mx-auto text-left space-y-5">
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Reservation Policy</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>50% downpayment required to reserve</li>
              <li>No downpayment, no reservation</li>
              <li>Send your dates to check availability</li>
            </ul>
          </div>
          {!showMoreInfo && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowMoreInfo(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-rental-dark text-white text-sm hover:bg-rental-dark-hover transition-colors"
              >
                See more
              </button>
            </div>
          )}

          {showMoreInfo && (
          <>
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Security Deposit</h3>
            <p>₱1,000 per costume</p>
          </div>
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Inclusions</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>1 x costume</li>
              <li>1 x air blower fan</li>
              <li>1 x battery pack (batteries not included)</li>
              <li>Hats and masks depending on costume</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Rental Duration</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Oct–Dec: 12 hours (up to 24 hours if available)</li>
              <li>Jan–Sept: 24 hours</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Late Return Fee</h3>
            <p>Starts at ₱30–₱50 per hour</p>
          </div>
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Pickup & Return</h3>
            <p>Handled by renter</p>
          </div>
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Modes of Payment</h3>
            <p>GCash, BPI, SeaBank, UnionBank</p>
          </div>
          <div>
            <h3 className="font-semibold text-rental-dark mb-2">Damage Fee</h3>
            <p>Damaged costumes start at ₱3,000</p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setShowMoreInfo(false)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
            >
              See less
            </button>
          </div>
          </>
          )}
        </div>
      </div>
      )}

      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category === category.id);
        
        if (categoryItems.length === 0) return null;
        
        return (
          <section key={category.id} id={category.id} className="mb-16">
            <div className="flex items-center mb-8">
              <span className="text-3xl mr-3">{category.icon}</span>
              <h3 className="text-3xl font-noto font-medium text-black">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => {
                const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    quantity={cartItem?.quantity || 0}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
      </main>
    </>
  );
};

export default Menu;