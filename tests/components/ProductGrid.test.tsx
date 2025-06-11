import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ProductGrid from '@/components/products/product-grid';

const mockProducts = [
  {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    inventory_count: 10,
    category: { name: 'Test Category' },
    images: [
      {
        url: 'https://example.com/image.jpg',
        alt_text: 'Test Image',
        is_primary: true,
      },
    ],
  },
];

describe('ProductGrid', () => {
  test('renders products correctly', () => {
    render(<ProductGrid products={mockProducts} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  test('shows out of stock message when inventory is 0', () => {
    const outOfStockProducts = [
      { ...mockProducts[0], inventory_count: 0 },
    ];
    
    render(<ProductGrid products={outOfStockProducts} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  test('renders empty state when no products', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });
});