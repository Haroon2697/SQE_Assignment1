import { KeyboardEvent, useState } from 'react';

import formatPrice from 'utils/formatPrice';
import { IProduct } from 'models';

import { useCart } from 'contexts/cart-context';

import * as S from './style';

interface IProps {
  product: IProduct;
}

const Product = ({ product }: IProps) => {
  const { openCart, addProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeError, setShowSizeError] = useState<boolean>(false);
  const {
    sku,
    title,
    price,
    installments,
    currencyId,
    currencyFormat,
    isFreeShipping,
    availableSizes,
  } = product;

  const formattedPrice = formatPrice(price, currencyId);
  let productInstallment;

  if (installments) {
    const installmentPrice = price / installments;

    productInstallment = (
      <S.Installment>
        <span>or {installments} x</span>
        <b>
          {currencyFormat}
          {formatPrice(installmentPrice, currencyId)}
        </b>
      </S.Installment>
    );
  }

  const handleAddProduct = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    
    setShowSizeError(false);
    addProduct({ ...product, quantity: 1, selectedSize });
    openCart();
  };

  const handleAddProductWhenEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.code === 'Space') {
      if (!selectedSize) {
        setShowSizeError(true);
        return;
      }
      
      setShowSizeError(false);
      addProduct({ ...product, quantity: 1, selectedSize });
      openCart();
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  return (
    <S.Container onKeyUp={handleAddProductWhenEnter} sku={sku} tabIndex={1}>
      {isFreeShipping && <S.Stopper>Free shipping</S.Stopper>}
      <S.Image alt={title} />
      <S.Title>{title}</S.Title>
      
      {/* Size Selection */}
      <S.SizeContainer>
        <S.SizeLabel>Size:</S.SizeLabel>
        <S.SizeSelect 
          value={selectedSize} 
          onChange={(e) => handleSizeChange(e.target.value)}
          hasError={showSizeError}
        >
          <option value="">Select Size</option>
          {availableSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </S.SizeSelect>
        {showSizeError && <S.ErrorMessage>Please select a size</S.ErrorMessage>}
      </S.SizeContainer>

      <S.Price>
        <S.Val>
          <small>{currencyFormat}</small>
          <b>{formattedPrice.substring(0, formattedPrice.length - 3)}</b>
          <span>{formattedPrice.substring(formattedPrice.length - 3)}</span>
        </S.Val>
        {productInstallment}
      </S.Price>
      <S.BuyButton onClick={handleAddProduct} tabIndex={-1}>
        Add to cart
      </S.BuyButton>
    </S.Container>
  );
};

export default Product;
