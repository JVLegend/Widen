import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-lg text-muted-foreground">Página não encontrada</p>
      <Link href="/" className="text-sm text-primary underline underline-offset-4 hover:opacity-80">
        Voltar ao início
      </Link>
    </div>
  );
}
