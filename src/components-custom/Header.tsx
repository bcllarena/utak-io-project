function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                My Restaurant
              </span>
            </a>
            <nav className="flex items-center gap-6 text-sm">
              <a
                className={`transition-colors hover:text-foreground/80 text-foreground/60`}
                href="/items"
              >
                Items
              </a>
              <a
                className={`transition-colors hover:text-foreground/80 text-foreground/60`}
                href="/categories"
              >
                Categories
              </a>
              <a
                className={`transition-colors hover:text-foreground/80 text-foreground/60`}
                href="/addons"
              >
                Add-Ons
              </a>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
