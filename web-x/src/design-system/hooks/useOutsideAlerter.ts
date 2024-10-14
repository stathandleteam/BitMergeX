import { useRef, useEffect, ReactNode } from "react";

/**
  * Hook that alerts clicks outside of the passed ref
 */
interface Props{
  ref?: any;
  setToggleMenu: Function;
}

function useOutsideAlerter({ref, setToggleMenu}: Props) {

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    
    function handleClickOutside(event: { target: any; }) {
      if (ref.current && !ref.current.contains(event.target)) {
        setToggleMenu(false);
      }

      
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}



export default useOutsideAlerter;