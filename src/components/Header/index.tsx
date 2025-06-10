// src/components/Header/index.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const isLoadingAuth = status === "loading";
  const isAuthenticated = status === "authenticated";

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) setSticky(true);
    else setSticky(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const usePathName = usePathname();

  // Define common classes for mobile menu items
  const mobileMenuItemClass = `block py-2 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white`;
  const mobileMenuButtonClass = `w-full text-left ${mobileMenuItemClass}`; // For button to look like link

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-[9999] bg-white/80 backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-3 lg:py-1" : "py-4"
                } `}
                onClick={() => setNavbarOpen(false)} // Close menu on logo click
              >
                <Image
                  src="/images/logo/melofylight.svg"
                  alt="Melofy Logo"
                  width={140}
                  height={30}
                  priority
                  className="dark:hidden"
                />
                <Image
                  src="/images/logo/melofydark.svg"
                  alt="Melofy Logo"
                  width={140}
                  height={30}
                  priority
                  className="hidden dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div> {/* Nav Toggler and Menu */}
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[7px] rotate-45" : " "}`}/>
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0" : " "}`}/>
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[-8px] -rotate-45" : " "}`}/>
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={menuItem.id} className="group relative"> {/* Use menuItem.id for key */}
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            onClick={() => setNavbarOpen(false)} // Close menu on link click
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 ${
                              sticky ? "lg:py-2" : "lg:py-4"
                            } ${
                              usePathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className={`text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 ${
                                sticky ? "lg:py-2" : "lg:py-4"
                              } dark:text-white/70 dark:group-hover:text-white`}
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24"><path fillRule="evenodd" clipRule="evenodd" d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z" fill="currentColor"/></svg>
                              </span>
                            </p>
                            <div
                              className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu && menuItem.submenu.map((submenuItem) => ( // Use submenuItem.id
                              <Link
                                href={submenuItem.path || "#"}
                                key={submenuItem.id} // Use submenuItem.id for key
                                onClick={() => setNavbarOpen(false)} // Close menu on link click
                                className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                              >
                                {submenuItem.title}
                              </Link>
                            ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}

                    {/* START: Conditional Mobile Menu Items for Authenticated Users */}
                    {isMounted && !isLoadingAuth && isAuthenticated && (
                      <>
                        <li className="lg:hidden"> {/* Only show in mobile menu */}
                          <Link
                            href="/profile"
                            onClick={() => setNavbarOpen(false)}
                            className={mobileMenuItemClass}
                          >
                            Profile ({session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]})
                          </Link>
                        </li>
                        <li className="lg:hidden"> {/* Only show in mobile menu */}
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: '/' });
                              setNavbarOpen(false);
                            }}
                            className={mobileMenuButtonClass}
                          >
                            Sign Out
                          </button>
                        </li>
                      </>
                    )}
                    {/* END: Conditional Mobile Menu Items */}

                    {/* START: Conditional Mobile Menu Items for Unauthenticated Users */}
                    {isMounted && !isLoadingAuth && !isAuthenticated && (
                        <>
                            <li className="lg:hidden"> {/* Only show in mobile menu */}
                                <Link
                                    href="/signin"
                                    onClick={() => setNavbarOpen(false)}
                                    className={mobileMenuItemClass}
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li className="lg:hidden"> {/* Only show in mobile menu */}
                                <Link
                                    href="/signup"
                                    onClick={() => setNavbarOpen(false)}
                                    className={mobileMenuItemClass}
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                    {/* END: Conditional Mobile Menu Items for Unauthenticated Users */}
                  </ul>
                </nav>
              </div>
              
              {/* Authentication Buttons Section (Desktop) */}
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                {isMounted && !isLoadingAuth && isAuthenticated && session?.user && (
                  <>
                    {session.user.image && (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User avatar"} 
                        width={28} 
                        height={28} 
                        className="mr-2 hidden rounded-full md:block" // md:block ensures it's hidden on mobile
                      />
                    )}
                    <Link 
                      href="/profile" 
                      className="mr-3 hidden whitespace-nowrap px-4 py-2 text-sm font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary md:block" // md:block
                    >
                      {session.user.name || session.user.email?.split('@')[0]}
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="hidden rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-btn duration-300 ease-in-out hover:bg-primary/90 hover:shadow-btn-hover md:block" // md:block
                    >
                      Sign Out
                    </button>
                  </>
                )}
                {isMounted && !isLoadingAuth && !isAuthenticated && (
                  <>
                    <Link href="/signin" className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block">
                      Sign In
                    </Link>
                    <Link href="/signup" className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-xs bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-primary/90 md:block md:px-9 lg:px-6 xl:px-9">
                      Sign Up
                    </Link>
                  </>
                )}
                {(!isMounted || isLoadingAuth) && (
                    <div className="hidden h-[42px] items-center md:flex"> 
                        <div className="px-7 py-3 opacity-0">Sign In</div>
                        <div className="px-8 py-3 opacity-0">Sign Up</div>
                    </div>
                )}
                <div className="ml-4">
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;