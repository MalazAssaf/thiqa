import Link from "next/link";
import Image from "next/image";

function LandingNav() {
  const navLinks = [
    { label: "For customers", href: "#customers" },
    { label: "For stores", href: "#stores" },
    { label: "The score", href: "#score" },
  ];

  return (
    <div className="bg-section-base">
      <div
        className={`container-page flex items-center justify-between gap-8 py-5`}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo-light.svg" alt="" width={24} height={24} />
          <span className="font-display text-h4 text-accent-900">Thiqa</span>
        </Link>
        <ul className="hidden items-center gap-6 sm:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs text-accent-700 hover:text-accent-900"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-medium text-accent-900">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-accent2-500 px-4 py-2.5 text-xs font-medium text-section-base hover:bg-accent2-600"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingNav;
