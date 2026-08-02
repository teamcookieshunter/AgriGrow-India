import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Award } from "lucide-react"
import { allSchemes, type Scheme } from './data';

// In a real app, this would be fetched based on the logged-in user's profile.
const currentUserState = "Maharashtra";

export default function SchemesPage() {
  
  const filteredSchemes = allSchemes.filter(scheme => 
    scheme.level === 'National' || (scheme.level === 'State' && scheme.state === currentUserState)
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Government Schemes</h1>
      <p className="text-muted-foreground">Showing national and state-level schemes for <span className="font-semibold text-primary">{currentUserState}</span>.</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => (
          <Card key={scheme.title} className="flex flex-col border-t-4 border-primary">
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-xl">{scheme.title}</CardTitle>
                <Badge variant={scheme.level === 'National' ? 'default' : 'secondary'} className="flex-shrink-0">
                  {scheme.level === 'National' ? 'National' : scheme.state}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">{scheme.category}</Badge>
              </div>
              <CardDescription className="pt-4">{scheme.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2"><Award className="h-5 w-5 text-amber-500"/> Key Features</h4>
                <ul className="space-y-2">
                  {scheme.keyFeatures.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Eligibility Highlights</h4>
                <ul className="space-y-2">
                  {scheme.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full">Check Eligibility & Apply</Button>
            </CardFooter>
          </Card>
        )) : (
          <Card className="md:col-span-2">
            <CardContent className="h-48 flex items-center justify-center">
              <p className="text-muted-foreground">No schemes available for the selected location.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
