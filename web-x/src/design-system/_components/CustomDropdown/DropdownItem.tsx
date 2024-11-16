import React, { MouseEventHandler, useEffect, useRef } from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    focusedIndex: number;
    keyId: number | string;
    handleSelection: Function;
    onClick: MouseEventHandler<HTMLDivElement>;
    text: string;
    className: string;
    hasSection?: boolean;
    showSelectedActiveOnly?: boolean;
    textAlight?: 'left' | 'right';
}

const DropdownItem: React.FC<Props> = ({textAlight = 'left', focusedIndex, keyId, handleSelection, onClick, text, className, hasSection, showSelectedActiveOnly = false, ...rest }) => {

    const resultContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {

        if (!resultContainer.current) return;

        // resultContainer.current.scrollIntoView({
        //     block: "center",
        // })

        

    }, [focusedIndex])

    const disabled = showSelectedActiveOnly && (keyId !== focusedIndex);

    const disabledFilterColor = '#aaa';

    const color = disabled ? disabledFilterColor : undefined;

    return (
        <div
            ref={keyId === focusedIndex ? resultContainer : null}
            data-id={keyId}
            onMouseDown={disabled ? () => { } : () => handleSelection(keyId)}
            style=
            {{
                position: "relative",
                // color: keyId === focusedIndex ? 'white' : color,
                color,
                backgroundColor: keyId === focusedIndex ? 'rgba(0,0,0,0.1)' : "",
                // width: '100%',
                // padding: '10px',
                padding: '10px 15px 10px 15px',

                paddingLeft: hasSection ? '20px' : '10px',
                alignItems: textAlight,
                display: 'flex',
                justifyContent: textAlight === 'left'? 'flex-start' : 'flex-end'
            }}
            onClick={onClick}
            className={className}
        >
            <span>{text}</span>
        </div>
    )
}

export default DropdownItem;