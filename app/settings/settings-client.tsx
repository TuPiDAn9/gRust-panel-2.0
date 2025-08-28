'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useChart, ChartType } from '@/components/charts/chart-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';

interface SettingsClientProps {
  initialJwt: string;
}

export default function SettingsClient({ initialJwt }: SettingsClientProps) {
  const [jwt, setJwt] = useState(initialJwt);
  const [isJwtVisible, setIsJwtVisible] = useState(false);
  const { chartType, setChartType } = useChart();

  const handleSave = async () => {
    if (!jwt.trim()) {
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
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-4">
      <div className="flex flex-col gap-4 md:gap-6 w-full lg:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Authentication</CardTitle>
            <CardDescription>Manage your gRust Panel JWT token</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jwt">JWT Token</Label>
                <div className="relative flex items-center">
                  <Input
                    id="jwt"
                    placeholder="Enter your JWT token"
                    value={jwt}
                    onChange={(e) => setJwt(e.target.value)}
                    type={isJwtVisible ? 'text' : 'password'}
                    className="pr-10 text-xs md:text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 h-7 w-7"
                    onClick={() => setIsJwtVisible(!isJwtVisible)}
                  >
                    {isJwtVisible ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button onClick={handleClear} variant="outline" className="sm:w-auto">Clear</Button>
              </div>
              <Button onClick={handleTestAPI} variant="ghost" className="w-full">
                Test JWT
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Customization</CardTitle>
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

      <div className="w-full lg:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Information</CardTitle>
            <CardDescription>gRust Panel 2.0</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base">This is a new and improved version of the gRust Panel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
