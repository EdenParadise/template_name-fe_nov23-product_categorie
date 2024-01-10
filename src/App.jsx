/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleUserFilter = (user) => {
    setSelectedUser(user === selectedUser ? null : user);
  };

  const handleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleResetAllFilters = () => {
    setSelectedUser(null);
    setSearchValue('');
    setSelectedCategories([]);
    setSortColumn(null);
    setSortOrder('asc');
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : null);
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const getSortIconClass = (column) => {
    const isSortColumn = sortColumn === column;
    const isAscending = sortOrder === 'asc';

    if (isSortColumn) {
      return `fas fa-sort${isAscending ? '' : '-down'}`;
    }

    return 'fas fa-sort';
  };

  const filteredProducts = productsFromServer.filter((product) => {
    const isUserMatch = !selectedUser
    || product.user.toLowerCase() === selectedUser.toLowerCase();
    const isCategoryMatch = selectedCategories.length === 0
    || selectedCategories.includes(product.category);
    const isNameMatch = product.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());

    return isUserMatch && isCategoryMatch && isNameMatch;
  });

  const sortedProducts = sortColumn
    ? filteredProducts.sort((a, b) => {
      if (sortColumn === 'id') {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      }

      if (sortColumn === 'user') {
        const comparison = a.user.localeCompare(b.user);

        return sortOrder === 'asc' ? comparison : -comparison;
      }

      const comparison = a[sortColumn].localeCompare(b[sortColumn]);

      return sortOrder === 'asc' ? comparison : -comparison;
    })
    : filteredProducts;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                onClick={() => handleUserFilter(null)}
                className={selectedUser === null ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map((user) => (
                <a
                  key={user.id}
                  href="#/"
                  onClick={() => handleUserFilter(user.name)}
                  className={selectedUser === user.name ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchInputChange}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchValue && (
                  <span className="icon is-right">
                    <button
                      type="button"
                      className="delete"
                      onClick={handleClearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a href="#/" onClick={() => setSelectedCategories([])} className={`button ${selectedCategories.length === 0 ? '' : 'is-outlined'}`}>
                All
              </a>

              {categoriesFromServer.map((category) => (
                <a
                  key={category.id}
                  href="#/"
                  onClick={() => handleCategoryFilter(category.name)}
                  className={`button ${selectedCategories.includes(category.name) ? 'is-info' : ''}`}
                >
                  {category.icon}
                  -
                  {category.name}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                onClick={handleResetAllFilters}
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {sortedProducts.length === 0
          && <p data-cy="NoMatchingMessage">No products matching criteria</p>}

          <table className="table is-striped is-narrow is-fullwidth">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={getSortIconClass('id')}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th onClick={() => handleSort('name')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={getSortIconClass('name')}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th onClick={() => handleSort('category')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={getSortIconClass('category')}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th onClick={() => handleSort('user')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={getSortIconClass('user')}
                        />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {categoriesFromServer.find(
                      (category) => category.name === product.category,
                    )?.icon}
                    -
                    {product.category}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={`has-text-link ${usersFromServer.find((user) => user.name === product.user)?.gender === 'male' ? 'has-text-link' : 'has-text-danger'}`}
                  >
                    {product.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
