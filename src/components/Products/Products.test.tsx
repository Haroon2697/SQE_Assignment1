import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Products from './Products';
import { IProduct } from 'models';
import { renderWithThemeProvider } from 'utils/test/test-utils';

const mockProducts: IProduct[] = [
  {
    id: 1,
    sku: 12345,
    title: 'Product 1',
    description: 'First product',
    availableSizes: ['S', 'M'],
    style: 'style1',
    price: 29.99,
    installments: 3,
    currencyId: 'USD',
    currencyFormat: '$',
    isFreeShipping: true,
  },
  {
    id: 2,
    sku: 67890,
    title: 'Product 2',
    description: 'Second product',
    availableSizes: ['M', 'L'],
    style: 'style2',
    price: 39.99,
    installments: 0,
    currencyId: 'USD',
    currencyFormat: '$',
    isFreeShipping: false,
  },
];

// Mock the Product component
jest.mock('./Product', () => {
  return function MockProduct({ product }: { product: IProduct }) {
    return <div data-testid={`product-${product.id}`}>{product.title}</div>;
  };
});

describe('Products Component', () => {
  test('renders products grid with correct number of products', () => {
    renderWithThemeProvider(<Products products={mockProducts} />);
    
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-2')).toBeInTheDocument();
  });

  test('renders empty state when no products provided', () => {
    renderWithThemeProvider(<Products products={[]} />);
    
    expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
  });

  test('renders empty state when products is undefined', () => {
    renderWithThemeProvider(<Products products={undefined as any} />);
    
    expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
  });

  test('applies correct CSS classes for responsive grid', () => {
    const { container } = renderWithThemeProvider(<Products products={mockProducts} />);
    const gridContainer = container.firstChild as HTMLElement;
    
    expect(gridContainer).toHaveStyle({
      display: 'grid',
      'grid-template-columns': 'repeat(1, 1fr)',
    });
  });
});