"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, ExternalLink, RefreshCw, Copy, CheckCircle } from "lucide-react";

export function WebsitePreview() {
  const [url, setUrl] = useState("https://myngoc-garment.vercel.app/");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Giả lập thời gian tải
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopiedToClipboard(true);
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 2000);
  };

  const handleVisitWebsite = () => {
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Xem trước website
          </CardTitle>
          <CardDescription>
            Xem và truy cập website đã triển khai
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL website"
              className="flex-1"
            />
            <Button variant="outline" onClick={handleCopyUrl} size="icon">
              {copiedToClipboard ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={handleRefresh} size="icon">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={handleVisitWebsite}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Truy cập
            </Button>
          </div>
          
          <div className="border rounded-md overflow-hidden bg-gray-50">
            <div className="h-8 bg-gray-100 border-b flex items-center px-2 space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 ml-2">
                <div className="bg-white rounded-sm text-xs px-2 py-0.5 w-full text-center text-gray-500">
                  {url}
                </div>
              </div>
            </div>
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <iframe
                src={url}
                className="w-full h-[400px] border-0"
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts"
              ></iframe>
            </div>
          </div>
          
          <Tabs defaultValue="desktop" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="desktop">Máy tính</TabsTrigger>
              <TabsTrigger value="tablet">Máy tính bảng</TabsTrigger>
              <TabsTrigger value="mobile">Di động</TabsTrigger>
            </TabsList>
            <TabsContent value="desktop">
              <div className="text-sm text-center text-muted-foreground py-2">
                Đang xem ở chế độ Máy tính (100%)
              </div>
            </TabsContent>
            <TabsContent value="tablet">
              <div className="text-sm text-center text-muted-foreground py-2">
                Đang xem ở chế độ Máy tính bảng (768px)
              </div>
              <style jsx global>{`
                iframe {
                  max-width: 768px;
                  margin: 0 auto;
                  display: block;
                }
              `}</style>
            </TabsContent>
            <TabsContent value="mobile">
              <div className="text-sm text-center text-muted-foreground py-2">
                Đang xem ở chế độ Di động (375px)
              </div>
              <style jsx global>{`
                iframe {
                  max-width: 375px;
                  margin: 0 auto;
                  display: block;
                }
              `}</style>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 