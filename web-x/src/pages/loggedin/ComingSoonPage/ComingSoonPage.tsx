// src/pages/ComingSoonPage.tsx
import styles from './ComingSoonContent.module.scss';
import ScreenWrapper from '@/pages/ScreenWrapper/ScreenWrapper';
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { useRouter } from '@/context/routing/RouterContext';
import { ROUTES } from '@/context/routing/constants';
import Logo from '@/design-system/_components/Logo/Logo';
import ComingSoonContent from './ComingSoonContent';

interface Props {
  pageHeading: string;
  showBackIcon?: boolean;
}

const ComingSoonPage = (props: Props) => {

  return (
    <ScreenWrapper>

        <ComingSoonContent {...props} />

    </ScreenWrapper>
  );
};

export default ComingSoonPage;