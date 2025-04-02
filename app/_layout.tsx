import React from 'react';
import { Stack } from 'expo-router';
import { DatabaseProvider } from '../contexts/DatabaseContext';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack />
    </DatabaseProvider>
  );
}