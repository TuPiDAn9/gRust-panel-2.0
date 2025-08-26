'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useChart, ChartType } from '@/components/chart-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

export default function SettingsPage() {
  const [jwt, setJwt] = useState('');
  const { chartType, setChartType } = useChart();

  useEffect(() => {
    checkExistingJWT();
  }, []);

  const checkExistingJWT = async () => {
    try {
      const response = await fetch('/api/check-jwt');
      const data = await response.json();
      if (data.hasJWT) {
        setJwt('●●●●●●●●●●●●●●●●●●●●●●●●');
      }
    } catch (error) {
      // Silently handle error
    }
  };

  const handleSave = async () => {
    if (!jwt.trim() || jwt.includes('●')) {
      toast.error('Please enter a valid JWT token');
      return;
    }

    try {
      const response = await fetch('/api/set-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt }),
      });

      if (response.ok) {
        toast.success('JWT token saved successfully');
        setJwt('●●●●●●●●●●●●●●●●●●●●●●●●');
      } else {
        toast.error('Failed to save JWT token');
      }
    } catch (error) {
      toast.error('Failed to save JWT token');
    }
  };

  const handleClear = async () => {
    try {
      const response = await fetch('/api/clear-jwt', {
        method: 'POST',
      });

      if (response.ok) {
        setJwt('');
        toast.success('JWT token cleared');
      } else {
        toast.error('Failed to clear JWT token');
      }
    } catch (error) {
      toast.error('Failed to clear JWT token');
    }
  };

  const handleTestAPI = async () => {
    try {
      const response = await fetch('/api/test-jwt');
      const data = await response.json();

      if (data.success) {
        toast.success(`JWT is valid! User: ${data.user?.name || 'Unknown'}`);
      } else {
        toast.error(`JWT is invalid: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to test JWT via API');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your gRust Panel settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="jwt">JWT Token</Label>
              <Input
                id="jwt"
                placeholder="Enter your JWT token"
                value={jwt}
                onChange={(e) => setJwt(e.target.value)}
                type="password"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">Save</Button>
              <Button onClick={handleClear} variant="outline">Clear</Button>
            </div>
            <Button onClick={handleTestAPI} variant="secondary" className="w-full">
              Test JWT
            </Button>
            <div className="grid gap-2">
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md mt-6">
        <CardHeader>
          <CardTitle>Chart Settings</CardTitle>
          <CardDescription>Customize the appearance of your charts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label>Chart Type</Label>
            <Select
              value={chartType}
              onValueChange={(value) => setChartType(value as ChartType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}