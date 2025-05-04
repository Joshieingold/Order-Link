import { Navbar } from "../General/navbar/navbar";
import "./homePage.css"; // Make sure this CSS is present

export const HomePage = () => {
    return (
        <div className="home-page">
            <Navbar />
            <h1 className="home-title">Welcome to the Home Page</h1>
            <p className="home-subtitle">This is where you can manage your tasks and projects.</p>
        </div>
    )
}