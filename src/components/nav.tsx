import { useAuth } from '../contexts/auth-context.tsx';
import { UserPen } from 'lucide-react'
import { Menu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface NavProps {
  onMenuClick: () => void;
}

function Nav({ onMenuClick }: NavProps) {
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="nav relative">
      <div className="flex items-center gap-2">
        <button className="md:hidden p-2" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/">
          <img src="/mainlogo.png" className="logo m-0" />
        </Link>
      </div>
      <div className='flex'>
        {isLoggedIn &&
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <UserPen className='text-[#f97316]'/>
            </button>

            {menuOpen && (
              <div className="logout-button flex flex-col overflow-hidden">
                <Link
                  to="/settings"
                  className="btn-secondary text-left w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="btn-secondary text-left w-full"
                >
                  Logout
                </button>
              </div>
            )}


          </div>
        }
      </div>
    </div>
  );
}

export default Nav;
