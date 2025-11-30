import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategoryCard.module.css";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import EditModal from "../EditModal/EditModal.tsx";
import { Button } from "../Button/Button";
import { getUser, isAdmin } from "../../context/auth";

interface CategoryCardProps {
    id: number;
    muscleGroup: string;
    onDelete: (id: number) => void;
    onEdit: (id: number, newName: string) => void; // add this
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, muscleGroup, onDelete,onEdit }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const admin = isAdmin();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent navigating
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        onDelete(id);
        setIsModalOpen(false);
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/categories/${id}/edit`);
    };

    return (
        <>
            <div
                className={styles.categoryCard}
                onClick={() => navigate(`/categories/${id}`)}
            >
                <h2>{muscleGroup}</h2>

                {/* BUTTON ROW */}
                {admin && (
                    <div className={styles.buttonRow}>
                        <Button variant="secondary" onClick={(e) => {
                            e.stopPropagation();
                            setIsEditOpen(true);
                        }}>
                            Edit
                        </Button>

                        <Button variant="primary" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            <EditModal
                isOpen={isEditOpen}
                initialValue={muscleGroup}
                title="Edit Category"
                onSave={(newValue) => {
                    onEdit(id, newValue);   // <-- this calls the parent function
                    setIsEditOpen(false);
                }}
                onCancel={() => setIsEditOpen(false)}
            />
        </>
    );
};

export default CategoryCard;
