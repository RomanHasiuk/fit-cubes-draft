import type React from "react";

type MobileMenuProps = {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
};


export const MobileMenu: React.FC<MobileMenuProps> = ({ setMobileMenuOpen, mobileMenuOpen }) => {
    return (
        <nav className="flex justify-between fixed h-[62px] w-full z-50 bg-black">
            <img className="w-[46px] h-[46px] my-auto" src="src/components/images/Logo.svg" alt="Logo" />
            <div className="flex justify-between w-[178px] h-[46px] my-auto mr-2">
                <img src="src/components/images/Language.svg" alt="" />
                <div className="flex justify-evenly w-[90px] h-[46px] bg-[#251F13] border border-[#4F3911] rounded-[20px] my-auto">
                    <div className="bg-white rounded-full w-[34px] h-[34px] my-auto"></div>
                    <button 
                    className="h-[24px] w-[24px] my-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}  >
                        <img src="src/components/images/Burger.svg" />
                    </button>
                </div>
            </div>
        </nav>
    )
}