import React from 'react';
import { SpotNotification } from './SpotNotification';
import { DogLogoDefault } from './DogLogoDefault';

interface DogLogoProps {
  size?: number;
  hasNotification?: boolean;
}

export function DogLogo({ size = 40, hasNotification = false }: DogLogoProps) {
  return hasNotification ? (
    <SpotNotification size={size} />
  ) : (
    <DogLogoDefault size={size} />
  );
}
