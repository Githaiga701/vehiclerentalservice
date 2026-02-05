"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cacheManager, type CacheStats } from '@/lib/cache-manager';
import { getCacheStatistics, clearAllCaches, clearCacheType } from '@/lib/api-client';
import { toast } from 'sonner';
import { 
  Trash2, 
  RefreshCw, 
  Database, 
  HardDrive, 
  Clock, 
  TrendingUp,
  Info,
  AlertCircle
} from 'lucide-react';

interface CacheManagerProps {
  className?: string;
}

export function CacheManager({ className }: CacheManagerProps) {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadStats = async () => {
    try {
      const cacheStats = getCacheStatistics();
      setStats(cacheStats);
    } catch (error) {
      console.error('Failed to load cache stats:', error);
      toast.error('Failed to load cache statistics');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleClearAll = async () => {
    setLoading(true);
    try {
      clearAllCaches();
      await loadStats();
      toast.success('All caches cleared successfully');
    } catch (error) {
      toast.error('Failed to clear caches');
    } finally {
      setLoading(false);
    }
  };

  const handleClearType = async (type: string) => {
    setLoading(true);
    try {
      await clearCacheType(type);
      await loadStats();
      toast.success(`${type} cache cleared successfully`);
    } catch (error) {
      toast.error(`Failed to clear ${type} cache`);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const cacheTypes = [
    { key: 'api', name: 'API Responses', description: 'Cached API responses', icon: Database },
    { key: 'user', name: 'User Data', description: 'User profiles and settings', icon: Database },
    { key: 'vehicles', name: 'Vehicle Data', description: 'Vehicle listings and details', icon: Database },
    { key: 'search', name: 'Search Results', description: 'Search query results', icon: Database },
    { key: 'static', name: 'Static Content', description: 'Static assets and content', icon: HardDrive },
    { key: 'session', name: 'Session Data', description: 'Temporary session data', icon: Clock },
    { key: 'media', name: 'Media Files', description: 'Images and media content', icon: HardDrive }
  ];

  if (!stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Manager
          </CardTitle>
          <CardDescription>Loading cache statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cache Manager
              </CardTitle>
              <CardDescription>
                Monitor and manage application cache performance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadStats}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="types">Cache Types</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Hit Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                          {stats.hitRate.toFixed(1)}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <Progress value={stats.hitRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Hits</p>
                        <p className="text-2xl font-bold">{formatNumber(stats.hits)}</p>
                      </div>
                      <Database className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Misses</p>
                        <p className="text-2xl font-bold">{formatNumber(stats.misses)}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                        <p className="text-2xl font-bold">{formatBytes(stats.memoryUsage)}</p>
                      </div>
                      <HardDrive className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cache Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cache Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatNumber(stats.itemCount)}</p>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatNumber(stats.size)}</p>
                      <p className="text-sm text-muted-foreground">Memory Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatNumber(stats.hits + stats.misses)}</p>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatBytes(stats.memoryUsage)}</p>
                      <p className="text-sm text-muted-foreground">Memory Used</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.hitRate > 80 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                        <span className="text-sm">Excellent cache performance! Hit rate above 80%</span>
                      </div>
                    )}
                    {stats.hitRate >= 60 && stats.hitRate <= 80 && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                        <span className="text-sm">Good cache performance. Consider optimizing cache strategies.</span>
                      </div>
                    )}
                    {stats.hitRate < 60 && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full" />
                        <span className="text-sm">Low cache hit rate. Review cache configuration and TTL settings.</span>
                      </div>
                    )}
                    {stats.memoryUsage > 10 * 1024 * 1024 && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <div className="w-2 h-2 bg-orange-600 rounded-full" />
                        <span className="text-sm">High memory usage detected. Consider clearing old cache entries.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="types" className="space-y-4">
              <div className="grid gap-4">
                {cacheTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Card key={type.key}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">{type.name}</h3>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{type.key}</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleClearType(type.key)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                              Clear
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cache Actions</CardTitle>
                  <CardDescription>
                    Manage cache data and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleClearAll}
                      disabled={loading}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Caches
                    </Button>
                    <Button
                      onClick={loadStats}
                      disabled={loading}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh Statistics
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Cache Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• API responses are cached for 5 minutes by default</p>
                      <p>• User data is cached for 30 minutes with encryption</p>
                      <p>• Vehicle data is cached for 15 minutes with compression</p>
                      <p>• Search results are cached for 2 minutes in memory</p>
                      <p>• Static content is cached for 24 hours</p>
                      <p>• Session data expires when the browser session ends</p>
                      <p>• Media files are cached for 7 days in IndexedDB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default CacheManager;