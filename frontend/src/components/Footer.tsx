export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Emiscope. All rights reserved.
      </div>
    </footer>
  );
}