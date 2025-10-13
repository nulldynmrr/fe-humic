"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaEnvelope,
  FaChevronDown,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const menuItems = [
  { name: "Home", href: "/" },
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Research and Innovation",
    href: "#",
    dropdown: [
      { name: "Research Projects", href: "/research-projects" },
      { name: "Publications", href: "/publications" },
    ],
  },
  {
    name: "Internship Project",
    href: "#",
    dropdown: [
      { name: "Internship", href: "/internship" },
      { name: "International Internship", href: "/international-internship" },
    ],
  },
  {
    name: "Contact Us",
    href: "#",
    dropdown: [
      { name: "Events", href: "/news/events" },
      { name: "Announcements", href: "/news/announcements" },
    ],
  },
];

const Navbar = () => {
  const [hovered, setHovered] = useState(null);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      ref={navbarRef}
      className="p-4 md:px-12 w-full fixed top-0 left-0 z-50 transition-all duration-500 bg-white shadow-sm"
    >
      <nav className="flex flex-col items-center justify-between">
        <div className="flex items-center justify-between w-full py-3 relative">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <img
                src="/assets/logo-humic.png"
                alt="HUMIC Logo"
                className="h-[3.5rem] cursor-pointer"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div
              className={`text-primary text-sm flex justify-end items-center gap-2 w-full overflow-hidden transition-all duration-500 ${
                showTopBar ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
              <a
                href="mailto:humic@telkomuniversity.ac.id"
                className="flex items-center gap-2"
              >
                <FaEnvelope className="text-primary" />
                <span className="cursor-pointer">
                  humic@telkomuniversity.ac.id
                </span>
              </a>
              <FaSearch className="cursor-pointer hover:opacity-80" />
            </div>

            <ul className="flex items-center space-x-8 relative mt-3">
              {menuItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  item.dropdown?.some((d) => d.href === pathname);

                return (
                  <li
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Link
                      href={item.href}
                      className={`font-medium uppercase text-sm flex items-center gap-1 transition-colors duration-300 ${
                        isActive
                          ? "text-primary"
                          : "text-gray-600 hover:text-[#C10000]"
                      }`}
                    >
                      {item.name}
                      {item.dropdown && (
                        <FaChevronDown
                          className={`text-xs mt-0.5 transition-transform duration-300 ${
                            hovered === index ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>

                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-[#C10000] transition-all duration-300 ${
                        isActive || hovered === index ? "w-full" : "w-0"
                      }`}
                    ></span>

                    {item.dropdown && (
                      <ul
                        className={`absolute top-8 bg-white shadow-lg rounded-sm py-2 mt-4 border border-gray-100 transform transition-all duration-300 ease-in-out origin-top ${
                          hovered === index
                            ? "opacity-100 scale-y-100 visible"
                            : "opacity-0 scale-y-95 invisible"
                        }`}
                        style={{
                          left: "50%",
                          transform: "translateX(-50%)",
                          right: "auto",
                          width: "max-content",
                          maxWidth: "90vw",
                          boxSizing: "border-box",
                        }}
                      >
                        {item.dropdown.map((sub, i) => (
                          <li key={i}>
                            <Link
                              href={sub.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                pathname === sub.href
                                  ? "text-[#C10000] font-medium"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-[#C10000]"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {menuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden w-full bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col mt-2 pb-3 space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className="px-2">
                {item.dropdown ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full text-left py-2 px-2 font-medium uppercase text-sm text-gray-700 hover:text-[#C10000]"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === index ? null : index
                        )
                      }
                    >
                      {item.name}
                      <FaChevronDown
                        className={`text-xs transition-transform duration-300 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <ul
                      className={`pl-6 text-sm transition-all duration-300 ${
                        activeDropdown === index
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      {item.dropdown.map((sub, i) => (
                        <li key={i}>
                          <Link
                            href={sub.href}
                            className="block py-1 text-gray-800 hover:text-[#C10000]"
                            onClick={() => setMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-2 px-2 font-medium uppercase text-sm text-gray-700 hover:text-[#C10000]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
