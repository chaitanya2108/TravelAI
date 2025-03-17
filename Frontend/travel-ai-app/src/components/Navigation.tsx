import { useState } from "react";
import styles from "./Navigation.module.css";

export const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection}>
        <h1 className={styles.logo}>Travel AI</h1>
        <p className={styles.tagline}>Plan your perfect trip in minutes</p>
      </div>

      <div className={styles.accountSection}>
        <button
          className={styles.accountButton}
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          <svg
            className={styles.accountIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <ul className={styles.dropdownMenu}>
              <li>
                <a href="/profile">Profile</a>
              </li>
              <li>
                <a href="/trips">My Trips</a>
              </li>
              <li>
                <a href="/settings">Settings</a>
              </li>
              <li className={styles.divider}></li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
