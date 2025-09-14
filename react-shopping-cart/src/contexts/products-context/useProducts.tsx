import { useCallback, useEffect, useRef } from 'react';

import { useProductsContext } from './ProductsContextProvider';
import { IProduct } from 'models';
import { getProducts } from 'services/products';

const useProducts = () => {
  const {
    isFetching,
    setIsFetching,
    products,
    setProducts,
    filters,
    setFilters,
  } = useProductsContext();

  // Use ref to track if component is mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchProducts = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setIsFetching(true);
    getProducts().then((products: IProduct[]) => {
      if (isMountedRef.current) {
        setIsFetching(false);
        setProducts(products);
      }
    }).catch((error) => {
      if (isMountedRef.current) {
        setIsFetching(false);
        console.error('Error fetching products:', error);
      }
    });
  }, [setIsFetching, setProducts]);

  const filterProducts = useCallback((filters: string[]) => {
    if (!isMountedRef.current) return;
    
    setIsFetching(true);

    getProducts().then((products: IProduct[]) => {
      if (!isMountedRef.current) return;
      
      setIsFetching(false);
      let filteredProducts;

      if (filters && filters.length > 0) {
        filteredProducts = products.filter((p: IProduct) =>
          filters.find((filter: string) =>
            p.availableSizes.find((size: string) => size === filter)
          )
        );
      } else {
        filteredProducts = products;
      }

      setFilters(filters);
      setProducts(filteredProducts);
    }).catch((error) => {
      if (isMountedRef.current) {
        setIsFetching(false);
        console.error('Error filtering products:', error);
      }
    });
  }, [setIsFetching, setProducts, setFilters]);

  return {
    isFetching,
    fetchProducts,
    products,
    filterProducts,
    filters,
  };
};

export default useProducts;
