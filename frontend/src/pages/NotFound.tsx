import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, Calculator, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold font-sora mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or doesn't exist.
          </p>
          
          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/calculator')} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Carbon Calculator
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}