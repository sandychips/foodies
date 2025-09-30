import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipeById } from '../services/api';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetchRecipeById(id);
        setRecipe(response.data.recipe);
      } catch (err) {
        setError('Failed to load recipe');
        console.error('Error loading recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: 'var(--font-size-body-large)'
      }}>
        Loading recipe...
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: 'var(--font-size-body-large)',
        color: 'var(--color-error)'
      }}>
        {error || 'Recipe not found'}
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-8) 0' }}>
      <div style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
        {/* Back Button */}
        <Link
          to="/recipes"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-6)',
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-body-small)'
          }}
        >
          ← Back to recipes
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
          {/* Recipe Image */}
          <div>
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: 'var(--border-radius-2xl)'
                }}
              />
            )}
          </div>

          {/* Recipe Info */}
          <div>
            <h1 style={{
              fontSize: 'var(--font-size-h1)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-4)'
            }}>
              {recipe.title}
            </h1>

            <div style={{
              display: 'flex',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--font-size-body-small)',
              color: 'var(--color-gray-600)'
            }}>
              <span>Category: {recipe.category?.name}</span>
              <span>Area: {recipe.area?.name}</span>
              {recipe.time && <span>⏱️ {recipe.time} minutes</span>}
            </div>

            {recipe.description && (
              <p style={{
                fontSize: 'var(--font-size-body-large)',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 'var(--space-6)',
                color: 'var(--color-gray-700)'
              }}>
                {recipe.description}
              </p>
            )}

            {/* Recipe Owner */}
            {recipe.owner && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-gray-50)',
                borderRadius: 'var(--border-radius-lg)',
                marginBottom: 'var(--space-6)'
              }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-gray-200)',
                    backgroundImage: recipe.owner.avatar ? `url(${recipe.owner.avatar})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-h4)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-gray-600)'
                  }}
                >
                  {!recipe.owner.avatar && recipe.owner.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{
                    fontSize: 'var(--font-size-body-large)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-gray-900)',
                    margin: 0
                  }}>
                    <span
                      onClick={() => window.location.href = `/user/${recipe.owner.id}`}
                      style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                    >
                      {recipe.owner.name}
                    </span>
                  </p>
                  <p style={{
                    fontSize: 'var(--font-size-body-small)',
                    color: 'var(--color-gray-500)',
                    margin: 0
                  }}>
                    Recipe creator
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 && (
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-h2)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-4)'
            }}>
              Ingredients
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-3)'
            }}>
              {recipe.recipeIngredients.map((recipeIngredient) => (
                <div
                  key={recipeIngredient.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--color-gray-50)',
                    borderRadius: 'var(--border-radius-lg)'
                  }}
                >
                  <span style={{ fontSize: 'var(--font-size-body-large)' }}>•</span>
                  <span>{recipeIngredient.ingredient?.name}</span>
                  {recipeIngredient.measure && (
                    <span style={{
                      color: 'var(--color-gray-600)',
                      fontSize: 'var(--font-size-body-small)'
                    }}>
                      ({recipeIngredient.measure})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && (
          <div>
            <h2 style={{
              fontSize: 'var(--font-size-h2)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-4)'
            }}>
              Instructions
            </h2>
            <div style={{
              fontSize: 'var(--font-size-body-large)',
              lineHeight: 'var(--line-height-relaxed)',
              color: 'var(--color-gray-700)',
              whiteSpace: 'pre-line'
            }}>
              {recipe.instructions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;