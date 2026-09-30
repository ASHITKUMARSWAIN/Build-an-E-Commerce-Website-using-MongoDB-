'use client';

import { useEffect, useState, type FormEvent } from "react";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

type SortOption = "featured" | "price-low" | "price-high" | "name";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function titleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiResults, setAiResults] = useState<Product[] | null>(null);
  const [aiSearchMessage, setAiSearchMessage] = useState("");
  const [aiSearchError, setAiSearchError] = useState("");
  const [aiSearching, setAiSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("We couldn't load the catalog.");
        }

        const data: Product[] = await response.json();
        if (!cancelled) {
          setProducts(data);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("The catalog could not be loaded. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = Array.from(new Set(products.map((product) => product.category)))
    .sort((first, second) => first.localeCompare(second));
  const normalizedSearch = search.trim().toLowerCase();
  const visibleProducts = (aiResults ?? products)
    .filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        aiResults !== null ||
        normalizedSearch.length === 0 ||
        `${product.title} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    })
    .sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "name") return first.title.localeCompare(second.title);
      return 0;
    });

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();

    if (!query) {
      setAiSearchError("Enter an occasion or product you are looking for.");
      return;
    }

    setAiSearching(true);
    setAiSearchError("");
    setAiSearchMessage("");

    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI search could not complete.");
      }

      setAiResults(Array.isArray(data.products) ? data.products : []);
      setAiSearchMessage(data.message || "Here are some relevant products.");
      setActiveCategory("all");
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    } catch (searchError) {
      setAiSearchError(
        searchError instanceof Error ? searchError.message : "AI search could not complete."
      );
    } finally {
      setAiSearching(false);
    }
  }

  function updateSearch(value: string) {
    setSearch(value);
    setAiResults(null);
    setAiSearchMessage("");
    setAiSearchError("");
  }

  function clearFilters() {
    setSearch("");
    setActiveCategory("all");
    setSort("featured");
    setAiResults(null);
    setAiSearchMessage("");
    setAiSearchError("");
  }

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-[#20251f]">
      <div className="bg-[#244c3c] px-4 py-2 text-center text-xs font-medium tracking-[0.08em] text-white">
        COMPLIMENTARY DELIVERY ON ORDERS OVER $75
      </div>

      <header className="border-b border-[#deded6] bg-[#fbfbf8]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-12">
          <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Morrow Goods home">
            <span className="grid size-9 place-items-center bg-[#d3ef69] text-sm font-black text-[#20251f]">M</span>
            <span className="text-sm font-bold tracking-[0.04em]">MORROW GOODS</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#5c625c] md:flex" aria-label="Main navigation">
            <a href="#catalog" className="text-[#20251f]">Shop all</a>
            <a href="#catalog" className="transition-colors hover:text-[#244c3c]">New finds</a>
            <a href="#about" className="transition-colors hover:text-[#244c3c]">Our edit</a>
          </nav>

          <label className="flex w-full max-w-[290px] items-center gap-2 border-b border-[#b9bcb3] py-2 text-[#697068] focus-within:border-[#244c3c]">
            <span aria-hidden="true" className="text-lg leading-none">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search the collection"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#20251f] outline-none placeholder:text-[#858a82]"
              aria-label="Search products"
            />
            <kbd className="hidden border border-[#deded6] px-1.5 py-0.5 text-[10px] sm:block">⌘ K</kbd>
          </label>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <section className="mb-9 flex flex-col justify-between gap-6 border-b border-[#deded6] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#54725e]">Useful things, chosen well</p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">The everyday edit<span className="text-[#e56c48]">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#666d65]">Good design for daily life. Explore the full collection, from considered essentials to little upgrades.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#666d65]">
            <span className="grid size-10 place-items-center border border-[#deded6] bg-white text-base font-semibold text-[#244c3c]">{loading ? "–" : products.length}</span>
            <span>objects<br />in the collection</span>
          </div>
        </section>

        <section id="catalog" aria-label="Product catalog">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                aria-pressed={activeCategory === "all"}
                className={`shrink-0 px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === "all" ? "bg-[#244c3c] text-white" : "border border-[#deded6] bg-white text-[#555d55] hover:border-[#244c3c]"}`}
              >
                Everything
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`shrink-0 px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === category ? "bg-[#244c3c] text-white" : "border border-[#deded6] bg-white text-[#555d55] hover:border-[#244c3c]"}`}
                >
                  {titleCase(category)}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#deded6] pt-3 text-sm lg:border-0 lg:pt-0">
              <p className="text-[#666d65]" aria-live="polite">
                {loading ? "Loading collection…" : `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"}`}
              </p>
              <label className="flex items-center gap-2 font-medium text-[#454c45]">
                <span>Sort</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="bg-transparent py-2 pr-1 text-sm outline-none"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
          </div>

          {aiSearchMessage && <p className="mb-5 text-sm text-[#54725e]" aria-live="polite">{aiSearchMessage}</p>}
          {aiSearchError && <p className="mb-5 text-sm text-[#a3432b]" role="alert">{aiSearchError}</p>}

          {error ? (
            <div className="border border-[#e3c1b4] bg-[#fff7f2] px-6 py-12 text-center">
              <p className="font-semibold text-[#743e2b]">Could not load the collection</p>
              <p className="mt-2 text-sm text-[#765b50]">{error}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-5 bg-[#244c3c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183b2d]">
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#e8e9e2]" />
                  <div className="mt-4 h-3 w-1/3 bg-[#e8e9e2]" />
                  <div className="mt-3 h-4 w-3/4 bg-[#e8e9e2]" />
                  <div className="mt-3 h-4 w-1/4 bg-[#e8e9e2]" />
                </div>
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">
              {visibleProducts.map((product, index) => (
                <article key={product._id} className="group min-w-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e9e2]">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading={index < 8 ? "eager" : "lazy"}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 bg-[#fbfbf8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.11em] text-[#465047]">
                      {titleCase(product.category)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 pt-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-[#252b25] sm:text-base">{product.title}</h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#737970] sm:text-sm">{product.description}</p>
                    </div>
                    <p className="shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-[#252b25]">{currency.format(product.price)}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-[#deded6] bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold">Nothing found this time.</p>
              <p className="mt-2 text-sm text-[#666d65]">Try another search or reset the filters.</p>
              <button type="button" onClick={clearFilters} className="mt-5 border border-[#244c3c] px-4 py-2 text-sm font-semibold text-[#244c3c] hover:bg-[#244c3c] hover:text-white">
                Clear filters
              </button>
            </div>
          )}
          <form onSubmit={handleSearch} className="mx-auto mt-10 flex max-w-lg items-center gap-3">
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-[#b9bcb3] py-3 text-[#697068] focus-within:border-[#244c3c]">
              <span aria-hidden="true" className="text-lg leading-none">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Ask what to wear or find"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#20251f] outline-none placeholder:text-[#858a82]"
                aria-label="Search all products"
              />
            </label>
            <button
              type="submit"
              disabled={aiSearching}
              className="shrink-0 bg-[#244c3c] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#183b2d] disabled:cursor-wait disabled:opacity-60"
            >
              {aiSearching ? "Thinking..." : "Ask AI"}
            </button>
          </form>
        </section>

        <footer id="about" className="mt-20 flex flex-col justify-between gap-3 border-t border-[#deded6] pt-6 text-xs text-[#737970] sm:flex-row">
          <p>Thoughtful finds for the way we live now.</p>
          <p>© {new Date().getFullYear()} Morrow Goods</p>
        </footer>
      </main>
    </div>
  );
}