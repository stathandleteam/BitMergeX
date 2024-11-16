// EditableName.tsx
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './EditableName.module.scss';
import AvatarGroup from '@/design-system/_components/AvatarGroup/AvatarGroup';

interface EditableNameProps {
  name: string;
  onUpdateName: (newName: string) => void;
  startEditting: boolean;
  setStartEditting: Dispatch<SetStateAction<boolean>>
  className?: string;
}
  
const EditableName: React.FC<EditableNameProps> = ({ className, name, onUpdateName, setStartEditting, startEditting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    setStartEditting(false);
    if (editableName !== name) {
      onUpdateName(editableName); // Update name if it has changed
    }
  };

  useEffect(() => {
    setIsEditing(startEditting)
  }, [startEditting])
  
  useEffect(() => {
    setEditableName(name)
  }, [name])
  

  return (
      

      isEditing ? (
        <input
          type="text"
          className={`${styles.nameInput} ${className}`}
          value={editableName}
          onChange={(e) => setEditableName(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (

        <span className={`${className} ${styles.truncate}`} tabIndex={0}>{name}</span>
       
      )

  );
};

export default EditableName;