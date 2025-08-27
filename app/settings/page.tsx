import { cookies } from 'next/headers';
import SettingsClient from './settings-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const cookieStore =  cookies();
  const jwt = (await cookieStore).get('jwt')?.value || '';

  return <SettingsClient initialJwt={jwt} />;
}