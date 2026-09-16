import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  title: string;
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({
  title,
  items,
  className = "",
}: BreadcrumbProps) {
  return (
    <div
      className={`flex min-h-20 w-full flex-col justify-center overflow-hidden rounded-xl bg-white ${className}`}
    >
      <div className="px-4">
        <h1 className="text-lg font-semibold">{title}</h1>

        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center text-xs text-gray-500">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li
                  key={`${item.label}-${index}`}
                  className="flex items-center"
                >
                  {index > 0 && (
                    <ChevronRight
                      size={15}
                      className="mx-1 shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                  )}

                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? "page" : undefined}
                      className={isLast ? "text-gray-600" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
