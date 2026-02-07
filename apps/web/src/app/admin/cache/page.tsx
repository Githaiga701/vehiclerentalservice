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
    <div className="container mx-auto py-8 space-y-8 min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-2">Cache Management 🚀</h1>
        <p className="text-cyan-100 text-lg">
          Monitor cache performance, run diagnostics, and manage cache data
        </p>
      </div>

      <Tabs defaultValue="manager" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="manager" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <Database className="h-4 w-4" />
            Cache Manager
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <TestTube className="h-4 w-4" />
            Cache Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manager">
          <CacheManager />
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          {/* Test Controls */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-cyan-900">
                <TestTube className="h-5 w-5" />
                Cache Test Suite
              </CardTitle>
              <CardDescription className="text-cyan-700">
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
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-100">Tests Passed</p>
                      <p className="text-4xl font-bold mt-2">{passedTests}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-100">Tests Failed</p>
                      <p className="text-4xl font-bold mt-2">{totalTests - passedTests}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <XCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-100">Success Rate</p>
                      <p className="text-4xl font-bold mt-2">{successRate.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <TestTube className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Test Results */}
          {hasRunTests && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                <CardTitle className="text-cyan-900">Test Results</CardTitle>
                <CardDescription className="text-cyan-700">
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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
              <CardTitle className="text-cyan-900">Test Information</CardTitle>
              <CardDescription className="text-cyan-700">
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