import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlackFridayOffer } from '../components/landing/BlackFridayOffer';
afterEach(() => { cleanup(); vi.useRealTimers(); });
it('removes the campaign and restores the price when an open page crosses the deadline', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-30T23:59:59-03:00'));
  render(<MemoryRouter><BlackFridayOffer /></MemoryRouter>);
  expect(screen.getByText('R$ 497')).toBeInTheDocument();
  expect(screen.getByRole('timer')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByText('R$ 1.497')).toBeInTheDocument();
  expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  expect(screen.queryByText(/Economize/)).not.toBeInTheDocument();
});
