
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertCircle, CheckCircle } from "lucide-react";

export default function ImageDebugPage() {
    const [config, setConfig] = useState<any>(null);
    const [testImageUrl, setTestImageUrl] = useState<string | null>(null);

    useEffect(() => {
        // Collect some basic info from the environment (safely exposed)
        const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "Not Set (Fallback to R2_PUBLIC_URL server-side)";

        // Check if the current environment has the "unconfigured host" error
        // We can't easily check for the Next.js error here, but we can show the URL format.

        setConfig({
            R2_PUBLIC_URL: publicUrl,
            window_location: window.location.origin,
        });
    }, []);

    return (
        <div className="container py-12 space-y-8">
            <h1 className="text-3xl font-bold">Image Configuration Diagnostic</h1>

            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Critical Configuration Note</AlertTitle>
                <AlertDescription>
                    If your <code>R2_PUBLIC_URL</code> ends with <code>.r2.cloudflarestorage.com</code>, <strong>your images will NOT show up</strong>.
                    That is an internal API endpoint. You must use a public URL (like <code>pub-xxx.r2.dev</code>).
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase">Target URL Pattern</p>
                            <code className="block p-2 bg-muted rounded mt-1 break-all">
                                {process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "Using server-side R2_PUBLIC_URL"}
                            </code>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="font-semibold mb-2">How to Fix:</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-sm">
                                <li>Go to your <strong>Cloudflare Dashboard</strong>.</li>
                                <li>Go to <strong>R2 &gt; Buckets &gt; phonepoint</strong>.</li>
                                <li>Go to the <strong>Settings</strong> tab.</li>
                                <li>Find <strong>Public Access</strong>.</li>
                                <li>If <strong>R2.dev subdomain</strong> is disabled, click <strong>Allow Access</strong>.</li>
                                <li>Copy the URL provided there (e.g. <code>https://pub-xxxxxx.r2.dev</code>).</li>
                                <li>Paste it into your <code>.env</code> as <code>R2_PUBLIC_URL</code>.</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Common Errors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 p-3 rounded bg-red-50 text-red-900 border border-red-200">
                            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold">InvalidArgument: Authorization</p>
                                <p className="text-sm">This means you are using the private API endpoint instead of the public viewer URL.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded bg-amber-50 text-amber-900 border border-amber-200">
                            <InfoIcon className="h-5 w-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold">Next.js Image Hostname Error</p>
                                <p className="text-sm">I have already enabled <code>unoptimized: true</code> in your config to bypass this, so you should not see this error anymore.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Test your URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">Paste a full image URL here to see if the browser can load it:</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded"
                            placeholder="https://..."
                            onChange={(e) => setTestImageUrl(e.target.value)}
                        />
                    </div>
                    {testImageUrl && (
                        <div className="mt-4 border p-4 rounded bg-muted/50 text-center">
                            <p className="text-xs text-muted-foreground mb-2">Full URL: {testImageUrl}</p>
                            <img
                                src={testImageUrl}
                                alt="Test"
                                className="max-h-64 mx-auto rounded shadow-sm border"
                                onError={(e) => {
                                    (e.target as any).style.display = 'none';
                                    alert("Failed to load image. This URL is probably private or incorrect.");
                                }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
