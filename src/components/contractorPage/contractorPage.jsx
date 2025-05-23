import "./contractorPage.css"
import {CtrNav} from "./components/ctrNav/ctrNav.jsx"
import {Navbar} from "../General/navbar/navbar"
import {CtrTable} from "./components/CtrTable/ctrTable"
export const CtrPage = () => {
return (
    <div className="ctr-page-main">
        <Navbar/>
        <CtrNav/>
        <CtrTable/>
    </div>
)
};