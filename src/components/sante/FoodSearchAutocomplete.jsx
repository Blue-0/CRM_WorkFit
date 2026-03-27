import React, { useState, useEffect, useRef } from 'react';
import { Icon } from "@iconify/react";

const searchCache = {}; // Cache local pour optimiser la latence (mémoire)

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
    const trimmedQuery = query.trim().toLowerCase();

    // Si la recherche est vide ou moins de 3 caractères
    if (!trimmedQuery || trimmedQuery.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Si on a déjà cherché ce terme, on utilise le cache
    if (searchCache[trimmedQuery]) {
      setResults(searchCache[trimmedQuery]);
      setLoading(false);
      return;
    }

    // Sinon, on lance le chargement
    setLoading(true);

    const searchFood = async () => {
      try {
        // Ajout de lc=fr et cc=fr pour cibler plus vite la base fr, json=1 et fields précis pour réduire la taille de la réponse
        const fields = 'id,code,product_name,brands,image_front_thumb_url,image_thumb_url,nutriments';
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(trimmedQuery)}&search_simple=1&action=process&json=1&page_size=15&lc=fr&cc=fr&fields=${fields}`);
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

          searchCache[trimmedQuery] = formattedResults; // Mise en cache
          setResults(formattedResults);
        } else {
            setResults([]);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche sur OpenFoodFacts", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce : on attend 500ms après la dernière frappe avant d'appeler l'API
    const debounceTimer = setTimeout(() => {
      searchFood();
    }, 500);

    // Cleanup : annuler le timer si l'utilisateur re-tape avant la fin des 500ms
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
      <div className="input-group position-relative">
        <input
          type="text"
          className="form-control radius-8"
          placeholder="Aliment (ex: Pomme, Pâtes Panzani...)"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          style={{ paddingRight: '40px' }} // Espace pour le spinner
        />
        {loading && (
          <div className="position-absolute end-0 top-50 translate-middle-y me-12 z-index-2 d-flex align-items-center" style={{ pointerEvents: 'none', right: '10px' }}>
            <span className="spinner-border spinner-border-sm text-primary-600" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem' }}></span>
          </div>
        )}
      </div>

      {isOpen && query.length > 0 && (
        <ul className="dropdown-menu show w-100 shadow-lg p-0 position-absolute mt-1 z-index-1000" style={{ maxHeight: '350px', overflowY: 'auto' }}>

          {/* Indicateur explicite en mobile */}
          {loading && results.length === 0 && (
             <li className="dropdown-item py-16 px-16 text-center text-primary-light d-flex flex-column align-items-center gap-8 bg-neutral-50" style={{ pointerEvents: 'none' }}>
                <span className="spinner-border text-primary-main" style={{ width: '24px', height: '24px' }}></span>
                <span className="d-block text-sm fw-medium text-neutral-600 mt-2">Recherche de "{query}"quot;{query}"{query}"quot; sur OpenFoodFacts...</span>
             </li>
          )}

          {!loading && results.length > 0 && (
            results.map((product, idx) => (
              <li
                key={`${product.product_id}-${idx}`}
                className="dropdown-item d-flex align-items-center gap-12 py-12 px-12 border-bottom cursor-pointer text-wrap"
                onClick={() => handleSelect(product)}
                style={{ cursor: 'pointer' }}
              >
                {product.image_url ? (
                  <img src={product.image_url} alt={product.item_text} className="radius-4 flex-shrink-0" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                ) : (
                  <div className="bg-neutral-200 radius-4 d-flex justify-content-center align-items-center text-neutral-500 flex-shrink-0" style={{ width: 48, height: 48 }}>
                    <Icon icon="mdi:food-apple" width="24" height="24" />
                  </div>
                )}

                <div className="flex-grow-1 overflow-hidden">
                  <h6 className="text-sm fw-medium mb-0 text-break lh-sm">{product.item_text}</h6>
                  <div className="text-xs text-primary-light mt-4 d-flex gap-8 flex-wrap">
                    {product.calories !== null ? (
                      <span className="bg-primary-50 text-primary-600 px-6 py-2 radius-4 fw-medium">{Math.round(product.calories)} kcal/100g</span>
                    ) : (
                      <span className="text-neutral-400 fst-italic">Pas d&apos;infos nutritionnelles</span>
                    )}
                    {product.proteins !== null && <span className="text-neutral-500">P: {Math.round(product.proteins)}g</span>}
                    {product.carbohydrates !== null && <span className="text-neutral-500">G: {Math.round(product.carbohydrates)}g</span>}
                    {product.fats !== null && <span className="text-neutral-500">L: {Math.round(product.fats)}g</span>}
                  </div>
                </div>
              </li>
            ))
          )}

          {!loading && results.length === 0 && query.length >= 3 && (
            <li className="dropdown-item py-16 px-16 text-center text-primary-light d-flex flex-column align-items-center gap-8 bg-neutral-50" style={{ pointerEvents: 'none' }}>
              <Icon icon="mdi:database-search-outline" width="32" height="32" className="text-neutral-400" />
              <div>
                <span className="d-block text-sm fw-medium text-neutral-600 mb-4">Produit introuvable sur OpenFoodFacts</span>
                <span className="d-block text-xs text-neutral-500 lh-sm text-wrap">
                  Votre saisie manuelle <strong>"{query}"quot;{query}"{query}"quot;</strong> sera tout de même enregistrée dans le repas. Vous pourrez ajuster les macros manuellement.
                </span>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default FoodSearchAutocomplete;