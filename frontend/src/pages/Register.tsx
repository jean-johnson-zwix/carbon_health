import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const BASE = import.meta.env.VITE_API_URL as string;

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    heat_source: 'electric',
    housing: 'studio',
    income: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onChange = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, income: Number(form.income) }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await r.json();
      toast({ title: 'Account created', description: 'Please log in.' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>It only takes a minute</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div><Label>Username</Label><Input value={form.username} onChange={(e) => onChange('username', e.target.value)} required /></div>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => onChange('name', e.target.value)} required /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} required /></div>
            <div><Label>Heating source</Label><Input value={form.heat_source} onChange={(e) => onChange('heat_source', e.target.value)} /></div>
            <div><Label>Housing</Label><Input value={form.housing} onChange={(e) => onChange('housing', e.target.value)} /></div>
            <div><Label>Monthly income (number)</Label><Input type="number" value={form.income} onChange={(e) => onChange('income', e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
            <p className="text-sm text-muted-foreground text-center">
              Have an account? <Link className="underline" to="/login">Sign in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}