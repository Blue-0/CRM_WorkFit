import React, { useState, useEffect, useRef } from 'react';
import { Icon } from "@iconify/react";

const FoodSearchAutocomplete = ({ value, onChange, onSelect }) => {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Mettre à jour la valeur locale si la prop change (ex: édition)
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Appel API OpenFoodFacts
  useEffect(() => {
    const searchFood = async () => {
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`);
        const data = await response.json();

        if (data.products) {
          const formattedResults = data.products
            .filter(p => p.product_name) // Seulement ceux qui ont un nom
            .map(p => ({
              product_id: p.id || p.code,
              item_text: p.product_name + (p.brands ? ` - ${p.brands}` : ''),
              image_url: p.image_front_thumb_url || p.image_thumb_url || '',
              calories: p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal'] || null,
              proteins: p.nutriments?.['proteins_100g'] || p.nutriments?.['proteins'] || null,
              carbohydrates: p.nutriments?.['carbohydrates_100g'] || p.nutriments?.['carbohydrates'] || null,
              fats: p.nutriments?.['fat_100g'] || p.nutriments?.['fat'] || null,
              unit: 'g',
              quantity: 100 // Par défaut on propose 100g
            }));
          setResults(formattedResults);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche sur OpenFoodFacts", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchFood();
    }, 400); // 400ms de délai de frappe avant l'appel

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val); // Notifier le parent pour la saisie libre
    setIsOpen(true);
  };

  const handleSelect = (product) => {
    setQuery(product.item_text);
    setIsOpen(false);
    onSelect(product);
  };

  return (
    <div className="position-relative w-100" ref={wrapperRef}>
      <input
        type="text"
        className="form-control radius-8 flex-grow-1"
        placeholder="Aliment (ex: Pomme, Pâtes Panzani...)"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
      />
      {loading && (
        <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-primary-light">
          <Icon icon="eos-icons:loading" width="20" height="20" />
        </span>
      )}

      {isOpen && query.length > 0 && (
        <ul className="dropdown-menu show w-100 shadow-sm p-0 position-absolute mt-1 z-index-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {results.length > 0 ? (
            results.map((product, idx) => (
              <li
                key={`${product.product_id}-${idx}`}
                className="dropdown-item d-flex align-items-center gap-12 py-8 px-12 border-bottom cursor-pointer"
                onClick={() => handleSelect(product)}
                style={{ cursor: 'pointer' }}
              >
                {product.image_url ? (
                  <img src={product.image_url} alt={product.item_text} className="radius-4" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                ) : (
                  <div className="bg-neutral-200 radius-4 d-flex justify-content-center align-items-center text-neutral-500" style={{ width: 40, height: 40 }}>
                    <Icon icon="mdi:food-apple" width="20" height="20" />
                  </div>
                )}

                <div className="flex-grow-1 overflow-hidden">
                  <h6 className="text-sm fw-medium mb-0 text-truncate">{product.item_text}</h6>
                  <div className="text-xs text-primary-light mt-4 d-flex gap-8 flex-wrap">
                    {product.calories !== null ? (
                      <span className="bg-primary-50 text-primary-600 px-8 py-2 radius-4">{Math.round(product.calories)} kcal/100g</span>
                    ) : (
                      <span className="text-neutral-400">Pas d'infos nutritionnelles</span>
                    )}
                    {product.proteins !== null && <span className="text-neutral-500">P: {Math.round(product.proteins)}g</span>}
                    {product.carbohydrates !== null && <span className="text-neutral-500">G: {Math.round(product.carbohydrates)}g</span>}
                    {product.fats !== null && <span className="text-neutral-500">L: {Math.round(product.fats)}g</span>}
                  </div>
                </div>
              </li>
            ))
          ) : (
            !loading && query.length >= 3 && (
              <li className="dropdown-item py-12 px-16 text-center text-primary-light d-flex flex-column align-items-center gap-8">
                <Icon icon="mdi:database-search-outline" width="24" height="24" className="text-neutral-400" />
                <div>
                  <span className="d-block text-sm fw-medium text-neutral-600">Produit introuvable sur OpenFoodFacts</span>
                  <span className="d-block text-xs mt-2">Votre saisie manuelle <strong>"{query}"</strong> sera tout de même enregistrée.</span>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default FoodSearchAutocomplete;
