import { Link } from "react-router-dom";

function Sidebar({ items = [], title = "Menu" }) {
    return (
        <aside className="sidebar">
            <h3>{title}</h3>
            <ul className="sidebar-list">
                {items.map((item) => (
                    <li key={item.key || item.to}>
                        <Link to={item.to} className="sidebar-link">
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
