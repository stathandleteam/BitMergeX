import React, { Dispatch, Fragment, useState, useEffect, useRef, useCallback } from 'react'
import s from './customdropdown.module.scss';
import g from '@/styles/global.module.scss';
import useOutsideAlerter from '@/design-system/hooks/useOutsideAlerter';
import useWindowDimensions from '@/design-system/hooks/useWindowDimensions';
import useKeyScrollNoInput from '@/design-system/hooks/useKeyScrollNoInput';
import DropdownItem from './DropdownItem';

/**
 * Example Data
 * */
interface ItemProps {
  id: string;
  word: string;
}

export const items: ItemProps[] = [
  { id: "1", word: 'item 1' },
  { id: "2", word: 'item 2' },
  { id: "3", word: 'item 3' },
];

interface Props {
  items: ItemProps[];
  fieldName: string;
  totalFields?: number;
  index?: number;
  displayIndexInfo?: boolean;
  onChangeForm: Function;
  label?: string;
  setShow?: any;
  placeholder?: string;
  maxWidth?: string;
  minWidth?: string;
  height?: number;  /*
                    * Represent input height
                    */
  setShowMobileDropdown?: Dispatch<boolean>;
  showMobileDropdown?: boolean;
  mainFromProxyInput?: string;
  dropdownItemsPaddingTop?: number;
  dropdownContainerMarginTop?: string;
  className?: string;
  hasTextShortener?: boolean;
  onInputChange?: () => void
  /**
   * defaultValue can set initialValue of Input
   * It is an optional argument;
   * */
  defaultValue?: string;
  allowDirection?: boolean;
  // Function called when the input loses focus
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  // Add a className for dropdown input element
  inputClassName?: string;
  width?: string;
  /**
   * This should disable typing into the input element of the dropdown component
   * */
  disableOnchanged?: boolean;
  dropdownSide?: 'right' | 'bottom';
  autoDropdownPosition?: boolean;
  /**
   *  dropdown maximum height 
   * */
  maxHeight?: string;
  /**
   * align dropdown-item to left/right of the display input element
   * */  
  alignDropdownTo?: 'left'|'right';
  dropdownWidth?: number;

  children?: React.ReactNode
}

