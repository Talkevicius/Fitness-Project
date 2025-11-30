import React from "react";
import styles from "./ConfirmModal.module.css";
import {Button} from "../Button/Button.tsx";

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;  // The function to run on Yes
    onCancel: () => void;   // Close modal
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p>Are you sure you want to delete this?</p>
                <div className={styles.buttons}>
                    <Button variant="primary" onClick={onConfirm}>
                        Delete
                    </Button>

                    <Button variant="tertiary" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
