import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import * as ReactRouterDom from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';

import {
  HOME_PATH,
  IMPORT_SEED_PATH,
  PARAMETER_TRANSACTION_PAYMENT,
  TRANSACTION_PATH
} from '../../../constants';
import { generateWalletContext } from '../../../mocks';
import { Congratulations } from './Congratulations';

const mockWalletContext = generateWalletContext();
vi.mock('../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof ReactRouterDom;
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Congratulations Page', () => {
  test('Should render the proper elements', async () => {
    render(
      <BrowserRouter>
        <Congratulations />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: "Woo, you're in!" })).toBeVisible();
  });

  test('Should navigate to transaction page', async () => {
    const search = `?${PARAMETER_TRANSACTION_PAYMENT}&amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`;
    render(
      <MemoryRouter initialEntries={[`${IMPORT_SEED_PATH}${search}`]}>
        <Congratulations />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const finishButton = screen.getByRole('button', { name: 'Finish' });
    await user.click(finishButton);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`${TRANSACTION_PATH}${search}`);
  });

  test('Should navigate to home page', async () => {
    const search = `?amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`;
    render(
      <MemoryRouter initialEntries={[`${IMPORT_SEED_PATH}${search}`]}>
        <Congratulations />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const finishButton = screen.getByRole('button', { name: 'Finish' });
    await user.click(finishButton);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`${HOME_PATH}${search}`);
  });
});
