import "./Navbar.css";
export default function Navbar({ logout }) {
    return (
        <nav className="nav">
            <a href="/" className="site-title">
                Brrnie
            </a>
            <ul>
                
                {logout && (
    <li>
        <a
            href="#logout"
            className="logout-btn"
            onClick={e => {
                e.preventDefault();
                logout();
            }}
        >
            Logout
        </a>
    </li>
)}
            </ul>
        </nav>
    );
}