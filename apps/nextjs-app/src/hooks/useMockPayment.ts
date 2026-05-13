import { useState } from 'react';

export function useMockPayment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateMockToken = async (): Promise<string> => {
    setIsProcessing(true);
    // Simulate network delay for payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    return `tok_mock_${Math.random().toString(36).substring(2, 11)}`;
  };

  return { generateMockToken, isProcessing };
}
