import "./Navbar.css";
export default function Navbar() {
    return (
        <nav className="nav">
        <a href="/" className="site-title">
        Brrnie
        </a>
        <ul>
            <li>
                <a href="/home">Home</a>
            </li>
            <li>
                <a href="/inventory">Inventory</a>
            </li>
        </ul>
        </nav>
    )
}

