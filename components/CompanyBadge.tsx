"use client";

export function CompanyBadge({ name, displayName }: { name: string; displayName?: string }) {
  const domain =
    name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com";
  const label = displayName || name;
  const initials = label.slice(0, 2).toUpperCase();
  return (
    <span className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-xl shadow-sm">
      {!displayName && (
        <span className="relative flex-shrink-0 w-5 h-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://logo.clearbit.com/${domain}`}
            alt={name}
            width={20}
            height={20}
            className="rounded-sm object-contain w-5 h-5"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const fb = el.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = "flex";
            }}
          />
          <span className="absolute inset-0 hidden items-center justify-center bg-gray-100 rounded-sm text-gray-500 font-bold text-xs">
            {initials}
          </span>
        </span>
      )}
      {label}
    </span>
  );
}
