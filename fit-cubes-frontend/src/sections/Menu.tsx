import { Link } from "react-router"

type MenuProps = {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
};

export const Menu: React.FC<MenuProps> = ({setMenuOpen, menuOpen}) => {
    return (
        <nav className="flex justify-between fixed h-[62px] w-full z-50 bg-black mx-1">
            <div className="flex justify-between h-[62px] w-[95%] z-50 bg-black mx-auto">
            <img className="w-[108px] h-[46px] my-auto" src="src/components/images/FitCubeLogo.svg" alt="Logo" />
            <ul className="flex justify-between w-[243px] h-[46px]">
                <Link to="/" className="h-[62px] leading-[62px]">
                    <li className="">Home</li>
                    </Link>
                <Link to="/diary" className="h-[62px] leading-[62px]">
                    <li className="">Diary</li>
                </Link>
                <Link to="/kitchen" className="h-[62px] leading-[62px]">
                    <li className="">Kitchen</li>
                </Link>
            </ul>
            <div className="flex justify-between w-[178px] h-[46px] my-auto">
                <img src="src/components/images/Language.svg" alt="" />
                <div className="flex justify-evenly w-[90px] h-[46px] bg-[#251F13] border border-[#4F3911] rounded-[20px] my-auto">
                    <div className="bg-white rounded-full w-[34px] h-[34px] my-auto"></div>
                    <button 
                    className="h-[24px] w-[24px] my-auto"
                    onClick={() => setMenuOpen(!menuOpen)}  >
                        <img src="src/components/images/Burger.svg" />
                    </button>
                </div>
            </div>
            </div>
        </nav>
    )
}