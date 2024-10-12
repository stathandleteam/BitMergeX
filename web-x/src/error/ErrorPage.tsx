import { useNavigate } from "react-router-dom";
import s from "./errorPage.module.scss";
import g from '@/styles/global.module.scss';
import { Button } from "@/design-system/_components/Button/Button";
import PrefetchLink from "@/design-system/_components/Links/PrefetchLink";

const ErrorPage = ({message = "Go to Booth Page"}:{message?: string})=> {

  const navigate = useNavigate();
    return (
      <div className={s.pageContainer}>
        <div className={`${s.errorContainer} ${g.responsive_form}`}>
          <h1 className={`${s.errorCode}`}  >404</h1>
          <p className={s.errorInfo}>
            This Page Isn't Available
          </p>
          <p className={s.errorHelp}>
            This link may be broken, or the page may have been removed. Check to see if the link you're trying to open is correct
          </p>

          <Button variant='secondary' color="black" onClick={() => navigate(-1)} >
          {message}
          </Button> 

          {/* <button  className={`${g.button} ${g.borderBtn} ${g.shadow_on_hover} `} style = {{width : width > 650 ? '50%': '100%', height: 40 }} >Go to Booth Page</button> */}

          <PrefetchLink to="/">
            <span className={`${s.errorBtn}`} color="secondary-red">
              Back to Home
            </span>
          </PrefetchLink>
          <PrefetchLink to="/">
            <span className={`${s.errorBtn} r`} color="secondary-red">
              Visit Help Center
            </span>
          </PrefetchLink>

        </div>
      </div>
    );
}

export default ErrorPage;
