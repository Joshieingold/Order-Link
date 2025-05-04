import "./miniOrder.css";

export const MiniOrder = ({doc, onClick, isActive}) => {
    return (
        <div onClick={onClick} className={`mini-container ${isActive ? "active-mini-container" : ""}`}>
            <h3>#{doc.OrderID}</h3>
            <p>{doc.TechName}</p>
        </div>
    )
}