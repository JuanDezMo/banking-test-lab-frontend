import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Página temporal de la iteración 0; se reemplazará por login y dashboard
export function HomePage() {
  return (
    <section aria-labelledby="home-title" className="home-page" data-testid="home-page">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 id="home-title" className="text-2xl font-semibold">
              Welcome to Bank Lab
            </h1>
          </CardTitle>
          <CardDescription>A simple banking app to learn React and TypeScript.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign up, open accounts, transfer money and check your history. Coming soon.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
