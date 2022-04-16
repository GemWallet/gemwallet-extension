import { render, screen } from '@testing-library/react';
import { Wallet } from '.';

test('Should render same wallet address passed into prop', () => {
  const address = 'r9guTJy1TiSWYjVroZxCu8G8Npx8zuYq4L';
  render(<Wallet address={address} />);
  const addressElement = screen.getByText(address);
  expect(addressElement).toBeInTheDocument();
});
