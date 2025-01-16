import { stacksTransactionManager } from '@/app/services/stacks-transaction-manager';
import { validateStxAddress } from '@/app/services/stx-validate-address-and-amount';
import { useSTXTransaction } from '@/context/stxtransaction/STXTransactionContext';
import {useRef, useState, useEffect } from 'react';

export type FormDataType = Record<string, string|boolean|undefined>
// {
//     address: string;
//     amount?: string;
//     memo?: string;
//   }
  
export  type FormErrorsType = Record<string, string|undefined>
  
export const stxFormEmpty:any = {
    address: '',
      amount: '',
  }

const useTransfer = () => {

  const userRef = useRef<HTMLInputElement>(null);
  const errRef: any = useRef<HTMLInputElement>(null);
  const [errMsg, setErrMsg] = useState('');



  const [formData, setFormData] = useState<FormDataType>(stxFormEmpty);

  const [errors, setErrors] = useState<FormErrorsType>(stxFormEmpty);
  const [showAddress, setShowaddress] = useState(false);
  const [showAmount, setShowAmount] = useState(false);
  const { validateAddress } = useSTXTransaction();

  const { setstxTransferErrors } = useSTXTransaction();
  
  const handleOnBlur = async (event: React.FocusEvent<HTMLTextAreaElement>|React.FocusEvent<HTMLInputElement>)=>{
    
    const { name, value } = event.target;
    let newError = '';

    // if (!name) {
            
    //     newError = 'Address is required';
    // }  

    
    // else if (!validateStxAddress(name)) {
    //     newError = 'Invalid Address';
    // }

    // const { success, errors:errs } = await validateAddress(value)

    // if (!success && errs?.length){
    //     setErrors((errors) => ({...errors, [name]: errs[0] }));
    // } else {
    //     setErrors((errors)=>({...errors, [name]: '' }));
    // }


    // if (!name) return;

    // const extract_name =  name.split("_")[0]; // especially for address  
    const dataId = event.target.dataset.id
    let result: any;
        switch (dataId) {
            case 'amount':
                result = await validateAmount(parseInt(value))
                // if (!result.success && result.errors?.length){
                //   setstxTransferErrors(result.errors);
                // } else {
                //   setstxTransferErrors([]);
                // }        
                if (!result.success && result.errors?.length){
                    setErrors((errors) => ({...errors, [name]: result.errors[0] }));
                } else {
                    setErrors((errors)=>({...errors, [name]: '' }));
                }
            
                break;
            case 'address':
                result = await validateAddress(value)
                // if (!success && errs?.length){
                //   setstxTransferErrors(errs);
                // } else {
                //   setstxTransferErrors([]);
                // }
                if (!result.success && result.errors?.length){
                    setErrors((errors) => ({...errors, [name]: result.errors[0] }));
                } else {
                    setErrors((errors)=>({...errors, [name]: '' }));
                }
        
                break;

            default:
                break;
        }

  }

  const {  validateAmount } = useSTXTransaction();
  const [stxTransferErrors] = useState<string[]>([]);

  const handleOnFocus = async (event: React.FocusEvent<HTMLTextAreaElement>|React.FocusEvent<HTMLInputElement>)=>{
    const {name, value} = event.target;
    setErrors({...errors, [name]: ''})

    // if (!value) return;

    // const extract_name = name.split("_")[0]; // especially for address  

    // let result ;
    //     switch (extract_name) {
    //         case 'amount':
    //             result = await validateAmount(parseInt(value))
    //             if (!result.success && result.errors?.length){
    //               setstxTransferErrors(result.errors);
    //             } else {
    //               setstxTransferErrors([]);
    //             }        
    //             break;
    //         case 'address':
    //             if (!value) return;
    //             const { success, errors:errs } = await validateAddress(value)
    //             if (!success && errs?.length){
    //               setstxTransferErrors(errs);
    //             } else {
    //               setstxTransferErrors([]);
    //             }
        
    //             break;

    //         default:
    //             break;
    //     }
}

  const validateForm = (): boolean => {
        const newErrors: FormErrorsType = {
            address: '',
            amount: '',
            memo: ''
        };        

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }  
        // else if (formData.address && !validateStxAddress(formData?.address)) {
        //     newErrors.address = 'Invalid Address';
        // }

        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        setErrMsg('');
    }, [ formData.address]) 

    useEffect(() => {
        userRef.current?.focus();
    }, [])  

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (validateForm()) {

        console.log('Form submitted:', formData);
        // Handle form submission here
        try {
            //   const userData = await register({...formData}).unwrap();
            //   console.log("userData", userData);
            setFormData(stxFormEmpty);

            //   showNotification(userData.data.message, 'top-right', 'default', 100000);


            // navigate(from, {replace: true});

        } catch (err: any) {
            console.log("err", err)
            if ( 'errors' in err.data){
                if (err?.data?.errors?.length > 0){
                    //   err.data.errors.map((data: { message: string; }, index: any)=>
                    //     showNotification(data.message, 'top-right', 'urgent', 100000)
                    // )

                } else {
                    
                    //   showNotification(err.data.errors.message, 'top-right', 'urgent', 100000)
                }
            } else {
                setErrMsg(err.data.message)
                //   showNotification(err.data.message, 'top-right', 'urgent');

            }

            errRef?.current?.focus();

        }
            
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev: FormDataType) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCheckboxChange = ({ name, checked }: { name: string; checked: boolean }) => {
        setFormData(prev => ({
        ...prev,
        [name]: checked
        }));
    };
        
    return {
        formData,  
        handleInputChange,
        errors,
        showAddress, 
        setShowaddress,
        errMsg,
        userRef,
        errRef,
        // handleSubmit,
        // isLoading,
        showAmount, 
        setShowAmount,
        handleCheckboxChange,
        setFormData,
        validateForm,
        setErrMsg,
        handleOnBlur,
        handleOnFocus
    }
  
}

export default useTransfer