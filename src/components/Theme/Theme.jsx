import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    // On mount, set the initial theme from localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "light";
        setIsDark(storedTheme === "dark");
        document.documentElement.setAttribute("data-theme", storedTheme);
    }, []);

    const handleChange = (e) => {
        const newTheme = e.target.checked ? "dark" : "light";
        setIsDark(e.target.checked);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <label className="toggle toggle-primary w-14 h-8">
            <input type="checkbox" checked={isDark} onChange={handleChange} />
            <span className="swap swap-rotate">
                {/* Sun Icon */}
                <svg
                    className="swap-on w-6 h-6 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                </svg>
                {/* Moon Icon */}
                <svg
                    className="swap-off w-6 h-6 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"></path>
                </svg>
            </span>
        </label>
    );
};

export default ThemeToggle;
