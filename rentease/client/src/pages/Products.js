import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const category = searchParams.get('category') || '';

  const categories = ['', 'Furniture', 'Appliances', 'Electronics'];

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    api.get('/products', { params }).then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, [category, search]);

  const setCategory = (cat) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 className="page-title">Browse Products</h1>
          <p className="page-subtitle">Rent premium furniture, appliances & electronics at the best prices</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <input
              type="search" placeholder="🔍 Search products..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline'}`}>
                {cat || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
          {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Products Grid */}
        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No Products Found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
