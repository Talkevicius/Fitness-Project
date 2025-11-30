import React, { useState } from "react";
import styles from "./EditModal.module.css";
import { Button } from "../Button/Button";

interface EditModalProps {
    isOpen: boolean;
    title?: string;
    initialValue: string;
    onSave: (value: string) => void;
    onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
                                                 isOpen,
                                                 title = "Edit",
                                                 initialValue,
                                                 onSave,
                                                 onCancel
                                             }) => {
    const [value, setValue] = useState(initialValue);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{title}</h2>

                <input
                    className={styles.input}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <div className={styles.buttons}>
                    <Button variant="secondary" onClick={() => onSave(value)}>
                        Save
                    </Button>

                    <Button variant="tertiary" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
