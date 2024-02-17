import { openExternalLink } from './link';
import { describe, it, expect, vi } from 'vitest';

describe('openExternalLink', () => {
  it('should open a new window with the given url', () => {
    // Arrange
    const url = 'http://example.com';
    // @ts-ignore
    window.open = vi.fn();

    // Act
    openExternalLink(url);

    // Assert
    expect(window.open).toHaveBeenCalledWith(url, '_blank');
  });
});
