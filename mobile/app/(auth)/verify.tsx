import React, { useState, useEffect } from 'react';
import { View, Text, Button, Linking } from 'react-native';
import { ReclaimProofRequest } from '@reclaimprotocol/reactnative-sdk';
import axios from 'axios';
import { baseUrl } from '~/lib/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

const APP_ID = '0xf6fB7a7B4065011777b55F2332c6CF0B17e5e6C3';
const APP_SECRET = '0xaf3f96aba9bf9062b2e4c547f9e918febb9fdc4c9b5cf5a06b97e45f2647aaed';
const PROVIDER_ID = 'b16c6781-4411-4bde-b1e6-c041df573f96';

async function initializeReclaim() {
  const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
  return reclaimProofRequest;
}

async function generateRequestUrl(reclaimProofRequest: any) {
  const requestUrl = await reclaimProofRequest.getRequestUrl();
  console.log('Request URL:', requestUrl);
  return requestUrl;
}

//@ts-ignore
async function startVerificationSession(reclaimProofRequest, onSuccess, onFailure) {
  await reclaimProofRequest.startSession({
    onSuccess: onSuccess,
    onFailure: onFailure,
  });
}

function ReclaimDemo() {
  const [requestUrl, setRequestUrl] = useState('');
  const [status, setStatus] = useState('');
  const [proof, setProof] = useState('');
  const [success, setSuccess] = useState(false);

  async function getToken() {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  }

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
                // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
                console.log('SDK Message:', proofs);
              } else if (typeof proofs !== 'string') {
                // When using the default callback url, we get a proof object in the response
                console.log('Proof received:', proofs?.claimData.context);
                setProof(proofs?.claimData.context);
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
        setStatus(`Setup failed: ${error.message}`);
      }
    }

    setup();
    getToken().then((token) => {
      console.log("token from verification", token)
    });
  }, []);

  useEffect(() => {
    const sendProof = async () => {
      console.log('Sending proof...');
      const token = await AsyncStorage.getItem('auth_token');
      try {
        console.log(`${baseUrl}}/api/reclaim/proofs`)
        const res = await axios.post(`${baseUrl}/api/reclaim/proofs`, { proof: proof },
          {
            headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
          });
        if (res.status === 200) {
          setSuccess(true);
        }
      } catch (error) {
        //@ts-ignore
        console.error('Proof sending failed', error.response.status);
      }
    }
    if (proof) {
      sendProof();
    }
  }, [proof]);

  const openRequestUrl = () => {
    if (requestUrl) {
      setProof('');
      Linking.openURL(requestUrl);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text className='text-foreground'>Reclaim Demo</Text>
      <Text className='text-foreground'>Status: {status}</Text>
      <Text className='text-foreground'>Proof: {proof}</Text>
      {requestUrl && <Button title="Start Verification" onPress={openRequestUrl} />}
      {success &&
        <Link href='/(tabs)/home'>
          <Text className='text-foreground'>Success ! Click here to continue</Text>
        </Link>
      }

      <Link href='/(tabs)/home'>
        <Text className='text-foreground'>Skip</Text>
      </Link>
    </View>
  );
}

export default ReclaimDemo;
