import { useLocation, useNavigate } from 'react-router-dom';
import sprite from '@/assets/img/sprite.svg';
import css from './RecipePreview.module.css';

const RecipePreview = ({
    recipe, onDelete = () => {
    }
}) => {
    const navigate = useNavigate();
    const { id, title, description, thumb } = recipe;
    const { pathname } = useLocation();

    return (
        <div className={css.card}>
            <img src={thumb} alt={title} className={css.image} />
            <div className={css.content}>
                <h3 className={css.title}>{title}</h3>
                <p className={css.description}>{description}</p>
            </div>
            <div className={css.actions}>
                <button
                    type="button"
                    className={css.actionButton}
                    aria-label="Open recipe"
                    onClick={() => {
                        let path = `recipe/${id}`;
                        if (pathname.includes('user')) {
                            path = `${pathname}/${path}`;
                        }
                        navigate(path);
                    }
                    }
                >
                    <svg className={css.icon}>
                        <use href={`${sprite}#icon-arrow`} />
                    </svg>
                </button>
                <button
                    type="button"
                    className={css.actionButton}
                    aria-label="Delete recipe"
                    onClick={() => onDelete(id)}>
                    <svg className={css.icon}>
                        <use href={`${sprite}#icon-trash`} />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default RecipePreview;
