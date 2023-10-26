import { FC, ReactNode } from 'react';

import { render, screen, waitFor, act } from '@testing-library/react';

import { NFTCard, NFTCardProps } from './NFTCard';
import { LedgerContext } from '../../../contexts';
import { valueLedgerContext } from '../../../mocks';

const mockNFT = {
  Flags: 11,
  Issuer: 'rDGh681kc6V1GKkQB378XhiM1tzkYrnFwQ',
  NFTokenID: '000B0000867AD7165A812436FBFA175555413C26162BCF380000099A00000000',
  NFTokenTaxon: 1,
  URI: '697066733A2F2F6261667962656965356A626736336A6164676979736337796B6B6A64737170777732746A6D786D7935377077716F6A697666356562366B6D6D79612F312E6A736F6E', // Hex: ipfs://bafybeie5jbg63jadgiysc7ykkjdsqpww2tjmxmy57pwqojivf5eb6kmmya/1.json
  nft_serial: 0
};

const mockNFTData = {
  NFTokenID: 'fake',
  schema: 'ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU',
  nftType: 'art.v0',
  name: "Ekiserrepe's Oniric Lo-Fi Rooms Vol.1 NFT #1",
  description: "Room #1 of Ekiserrepe's Oniric Lo-Fi Rooms Vol.1",
  image: 'ipfs://bafybeie6pmuddco552t4u7oc7anryqohuj6vl42ngct6ve3q4bjet5piam/1.png',
  collection: {
    name: "Ekiserrepe's Oniric Lo-Fi Rooms Vol.1",
    family: 'Oniric Lo-Fi Rooms'
  }
};

const mockGetNFTData = jest.fn();
const mockContext = {
  ...valueLedgerContext,
  getNFTData: mockGetNFTData
};

interface LedgerContextMockProviderProps {
  children: ReactNode;
}

const LedgerContextMockProvider: FC<LedgerContextMockProviderProps> = ({ children }) => (
  <LedgerContext.Provider value={mockContext}>{children}</LedgerContext.Provider>
);

const renderNFTCard = (props: NFTCardProps) => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    render(
      <LedgerContextMockProvider>
        <NFTCard {...props} />
      </LedgerContextMockProvider>
    );
  });
};

describe('NFTCard', () => {
  test('renders NFTCard component correctly', async () => {
    mockGetNFTData.mockReturnValueOnce({
      ...mockNFTData
    });

    renderNFTCard({
      NFT: mockNFT,
      layout: 'list'
    });

    await waitFor(() => expect(mockGetNFTData).toHaveBeenCalled());
    expect(
      screen.getByText("Room #1 of Ekiserrepe's Oniric Lo-Fi Rooms Vol.1")
    ).toBeInTheDocument();
  });

  test('handles error when fetching NFT data', async () => {
    // Temporarily change the behavior of getNFTData to throw an error
    mockGetNFTData.mockImplementationOnce(() => {
      throw new Error('Failed to fetch NFT data');
    });

    renderNFTCard({ NFT: mockNFT, layout: 'list' });

    await waitFor(() => expect(mockGetNFTData).toHaveBeenCalled());

    // Check that the NFT data description is set to convertHexToString(URI) when an error occurs
    expect(
      screen.getByText('ipfs://bafybeie5jbg63jadgiysc7ykkjdsqpww2tjmxmy57pwqojivf5eb6kmmya/1.json')
    ).toBeInTheDocument();
  });
});
