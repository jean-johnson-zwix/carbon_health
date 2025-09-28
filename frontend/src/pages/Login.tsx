import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
//import { setAuth } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

const BASE = import.meta.env.VITE_API_URL as string;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { login } = useAuth();
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json(); // { access_token, token_type, username }
      const token = data.access_token || data.token;
      if (!token) throw new Error('No token in response');
      login(token, data.username ?? username);
      toast({ title: 'Logged in', description: 'Welcome back!' });
      navigate('/calculator');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message ?? 'Check credentials', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your username and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              No account? <Link className="underline" to="/register">Create one</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
