import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Card', icon: '📋' },
  { id: 'promo', label: 'Promo', icon: '🎤' },
  { id: 'profile', label: 'Profile', icon: '🏆' },
];

interface NavigationProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab = 'home',
  onNavigate
}) => {
  return (
    <nav className="border-t border-kayfabe-gray-medium bg-kayfabe-black">
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-around py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex flex-col items-center space-y-1 px-6 py-2 transition-colors ${
                activeTab === item.id
                  ? 'text-kayfabe-gold'
                  : 'text-kayfabe-gray-light hover:text-kayfabe-cream'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
