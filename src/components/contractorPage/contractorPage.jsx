import "./contractorPage.css"
import {CtrNav} from "./components/ctrNav/ctrNav.jsx"
import {Navbar} from "../General/navbar/navbar"
export const CtrPage = () => {
return (
    <div className="ctr-page-main">
        <Navbar/>
        <CtrNav/>
    </div>
)
};