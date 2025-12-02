import React, { useState } from "react";
import styles from './CommentCard.module.css';
//import png1 from "../../../dist/assets/user-B6VgKBmo.png";
import png from "../../assets/user.png"
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import EditModal from "../EditModal/EditModal";
import { isAdmin, getUser } from "../../context/auth";

interface CommentCardProps {
    id: number;
    username: string;
    content: string;
    userId: number;
    onDelete: (id: number) => void;
    onEdit: (id: number, newContent: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ id, username, content, userId, onDelete, onEdit }) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const currentUser = getUser();
    const admin = isAdmin();

    // Only show edit/delete buttons if current user is admin or the comment owner
    const canEditOrDelete = admin || (currentUser?.id === userId);

    return (
        <>
            <div className={styles.commentContainer}>
                <div className={styles.photoContainer}>
                    <img src={png} alt="user avatar" />
                </div>
                <div className={styles.contentContainer}>
                    <h5>{username}</h5>
                    <p>{content}</p>
                </div>
                {canEditOrDelete && (
                    <div className={styles.actions}>
                        <button onClick={() => setIsEditOpen(true)}>Edit</button>
                        <button onClick={() => setIsDeleteOpen(true)}>Delete</button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onConfirm={() => {
                    onDelete(id);
                    setIsDeleteOpen(false);
                }}
                onCancel={() => setIsDeleteOpen(false)}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={isEditOpen}
                title="Edit Comment"
                initialValues={{ content }}
                fields={[{ key: "content", label: "Comment", type: "textarea" }]}
                onSave={(values) => {
                    onEdit(id, values.content);
                    setIsEditOpen(false);
                }}
                onCancel={() => setIsEditOpen(false)}
            />

        </>
    );
};

export default CommentCard;
