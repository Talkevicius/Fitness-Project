import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./EditModal.module.css";
import { Button } from "../Button/Button";

interface Field {
    key: string;            // key in the object
    label: string;          // label shown to user
    type?: "text" | "textarea"; // optional field type
}

interface EditModalProps {
    isOpen: boolean;
    initialValues: Record<string, any>; // can hold any keys/values
    fields: Field[];                    // which fields to render
    title: string;
    onSave: (updatedValues: Record<string, any>) => void;
    onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
                                                 isOpen,
                                                 initialValues,
                                                 fields,
                                                 title,
                                                 onSave,
                                                 onCancel
                                             }) => {
    const [values, setValues] = useState(initialValues);

    // Reset values whenever modal opens
    useEffect(() => {
        setValues(initialValues);
    }, [initialValues, isOpen]);

    if (!isOpen) return null;

    const handleChange = (key: string, value: any) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{title}</h2>

                {fields.map(field => (
                    <label key={field.key}>
                        {field.label}:
                        {field.type === "textarea" ? (
                            <textarea
                                className={styles.input}
                                value={values[field.key] ?? ""}
                                onChange={e => handleChange(field.key, e.target.value)}
                            />
                        ) : (
                            <input
                                className={styles.input}
                                type="text"
                                value={values[field.key] ?? ""}
                                onChange={e => handleChange(field.key, e.target.value)}
                            />
                        )}
                    </label>
                ))}

                <div className={styles.buttons}>
                    <Button variant="secondary" onClick={() => onSave(values)}>
                        Save
                    </Button>
                    <Button variant="tertiary" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditModal;
