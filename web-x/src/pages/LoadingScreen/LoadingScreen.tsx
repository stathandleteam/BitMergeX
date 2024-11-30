import Loading from '@/design-system/_components/Loading/Loading';
import styles  from './LoadingScreen.module.scss'

interface Props {
  id?: string;
}

const LoadingScreen = ({ id }: Props) => {


  return (
    <div className={styles['home-page']}>
      <div className={styles['body']}>
        <Loading />
      </div>
    </div>
  )
}

export default LoadingScreen