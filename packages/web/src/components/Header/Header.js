import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AiOutlineUser } from 'react-icons/ai';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from 'react-query';
import { setUserId } from '../../store/authSlice';
import { setThemeIsDark } from '../../store/themeSlice';
import { logout } from '../../utils/usersApi';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t, i18n] = useTranslation('global');
  const [isShownLangMenu, setIsShownLangMenu] = useState(false);
  const [isShownUserMenu, setIsShownUserMenu] = useState(false);
  const userId = useSelector((store) => store.auth.user?.userId);
  const isDarkTheme = useSelector((store) => store.theme.isDark);
  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      dispatch(setUserId(null));
      navigate('/sign-in');
    },
  });

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setIsShownLangMenu(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleTheme = () => {
    dispatch(setThemeIsDark(!isDarkTheme));
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <div
      className="sticky top-0 left-0 z-50 flex justify-between
        items-center bg-primary h-16 px-10 border-b border-b-lines"
    >
      <Link to="/">
        <img
          src="/logo.png"
          alt=""
          className="h-12"
        />
      </Link>
      <div
        className="flex gap-6 items-center"
      >
        <div
          onMouseEnter={() => setIsShownLangMenu(true)}
          onMouseLeave={() => setIsShownLangMenu(false)}
        >
          <button
            type="button"
            className="button w-[34px] h-[34px] cursor-pointer"
          >
            {i18n.language}
          </button>
          <AnimatePresence>
            {isShownLangMenu && (
              <motion.div
                className="menu body-text-m -translate-x-8 w-[150px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  type="button"
                  onClick={() => handleChangeLanguage('en')}
                  className="menu-option"
                >
                  <p className="whitespace-nowrap">English (US)</p>
                  <p>en</p>
                </button>
                <div className="divider-x" />
                <button
                  type="button"
                  onClick={() => handleChangeLanguage('ua')}
                  className="menu-option"
                >
                  <p>Ukraine</p>
                  <p>ua</p>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button type="button" className="nav-button" onClick={() => toggleTheme()}>
          {isDarkTheme
            ? <FiMoon size={22} />
            : <FiSun size={22} />}
        </button>
        {userId ? (
          <div
            onMouseEnter={() => setIsShownUserMenu(true)}
            onMouseLeave={() => setIsShownUserMenu(false)}
            className="flex gap-6 items-center"
          >
            <div
              className="nav-button"
            >
              <AiOutlineUser
                size={22}
              />
            </div>
            <AnimatePresence>
              {isShownUserMenu && (
                <motion.div
                  className="menu translate-y-[72px] -translate-x-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Link
                    to="/courses/my"
                    className="menu-option whitespace-nowrap"
                    onClick={() => setIsShownUserMenu(false)}
                  >
                    {t('myCourses')}
                  </Link>
                  <div className="divider-x" />
                  <Link
                    to="/account"
                    className="menu-option"
                    onClick={() => setIsShownUserMenu(false)}
                  >
                    {t('header.account')}
                  </Link>
                  <div className="divider-x" />
                  <button
                    type="button"
                    className="menu-option"
                    onClick={handleLogout}
                  >
                    {t('header.logout')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link
              to="/sign-in"
              className="border border-lines px-3 py-1 rounded-[4px] hover:bg-secondary"
            >
              {t('header.signIn')}
            </Link>
            <Link
              to="/sign-up"
              className="bg-lightPurple hover:bg-purple text-[#fff] px-3 py-1 rounded-[4px]"
            >
              {t('header.signUp')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
