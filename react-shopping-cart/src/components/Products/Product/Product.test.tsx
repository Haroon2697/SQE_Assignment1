import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Product from './Product';
import { useCart } from 'contexts/cart-context';
import { IProduct } from 'models';

// Mock the useCart hook
jest.mock('contexts/cart-context');
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

// Mock the formatPrice utility
jest.mock('utils/formatPrice', () => {
  return jest.fn((price: number) => price.toFixed(2));
});

const mockProduct: IProduct = {
  id: 1,
  sku: 12345,
  title: 'Test Product',
  description: 'A test product',
  availableSizes: ['S', 'M', 'L'],
  style: 'test-style',
  price: 29.99,
  installments: 3,
  currencyId: 'USD',
  currencyFormat: '$',
  isFreeShipping: true,
};

const mockCartFunctions = {
  isOpen: false,
  openCart: jest.fn(),
  closeCart: jest.fn(),
  addProduct: jest.fn(),
  removeProduct: jest.fn(),
  increaseProductQuantity: jest.fn(),
  decreaseProductQuantity: jest.fn(),
  products: [],
  total: {
    productQuantity: 0,
    installments: 0,
    totalPrice: 0,
    currencyId: 'USD',
    currencyFormat: '$',
  },
  updateCartTotal: jest.fn(),
};

describe('Product Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCart.mockReturnValue(mockCartFunctions);
  });

  test('renders product information correctly', () => {
    render(<Product product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Free shipping')).toBeInTheDocument();
  });

  test('renders size selection dropdown', () => {
    render(<Product product={mockProduct} />);
    
    expect(screen.getByText('Size:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select Size')).toBeInTheDocument();
    
    // Check that all available sizes are in the dropdown
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  test('shows error when trying to add to cart without selecting size', () => {
    render(<Product product={mockProduct} />);
    
    const addToCartButton = screen.getByText('Add to cart');
    fireEvent.click(addToCartButton);
    
    expect(screen.getByText('Please select a size')).toBeInTheDocument();
    expect(mockCartFunctions.addProduct).not.toHaveBeenCalled();
    expect(mockCartFunctions.openCart).not.toHaveBeenCalled();
  });

  test('adds product to cart when size is selected', () => {
    render(<Product product={mockProduct} />);
    
    const sizeSelect = screen.getByDisplayValue('Select Size');
    fireEvent.change(sizeSelect, { target: { value: 'M' } });
    
    const addToCartButton = screen.getByText('Add to cart');
    fireEvent.click(addToCartButton);
    
    expect(mockCartFunctions.addProduct).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 1,
      selectedSize: 'M',
    });
    expect(mockCartFunctions.openCart).toHaveBeenCalled();
    expect(screen.queryByText('Please select a size')).not.toBeInTheDocument();
  });

  test('clears error message when size is selected', () => {
    render(<Product product={mockProduct} />);
    
    // First, trigger error by clicking add to cart without size
    const addToCartButton = screen.getByText('Add to cart');
    fireEvent.click(addToCartButton);
    expect(screen.getByText('Please select a size')).toBeInTheDocument();
    
    // Then select a size
    const sizeSelect = screen.getByDisplayValue('Select Size');
    fireEvent.change(sizeSelect, { target: { value: 'L' } });
    
    // Error message should be cleared
    expect(screen.queryByText('Please select a size')).not.toBeInTheDocument();
  });

  test('handles keyboard navigation for add to cart', () => {
    render(<Product product={mockProduct} />);
    
    const sizeSelect = screen.getByDisplayValue('Select Size');
    fireEvent.change(sizeSelect, { target: { value: 'S' } });
    
    const productContainer = screen.getByRole('generic');
    fireEvent.keyUp(productContainer, { key: 'Enter' });
    
    expect(mockCartFunctions.addProduct).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 1,
      selectedSize: 'S',
    });
    expect(mockCartFunctions.openCart).toHaveBeenCalled();
  });

  test('shows error on keyboard navigation without size selection', () => {
    render(<Product product={mockProduct} />);
    
    const productContainer = screen.getByRole('generic');
    fireEvent.keyUp(productContainer, { key: 'Enter' });
    
    expect(screen.getByText('Please select a size')).toBeInTheDocument();
    expect(mockCartFunctions.addProduct).not.toHaveBeenCalled();
  });

  test('renders installment information when available', () => {
    render(<Product product={mockProduct} />);
    
    expect(screen.getByText('or 3 x')).toBeInTheDocument();
  });

  test('does not render installment when not available', () => {
    const productWithoutInstallments = { ...mockProduct, installments: 0 };
    render(<Product product={productWithoutInstallments} />);
    
    expect(screen.queryByText('or 3 x')).not.toBeInTheDocument();
  });
});