import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./EditModal.module.css";
import { Button } from "../Button/Button";

export interface Field {
    key: string;
    label: string;
    type?: "text" | "textarea" | "number" | "select";
    options?: { value: string | number; label: string }[]; // for select
}

interface EditModalProps {
    isOpen: boolean;
    title: string;
    fields: Field[];
    initialValues: Record<string, any>; // dynamic values
    onSave: (values: Record<string, any>) => void;
    onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    title,
    fields,
    initialValues,
    onSave,
    onCancel
}) => {
    const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

    useEffect(() => {
        setFormValues(initialValues); // reset when modal opens
    }, [initialValues, isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{title}</h2>

                {fields.map((field) => {
                    const value = formValues[field.key] ?? "";

                    if (field.type === "textarea") {
                        return (
                            <textarea
                                key={field.key}
                                value={value}
                                className={styles.input}
                                onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
                                placeholder={field.label}
                            />
                        );
                    } else if (field.type === "select" && field.options) {
                        return (
                            <select
                                key={field.key}
                                value={value}
                                className={styles.input}
                                onChange={(e) => setFormValues({ ...formValues, [field.key]: Number(e.target.value) })}
                            >
                                {field.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        );
                    } else {
                        return (
                            <input
                                key={field.key}
                                type={field.type || "text"}
                                className={styles.input}
                                value={value}
                                onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
                                placeholder={field.label}
                            />
                        );
                    }
                })}

                <div className={styles.buttons}>
                    <Button variant="secondary" onClick={() => onSave(formValues)}>Save</Button>
                    <Button variant="tertiary" onClick={onCancel}>Cancel</Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditModal;
