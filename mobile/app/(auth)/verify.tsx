import React, { useState, useEffect } from 'react';
import { View, Button, Linking } from 'react-native';
import { Text } from '~/components/ui/text';
import { ReclaimProofRequest } from '@reclaimprotocol/reactnative-sdk';

const APP_ID = '0xaF7417b895d0695b2f6fb25c59dB2Fc6fA62bA3f';
const APP_SECRET = '0x718059ef841a8b5138a44e132c9656643d05d2149c7e6acbdab00490b338cae9';
const PROVIDER_ID = 'a9f1063c-06b7-476a-8410-9ff6e427e637';

async function initializeReclaim() {
  const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
  return reclaimProofRequest;
}

async function generateRequestUrl(reclaimProofRequest: any) {
  const requestUrl = await reclaimProofRequest.getRequestUrl();
  console.log('Request URL:', requestUrl);
  return requestUrl;
}

async function startVerificationSession(reclaimProofRequest: any, onSuccess: any, onFailure: any) {
  await reclaimProofRequest.startSession({
    onSuccess: onSuccess,
    onFailure: onFailure,
  });
}
function ReclaimDemo() {
  const [requestUrl, setRequestUrl] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function setup() {
      try {
        const reclaimProofRequest = await initializeReclaim();
        const url = await generateRequestUrl(reclaimProofRequest);
        setRequestUrl(url);
        setStatus('Ready to start verification');

        await startVerificationSession(
          reclaimProofRequest,
          (proofs: any) => {
            if (proofs) {
              if (typeof proofs === 'string') {
                console.log('SDK Message:', proofs);
              } else if (typeof proofs !== 'string') {
                console.log('Proof received:', proofs?.claimData.context);
              }
              setStatus('Proof received!');
            }
          },
          (error: any) => {
            console.error('Verification failed', error);
            setStatus(`Error: ${error.message}`);
          }
        );
      } catch (error) {
        console.error('Setup failed', error);
        //@ts-ignore
        setStatus(`Setup failed: ${error.message} `);
      }
    }

    setup();
  }, []);

  const openRequestUrl = () => {
    if (requestUrl) {
      Linking.openURL(requestUrl);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Reclaim Demo</Text>
      <Text>Status: {status}</Text>
      {requestUrl && <Button title="Start Verification" onPress={openRequestUrl} />}
    </View>
  );
}

export default ReclaimDemo;
//const PROVIDER_ID = 'a9f1063c-06b7-476a-8410-9ff6e427e637';
