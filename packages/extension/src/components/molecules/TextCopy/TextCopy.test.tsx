import { render, screen } from '@testing-library/react';

import { TextCopy } from '.';
import { test } from 'vitest';

test('Should render text passed into prop', () => {
  const seed = 'r9guTJy1TiSWYjVroZxCu8G8Npx8zuYq4';
  render(<TextCopy text={seed} />);
  const addressElement = screen.getByText(seed);
  expect(addressElement).toBeInTheDocument();
});