const CustomDropdown = ({children, items, fieldName, className, onChangeForm, setShow, mainFromProxyInput, dropdownItemsPaddingTop = 5, dropdownContainerMarginTop = '0px', hasTextShortener, onInputChange, defaultValue, allowDirection = false, onBlur, inputClassName, width, disableOnchanged = false, dropdownSide = 'bottom', maxHeight = "55vh", alignDropdownTo='left', dropdownWidth = 250 }: Props) => {

  const [filterState, setFilterState] = useState<ItemProps[]>([]);//items
  /**
   * show or hide dropdown
  */
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInput, setSelectedInput] = useState('');

  const [isMobileMedia, setIsMobileMedia] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // onChange(event);
    switch (event.keyCode) {
      // Enter pressed
      case 13:
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  const onFocusInput = (e: any) => {
    // Set selected index to zero at every new focus
    setFilterState(items);
    setShowDropdown(true);
  }

  const onClose = () => {
    // Set selected index to zero at every new focus
    setFilterState([]);
    setShowDropdown(false);
  }

  const onClickSelect = ({ target, currentTarget }: any) => {
    const { textContent } = target;
    setSelectedInput(textContent);
    setShowDropdown(false);
    setShow && setShow(true);

    const currentIndex = currentTarget.getAttribute('data-id')
    /**
     * Update App State from dropdown selection
     * */
    onChangeForm({ name: fieldName, value: textContent, item: items[currentIndex] });

  }

  const onClickSelect2 = useCallback((textContent: any, selectedItem: any) => {
    setSelectedInput(textContent);
    /**
     * Update App State from dropdown selection
     * */
    onChangeForm({ name: fieldName, value: textContent, item: selectedItem });
  }, [fieldName, onChangeForm])

  let typingTimeout: any;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 650px)");
    setIsMobileMedia(mediaQuery.matches);
    mediaQuery.addListener(() => setIsMobileMedia(mediaQuery.matches));
    return () => mediaQuery.removeListener(() => setIsMobileMedia(mediaQuery.matches));
  }, []);

  const onFocus = (e: any) => {

    //  setSelectedInput('');
    setFilterState([]);

    if (inputRef.current) {
      inputRef.current.focus();
    };

    if (isMobileMedia) {
      setShow && setShow(false);
    }

    onFocusInput(e);

  }

  /**
  * Outside - click enabled 
  * */

  const wrapperRef: any = useRef(null);

  // useOutsideAlerter({ ref: wrapperRef, setToggleMenu: setShowDropdown });

  /**
   * Proxy - main exchange functionality
   * */

  useEffect(() => {
    mainFromProxyInput && onClickSelect2(mainFromProxyInput, null);
  }, [mainFromProxyInput, onClickSelect2])

  const {handleKeyDown, handleSelection, focusedIndex } = useKeyScrollNoInput({onClickItem2: onClickSelect2, setSelectedWord:setSelectedInput, suggestionListing:filterState, dropdownRef, setShowDropdown, showDropdown});

  /**
   * Set/update default input value for dropdown
   * */
  useEffect(() => {
    defaultValue && setSelectedInput(defaultValue);
  }, [defaultValue]);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const [dropdownPositionsRight, setDropdownPositionsRight]: any = useState({});
  const [dropdownPositionsBottom, setDropdownPositionsBottom]: any = useState({});

  const handleHover = (event: any, itemId: string) => {
    if (itemId) {

      let { top, left, width, right, bottom, height } = event.currentTarget.getBoundingClientRect();

      const dropdownLeft = left + width; // Calculate the right end of the li

      setDropdownPositionsRight({ ...dropdownPositionsRight, [itemId]: { top, left: dropdownLeft } });
      setDropdownPositionsBottom({ ...dropdownPositionsBottom, [itemId]: { top: top + height, left: left } });
    }
    setHoveredItem(itemId);
  };

  const onMouseHover = (event: any) => {
    handleHover(event, fieldName)
  };

  const [containerWidth, setContainerWidth] = useState(0);

  const { width: widthDim } = useWindowDimensions()

  useEffect(() => {
    if (!wrapperRef?.current) return;
    let clientWidth: any = wrapperRef?.current?.clientWidth;
    clientWidth && setContainerWidth(clientWidth);

  }, [wrapperRef?.current?.clientWidth, widthDim])


  let dropdownPositions = dropdownPositionsRight;

  if (dropdownSide === 'bottom') {
    dropdownPositions = dropdownPositionsBottom;
  }

  const mainDropdownDisplayRef:any = useRef(null);

  useEffect(() => {
    setShow && setShow(showDropdown)
  }, [showDropdown])
  
  // const wrapperRef: any = useRef(null);

  useOutsideAlerter({ ref: wrapperRef, setToggleMenu: setShowDropdown, });

  return (

    <div ref={wrapperRef} className={`${s['dropdown-container']} ${s['input-clickable']} ${className}`} onKeyDown={handleKeyDown} style={{ marginTop: dropdownContainerMarginTop, width }} >
      <div className={s.dropdownToggle} onClick={(e) => { !showDropdown ? onFocus(e) : onClose() }} aria-expanded={showDropdown}>
        {children}
      </div>
      {/* {<div
        className={`${s['form_control']} ${s['input-clickable']} ${g['responsive_form']}`}
        style={{ zIndex: 200, background: showDropdown ? '#eee' : '', padding: "5px" }}
        onClick={(e) => { !showDropdown ? onFocus(e) : onClose() }}
        onMouseEnter={(event: any) => onMouseHover(event)}
        onKeyDown={handleKeyPress}
        ref = {mainDropdownDisplayRef}
      >
        <span style={{ display: 'flex', justifyContent: 'flex-start', padding: "0 10px 0 5px", }}>
          {!selectedInput ? <span style={{ color: '', }}> {placeholder} </span> : <span>{selectedInput}</span>}
        </span>
        <span className={s['up-down-icon']} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {
            showDropdown
              ? <IoCaretUp className={s["dropdown-small-caret-icon"]} onClick={() => setShowDropdown(false)} />
              : <IoCaretDown className={s["dropdown-small-caret-icon"]} onClick={(e:any) => onFocus(e)} />
          }
        </span>
      </div>}
 */}

      <div style={{ position: 'relative',width: 'fit-content', height: '100%',right:0 }} ref={dropdownRef}>
        <div  className={`${s['dropdown-items']} ${showDropdown ? s.show : ''}`} 
          style={{
            position: 'absolute',
            width: containerWidth > dropdownWidth ? containerWidth : dropdownWidth,
            color: '#000',
            transform: 'transformY(-100%)',
            maxHeight: showDropdown?maxHeight:'',
            marginTop: `${dropdownItemsPaddingTop}px`,
            left: alignDropdownTo === 'right'?'':0,
            right: alignDropdownTo === 'right'?`${-mainDropdownDisplayRef?.current?.clientWidth}px`:0 
          }}
          tabIndex={0}
          onScroll={e => e.stopPropagation()}
        >
          <div className={``} style={{ borderColor: 'white' }}>
          </div>
          <div className={g.scrollable} 
          onScroll={e => e.stopPropagation()}
        >
          {filterState.map((item, index) => (
            <Fragment key={index}>
              <DropdownItem
              
              key={item.id}
                keyId={index}
                className={s['dropdown-item']}
                textAlight = {alignDropdownTo}
                onClick={onClickSelect}
                focusedIndex={focusedIndex}
                handleSelection={handleSelection}
                text={item.word}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  </div>
    // </DetectOutsideClick>
  )
}

export default CustomDropdown;