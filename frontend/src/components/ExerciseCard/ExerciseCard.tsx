import React, { useState } from "react";
import styles from "./ExerciseCard.module.css";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { Button } from "../Button/Button";
import { getUser, isAdmin } from "../../context/auth";
import EditModal from "../EditModal/EditModal.tsx";
import { useNavigate } from "react-router-dom";

export interface ExerciseCardProps {
    id: number;
    name: string;
    description?: string;
    categoryId: number;
    muscleGroup?: string;
    authorId: number;
    authorName?: string;
    onDelete: (id: number) => void;
    onEdit: (exerciseData: { id: number; name: string; description?: string; categoryId: number }) => void;
    hideActions?: boolean; // new prop
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    id,
    name,
    description,
    categoryId,
    muscleGroup,
    authorId,
    authorName,
    onDelete,
    onEdit,
    hideActions = false // default false
}) => {

    const navigate = useNavigate();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const user = getUser();
    const canEditOrDelete = !hideActions && (isAdmin() || user?.id === authorId);

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

    console.log("User ID:", user?.id, typeof user?.id);
    console.log("Author ID:", authorId, typeof authorId);
    console.log("Is Admin:", isAdmin());
    console.log("Can Edit or Delete:", canEditOrDelete);
    return (
        <div className={styles.exerciseCard}
             onClick={() => navigate(`/exercises/${id}/comments`)}>
            <h2>{name}</h2>
            <p className={styles.authorText}>
                This post was created by: <strong>{authorName ?? "Unknown"}</strong>
            </p>

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
