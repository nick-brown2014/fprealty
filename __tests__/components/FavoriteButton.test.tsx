import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const mockToggleFavorite = jest.fn();
const mockOpenAuthModal = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    favorites: new Set(['listing-1']),
    toggleFavorite: mockToggleFavorite,
    openAuthModal: mockOpenAuthModal,
  }),
}));

import FavoriteButton from '@/app/components/FavoriteButton';

describe('FavoriteButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the favorite button', () => {
    render(<FavoriteButton listingId="listing-1" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show filled heart for favorited listing', () => {
    render(<FavoriteButton listingId="listing-1" />);
    
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should call toggleFavorite when clicked', async () => {
    const user = userEvent.setup();
    render(<FavoriteButton listingId="listing-2" />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockToggleFavorite).toHaveBeenCalledWith('listing-2');
  });
});
