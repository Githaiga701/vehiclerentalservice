"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CacheManager from '@/components/CacheManager';
import { runCacheTests, type CacheTestResult } from '@/lib/cache-test';
import { toast } from 'sonner';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database,
  TestTube,
  AlertTriangle
} from 'lucide-react';

export default function CachePage() {
  const [testResults, setTestResults] = useState<CacheTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [hasRunTests, setHasRunTests] = useState(false);

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setHasRunTests(false);
    
    try {
      toast.info('Running cache tests...');
      const results = await runCacheTests();
      setTestResults(results);
      setHasRunTests(true);
      
      const passed = results.filter(r => r.passed).length;
      const total = results.length;
      
      if (passed === total) {
        toast.success(`All ${total} cache tests passed!`);
      } else {
        toast.warning(`${passed}/${total} cache tests passed`);
      }
    } catch (error) {
      console.error('Test execution failed:', error);
      toast.error('Failed to run cache tests');
    } finally {
      setIsRunningTests(false);
    }
  };

  const getTestStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getTestStatusBadge = (passed: boolean) => {
    return (
      <Badge variant={passed ? "default" : "destructive"}>
        {passed ? "PASS" : "FAIL"}
      </Badge>
    );
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cache Management</h1>
        <p className="text-muted-foreground">
          Monitor cache performance, run diagnostics, and manage cache data
        </p>
      </div>

      <Tabs defaultValue="manager" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manager" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Cache Manager
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Cache Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manager">
          <CacheManager />
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Cache Test Suite
              </CardTitle>
              <CardDescription>
                Run comprehensive tests to validate cache functionality and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Test cache operations, strategies, and performance
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Includes basic operations, expiration, compression, encryption, and storage strategies
                  </p>
                </div>
                <Button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="flex items-center gap-2"
                >
                  {isRunningTests ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Tests
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Results Summary */}
          {hasRunTests && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tests Passed</p>
                      <p className="text-2xl font-bold text-green-600">{passedTests}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tests Failed</p>
                      <p className="text-2xl font-bold text-red-600">{totalTests - passedTests}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
                    </div>
                    <TestTube className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Test Results */}
          {hasRunTests && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Detailed results for each cache test
                </CardDescription>
              </CardHeader>
              <CardContent>
                {successRate < 100 && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Some tests failed. Check the details below and review your cache configuration.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.passed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTestStatusIcon(result.passed)}
                          <div>
                            <h4 className="font-medium">{result.testName}</h4>
                            {result.error && (
                              <p className="text-sm text-red-600 mt-1">{result.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(result.duration)}
                          </span>
                          {getTestStatusBadge(result.passed)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Information */}
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>
                What the cache tests validate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Basic Operations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Set and get cache items</li>
                    <li>• Cache expiration and TTL</li>
                    <li>• Different cache types</li>
                    <li>• Cache deletion and cleanup</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Advanced Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Data compression</li>
                    <li>• Data encryption</li>
                    <li>• Stale-while-revalidate</li>
                    <li>• Offline mode support</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Storage Strategies</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Memory cache</li>
                    <li>• LocalStorage cache</li>
                    <li>• SessionStorage cache</li>
                    <li>• IndexedDB cache</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Performance & Monitoring</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Cache performance metrics</li>
                    <li>• Statistics tracking</li>
                    <li>• API client integration</li>
                    <li>• Memory usage monitoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}