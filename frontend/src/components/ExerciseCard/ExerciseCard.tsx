import React, { useState } from "react";
import styles from "./ExerciseCard.module.css";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { Button } from "../Button/Button";
import { getUser, isAdmin } from "../../context/auth";
import EditModal from "../EditModal/EditModal.tsx";

export interface ExerciseCardProps {
    id: number;
    name: string;
    description?: string;
    categoryId: number;
    muscleGroup?: string;
    authorId: number;
    onDelete: (id: number) => void;
    onEdit: (exerciseData: { id: number; name: string; description?: string; categoryId: number }) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    id,
    name,
    description,
    categoryId,
    muscleGroup,
    authorId,
    onDelete,
    onEdit
}) => {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const user = getUser();
    const canEditOrDelete = isAdmin() || user?.id === authorId;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModalOpen(true);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditModalOpen(true);
    };

    const confirmDelete = () => {
        onDelete(id);
        setDeleteModalOpen(false);
    };

    const cancelDelete = () => setDeleteModalOpen(false);

    return (
        <div className={styles.exerciseCard}>
            <h2>{name}</h2>
            <p>Muscle Group: {muscleGroup ?? "Unknown"}</p>
            <p>{description}</p>

            {canEditOrDelete && (
                <div className={styles.cardButtons}>
                    <Button variant="secondary" onClick={handleEditClick}>Edit</Button>
                    <Button variant="primary" onClick={handleDeleteClick}>Delete</Button>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <EditModal
                isOpen={isEditModalOpen}
                initialValues={{
                    name: name,
                    description: description ?? ""
                }}
                fields={[
                    { key: "name", label: "Name" },
                    { key: "description", label: "Description", type: "textarea" }
                ]}
                title="Edit Exercise"
                onSave={(updatedValues) => {
                    onEdit({
                        id,
                        name: updatedValues.name,
                        description: updatedValues.description,
                        categoryId
                    });
                    setEditModalOpen(false);
                }}
                onCancel={() => setEditModalOpen(false)}
            />
        </div>
    );
};

export default ExerciseCard;
