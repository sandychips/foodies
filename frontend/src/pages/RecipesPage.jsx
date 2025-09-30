import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchRecipes } from '../services/api';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const location = useLocation();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);

        // Parse URL search parameters
        const urlParams = new URLSearchParams(location.search);
        const queryParams = {};

        // Add category filter if present
        if (urlParams.get('category')) {
          queryParams.category = urlParams.get('category');
        }

        const response = await fetchRecipes(queryParams);
        setRecipes(response.data.recipes || []);

        // Set category name for filtered results
        if (queryParams.category && response.data.recipes && response.data.recipes.length > 0) {
          setCategoryName(response.data.recipes[0].category?.name || '');
        } else {
          setCategoryName('');
        }
      } catch (err) {
        setError('Failed to load recipes');
        console.error('Error loading recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [location.search]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: 'var(--font-size-body-large)'
      }}>
        Loading recipes...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: 'var(--font-size-body-large)',
        color: 'var(--color-error)'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-8) 0' }}>
      <div style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <h1 style={{
          fontSize: 'var(--font-size-h1)',
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--space-8)',
          textAlign: 'center'
        }}>
          {categoryName ? `${categoryName} Recipes` : 'All Recipes'}
        </h1>

        {recipes.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-gray-600)' }}>
            No recipes found.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block'
                }}
              >
                <div
                  style={{
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--border-radius-2xl)',
                    backgroundColor: 'var(--color-white)',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                {/* Recipe Image */}
                {recipe.image && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div style={{ padding: 'var(--space-4)' }}>
                  {/* Recipe Title */}
                  <h3 style={{
                    fontSize: 'var(--font-size-h4)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginBottom: 'var(--space-2)',
                    lineHeight: '1.2'
                  }}>
                    {recipe.title}
                  </h3>

                  {/* Recipe Meta Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-3)',
                    fontSize: 'var(--font-size-body-small)',
                    color: 'var(--color-gray-600)'
                  }}>
                    <span>Category: {recipe.category?.name || 'Unknown'}</span>
                    {recipe.time && (
                      <span>⏱️ {recipe.time} min</span>
                    )}
                  </div>

                  {/* Recipe Description */}
                  {recipe.description && (
                    <p style={{
                      color: 'var(--color-gray-700)',
                      fontSize: 'var(--font-size-body-small)',
                      lineHeight: 'var(--line-height-relaxed)',
                      marginBottom: 'var(--space-3)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {recipe.description}
                    </p>
                  )}

                  {/* Recipe Owner Info */}
                  {recipe.owner && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/user/${recipe.owner.id}`;
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        paddingTop: 'var(--space-3)',
                        borderTop: '1px solid var(--color-gray-100)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-gray-200)',
                          backgroundImage: recipe.owner.avatar ? `url(${recipe.owner.avatar})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--font-size-body-small)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-gray-600)'
                        }}
                      >
                        {!recipe.owner.avatar && recipe.owner.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{
                          fontSize: 'var(--font-size-body-small)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-gray-900)',
                          margin: 0
                        }}>
                          {recipe.owner.name}
                        </p>
                        <p style={{
                          fontSize: 'var(--font-size-body-xs)',
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;