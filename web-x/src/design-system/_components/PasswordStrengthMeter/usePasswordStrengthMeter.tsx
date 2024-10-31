import React, { useState, useEffect } from 'react';
import { FaLock } from 'react-icons/fa';
import styles from './usePasswordStrengthMeter.module.scss';

const usePasswordStrengthMeter = ({password, setPassword}: {password: string, setPassword:Function}) => {
//   const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  const calculateStrength = (pass: string): number => {
    let score = 0;
    
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    return Math.min(score, 4);
  };

  const getStrengthLabel = (score: number): string => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const getStrengthColor = (score: number): string => {
    switch (score) {
      case 0: return styles.veryWeak;
      case 1: return styles.weak;
      case 2: return styles.fair;
      case 3: return styles.good;
      case 4: return styles.strong;
      default: return '';
    }
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.inputWrapper}>
//         <FaLock className={styles.icon} />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className={styles.input}
//           placeholder="Enter password"
//         />
//       </div>
      
//       <div className={styles.strengthMeter}>
//         <div className={styles.strengthLabel}>
//           <span>Strength:</span>
//           <span className={getStrengthColor(strength)}>
//             {getStrengthLabel(strength)}
//           </span>
//         </div>
//         <div className={styles.strengthBar}>
//           <div 
//             className={`${styles.strengthProgress} ${getStrengthColor(strength)}`}
//             style={{ width: `${(strength / 4) * 100}%` }}
//           />
//         </div>
//       </div>
      
      // <ul className={styles.requirements}>
      //   <li className={password.length >= 8 ? styles.met : ''}>
      //     • At least 8 characters
      //   </li>
      //   <li className={/[A-Z]/.test(password) ? styles.met : ''}>
      //     • At least one uppercase letter
      //   </li>
      //   <li className={/[a-z]/.test(password) ? styles.met : ''}>
      //     • At least one lowercase letter
      //   </li>
      //   <li className={/[0-9]/.test(password) ? styles.met : ''}>
      //     • At least one number
      //   </li>
      //   <li className={/[^A-Za-z0-9]/.test(password) ? styles.met : ''}>
      //     • At least one special character
      //   </li>
      //  </ul>
//     </div>
//   );

  return {
    strength,
    strengthLabel: getStrengthLabel(strength),
    strengthColor: getStrengthColor(strength)
  };
};

export default usePasswordStrengthMeter;