import s from "./errorPage.module.scss";
import g from '@/styles/global.module.scss';
import { TbHomeCancel } from "react-icons/tb";
import { Button } from "@/design-system/_components/Button/Button";
import PrefetchLink from "../design-system/_components/Links/PrefetchLink";


const SomethingWentWrong = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {


  return (
    <div className={s.pageContainer}>
      <div className={`${s.errorContainer} ${g.responsive_form}`}>
        <h1 className={`${s.errorCode}`} ><TbHomeCancel /></h1>

        <p className={s.errorInfo}>
          Something went wrong
        </p>
        <p className={s.errorHelp}>
          Something went wrong. Try clicking the refresh page button to reload the
          application.{' '}
        </p>

        <Button fullWidth variant="primary" onClick={resetErrorBoundary} >
            Refresh page
        </Button>

        <PrefetchLink to="/" onClick={() => window.location.href = '/'}>
          <span className={`${s.errorBtn}`} color="secondary-red">
            Back to Home
          </span>

        </PrefetchLink>
        <PrefetchLink to="/" onClick={() => window.location.href = '/'}>
          <span className={`${s.errorBtn}`} color="secondary-red">
            Visit Help Center
          </span>
        </PrefetchLink>

      </div>
    </div>
  );
}

export default SomethingWentWrong;