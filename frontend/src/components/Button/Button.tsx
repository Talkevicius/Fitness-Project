import { ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: ReactNode;
    onClick;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'default';
}

export function Button({ variant = 'default', children, onClick }: ButtonProps) {
    const extraStyles = styles[variant];

    return (
        <button type="button" className={`${styles.button} ${extraStyles}`} onClick={onClick}>
            {children}
        </button>
    );
}
