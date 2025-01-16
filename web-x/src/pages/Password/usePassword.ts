import {useRef, useState, useEffect } from 'react';

interface FormData {
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    password?: string;
    confirmPassword?: string;
}

const usePassword = () => {

    const userRef = useRef<HTMLInputElement>(null);
    const errRef: any = useRef<HTMLInputElement>(null);
    const [errMsg, setErrMsg] = useState('');

    const formEmpty = {
        password: '',
        confirmPassword: '',
    }

    const [formData, setFormData] = useState<FormData>(formEmpty);

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = (option = {shouldConfirmPassword: true}): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (option?.shouldConfirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        setErrMsg('');
    }, [formData.password])

    useEffect(() => {
        userRef.current?.focus();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (validateForm()) {

            // Handle form submission here
            try {
                //   const userData = await register({...formData}).unwrap();
                setFormData(formEmpty);

                //   showNotification(userData.data.message, 'top-right', 'default', 100000);


                // await navigate(from, {replace: true});

            } catch (err: any) {
                if ('errors' in err.data) {
                    if (err?.data?.errors?.length > 0) {
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
        showPassword,
        setShowPassword,
        errMsg,
        userRef,
        errRef,
        // handleSubmit,
        // isLoading,
        showConfirmPassword,
        setShowConfirmPassword,
        handleCheckboxChange,
        setFormData,
        validateForm,
        setErrMsg,
    }

}

export default usePassword