import Link from "next/link";

const navLinks = [
  { label: "For customers", href: "#customers" },
  { label: "For stores", href: "#stores" },
  { label: "The score", href: "#score" },
];

function Footer() {
  return (
    <footer className="bg-section-base">
      {/* Get started */}
      <div className={`container-page py-20`}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-kicker font-medium tracking-[0.16em] text-accent2-500">
              GET STARTED
            </span>
            <h2 className="font-display text-h2 text-accent-900 lg:text-[40px]">
              Start building your score
            </h2>
            <p className="text-lead text-accent-700">
              One verified number is all it takes. Your first order starts the
              record.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center rounded-md bg-accent2-500 px-6 text-body font-medium text-accent-100 hover:bg-accent2-600"
            >
              Create an account
            </Link>

            <Link
              href="/store/signup"
              className="flex h-12 items-center justify-center rounded-md border border-accent-600 px-6 text-body font-medium text-accent-900 hover:bg-section-glow"
            >
              Open a store account
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-section-glow">
        <div
          className={`container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between`}
        >
          <p className="text-2xs text-accent-700">
            Thiqa - cash on delivery, scored.
          </p>
          <ul className="flex flex-wrap gap-6">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-2xs text-accent-700 hover:text-accent-900"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
