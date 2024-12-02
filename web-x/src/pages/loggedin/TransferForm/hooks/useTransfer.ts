import { validateStxAddress } from '@/app/services/stx-validate-address-and-amount';
import {useRef, useState, useEffect } from 'react';

interface FormData {
    address: string;
    amount?: string;
    memo?: string;
  }
  
  interface FormErrors {
    address: string;
    amount: string;
    memo: string;

  }
  
const useTransfer = () => {

  const userRef = useRef<HTMLInputElement>(null);
  const errRef: any = useRef<HTMLInputElement>(null);
  const [errMsg, setErrMsg] = useState('');

  const formEmpty:any = {
    address: '',
      amount: '',
  }

  const [formData, setFormData] = useState<FormData>(formEmpty);

  const [errors, setErrors] = useState<FormErrors>();
  const [showAddress, setShowaddress] = useState(false);
  const [showAmount, setShowAmount] = useState(false);

  const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            address: '',
            amount: '',
            memo: ''
        };        

        if (!formData.address) {
            
            newErrors.address = 'Address is required';
        }  
        else if (!validateStxAddress(formData.address)) {
            newErrors.address = 'Invalid Address';
        }

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
            setFormData(formEmpty);

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
        setFormData(prev => ({
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
    }
  
}

export default useTransfer