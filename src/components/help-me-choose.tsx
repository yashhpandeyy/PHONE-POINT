'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { helpMeChoose, HelpMeChooseOutput } from '@/ai/flows/help-me-choose';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, User } from 'lucide-react';

const initialState: {
  result: HelpMeChooseOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Thinking...' : 'Find My Phone'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

async function helpMeChooseAction(
  prevState: typeof initialState,
  formData: FormData
): Promise<typeof initialState> {
  const needs = formData.get('needs') as string;
  const budget = formData.get('budget') as string;

  if (!needs || !budget) {
    return { result: null, error: 'Please fill out all fields.' };
  }

  try {
    const result = await helpMeChoose({ needs, budget });
    return { result, error: null };
  } catch (e) {
    console.error(e);
    return { result: null, error: 'Sorry, I had trouble finding a recommendation. Please try again.' };
  }
}

export function HelpMeChoose() {
  const [state, formAction] = useFormState(helpMeChooseAction, initialState);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold tracking-tight">Can't Decide?</h2>
        <p className="mt-2 text-muted-foreground text-lg">
          Let our AI expert help you find the perfect phone. Just describe what you're looking for and your budget.
        </p>
        <Card className="mt-6 bg-background border-2 border-accent">
          <form action={formAction}>
            <CardHeader>
              <CardTitle>AI Phone Recommender</CardTitle>
              <CardDescription>Tell us your needs to get a personalized recommendation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="needs">What do you need in a phone?</Label>
                <Textarea
                  id="needs"
                  name="needs"
                  placeholder="e.g., 'A great camera for photos, long battery life, and good for gaming.'"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">What's your budget?</Label>
                <Input
                  id="budget"
                  name="budget"
                  placeholder="e.g., 'Under $500' or 'Around $900'"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="h-full min-h-[300px] flex items-center justify-center">
        {state.result && (
          <Card className="w-full max-w-md bg-background animate-in fade-in-50 duration-500">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Here's my recommendation!</CardTitle>
                <CardDescription>Based on your needs, I'd suggest this phone.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">{state.result.recommendedPhone}</h3>
              <p className="text-muted-foreground">{state.result.reason}</p>
            </CardContent>
          </Card>
        )}
        {state.error && (
          <Card className="w-full max-w-md bg-destructive/10 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">An Error Occurred</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{state.error}</p>
            </CardContent>
          </Card>
        )}
        {!state.result && !state.error && (
          <div className="text-center text-muted-foreground">
            <Bot className="h-16 w-16 mx-auto" />
            <p className="mt-4">Your recommendation will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
