import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait longer for the async fetch to complete and perk to render
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    // Filter by name
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 3000 }
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for perks to load
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    // Find the merchant dropdown and select the seeded merchant
    const merchantSelect = screen.getByRole('combobox');
    fireEvent.change(merchantSelect, { target: { value: seededPerk.merchant.name } });

    // Wait until the filtered perk appears
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 3000 }
    );

    // Verify summary text still reflects result count
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});