import { motion } from "framer-motion";
import { Link } from "react-router";
import { useEffect, useRef } from "react";

type MobileMenuSelectionProps = {
  setMobileMenuOpen: (open: boolean) => void;
};

export const MobileMenuSelection: React.FC<MobileMenuSelectionProps> = ({ setMobileMenuOpen }) => {
  const buttonClass = 'w-[268px] h-[44px] rounded-[8px] p-2 gap-1 text-center border border-[#32363E] mx-auto';
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget as Node | null;

    if (!event.currentTarget.contains(nextFocusedElement)) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-0 w-[100vw] h-[100vh] bg-black"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className="absolute flex justify-center top-0 w-[100vw] h-[100vh]">
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -30, scaleY: 0.96 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          tabIndex={-1}
          onBlur={handleBlur}
          className="absolute flex flex-col gap-2 top-[80px] w-[288px] h-[382px] bg-[#16181D] outline-none"
        >
          <ul className="flex flex-col gap-1 h-[160px] border-b border-[#32363E]">

            <Link to="/" onClick={() => setMobileMenuOpen(false)}><li className={buttonClass + " mt-1"}>Home</li></Link>
            <Link to="/diary" onClick={() => setMobileMenuOpen(false)}><li className={buttonClass}>Diary</li></Link>
            <Link to="/kitchen" onClick={() => setMobileMenuOpen(false)}><li className={buttonClass}>Kitchen</li></Link>
          </ul>
          <ul className="flex flex-col h-[160px] gap-1 border-b border-[#32363E]">
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}><li className={buttonClass + " mt-1"}>Body metrics</li></Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}><li className={buttonClass}>Exercise Metrics</li></Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}><li className={buttonClass}>Settings</li></Link>
          </ul>
          <div className="flex w-[91px] ml-[90px] justify-between">
            <img src="src/components/images/Logout.svg" alt="Logout" />
            <p className="color-gray/30">Logout</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};