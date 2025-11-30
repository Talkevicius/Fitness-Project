import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategoryCard.module.css";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import EditModal from "../EditModal/EditModal";
import { Button } from "../Button/Button";
import { isAdmin } from "../../context/auth";

interface CategoryCardProps {
    id: number;
    muscleGroup: string;
    onDelete: (id: number) => void;
    onEdit: (id: number, newName: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, muscleGroup, onDelete, onEdit }) => {
    const navigate = useNavigate();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const admin = isAdmin();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        onDelete(id);
        setIsDeleteOpen(false);
    };

    const cancelDelete = () => setIsDeleteOpen(false);

    return (
        <>
            <div
                className={styles.categoryCard}
                onClick={() => navigate(`/categories/${id}`)}
            >
                <h2>{muscleGroup}</h2>

                {admin && (
                    <div className={styles.buttonRow}>
                        <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}>
                            Edit
                        </Button>

                        <Button variant="primary" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <EditModal
                isOpen={isEditOpen}
                initialValues={{ muscleGroup }}
                fields={[{ key: "muscleGroup", label: "Category Name" }]}
                title="Edit Category"
                onSave={(updatedValues) => {
                    onEdit(id, updatedValues.muscleGroup);
                    setIsEditOpen(false);
                }}
                onCancel={() => setIsEditOpen(false)}
            />
        </>
    );
};

export default CategoryCard;
