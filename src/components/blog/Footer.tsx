export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-center text-xs text-muted dark:text-muted-dark tracking-wide">
          &copy; {new Date().getFullYear()} Blog
        </p>
      </div>
    </footer>
  );
}
