import styles from './BackIcon.module.scss'

const BackIcon = ({ onClick }: { onClick: () => void }): JSX.Element => {
    return (
            <svg onClick={onClick} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                d="M15 8H1M1 8L8 1M1 8L8 15"
                stroke="#6E6E6E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
    );
  };

export default BackIcon