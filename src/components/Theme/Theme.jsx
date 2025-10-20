const ThemeToggle = () => {
    const handleChange = (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Check if current theme is dark
    const isDark = localStorage.getItem('theme') === 'dark';

    return (
        <label className="swap">
            <input type="checkbox" checked={isDark} onChange={handleChange} />
            <span className="swap-on">🌞</span>
            <span className="swap-off">🌜</span>
        </label>
    );
};

export default ThemeToggle;
