
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { setupDatabase } from '@/lib/appwrite-setup';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SetupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; logs?: string[] } | null>(null);

    const handleSetup = async () => {
        setIsLoading(true);
        setResult(null);
        const response = await setupDatabase();
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="container py-12">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Appwrite Database Setup</CardTitle>
                        <CardDescription>
                            Click the button below to automatically configure your 'phone' collection with the necessary attributes and indexes. This process is idempotent, meaning it's safe to run multiple times.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleSetup} disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Configuring... this may take a minute.
                                </>
                            ) : 'Configure Database'}
                        </Button>
                        {result && (
                            <Alert variant={result.success ? 'default' : 'destructive'}>
                                {result.success ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                <AlertTitle>{result.success ? 'Success!' : 'Error'}</AlertTitle>
                                <AlertDescription>{result.message}</AlertDescription>
                            </Alert>
                        )}
                        {result?.logs && (
                             <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted text-sm font-mono">
                                {result.logs.map((log, i) => (
                                    <p key={i}>{log}</p>
                                ))}
                            </ScrollArea>
                        )}
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            Before running, ensure you have set the <code className="font-semibold p-1 bg-muted rounded-sm">APPWRITE_API_KEY</code> in your <code className="font-semibold p-1 bg-muted rounded-sm">.env</code> file with <code className="font-semibold">databases.write</code> permissions.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
