import React, { useState, useEffect } from 'react';
import { View, Button, Linking } from 'react-native';
import { Text } from '~/components/ui/text';
import { ReclaimProofRequest } from '@reclaimprotocol/reactnative-sdk';

const ReclaimComponent = () => {
  const [status, setStatus] = useState('');
  const [requestUri, setRequestUrl] = useState('');

  const initializeReclaim = async () => {
    try {
      setStatus('Initializing...');

      // Fetch the configuration from your backend
      const response = await fetch('http://localhost:3000/api/reclaim/generate-config');
      const { reclaimProofRequestConfig } = await response.json();

      // Reconstruct the ReclaimProofRequest object
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);

      // Generate request URL
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(requestUrl)

      // Start the session for better UX
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          if (proofs) {
            if (typeof proofs === 'string') {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log('SDK Message:', proofs);
            } else if (typeof proofs !== 'string') {
              // When using the default callback url, we get a proof object in the response
              console.log('Proof received:', proofs?.claimData.context);
            }
            setStatus('Proof received!');
          }
          // Handle successful verification (e.g., update UI, send to backend)
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setStatus('Verification failed. Please try again.');
          // Handle verification failure (e.g., show error message)
        },
      });

      console.log('Request URL:', requestUrl);
      setStatus('Reclaim process started. Please follow the instructions.');
    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setStatus('Error initializing Reclaim. Please try again.');
      // Handle initialization error (e.g., show error message)
    }
  };

  const openRequestUrl = () => {
    if (requestUri) {
      Linking.openURL(requestUri);
    }
  };

  return (
    <View>
      <Button title="Start Reclaim Process" onPress={initializeReclaim} />
      <Text>{status}</Text>
      {requestUri && <Button title='State Verification' onPress={openRequestUrl} />}
    </View>
  );
};

export default ReclaimComponent;
