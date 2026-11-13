import Link from "next/link";

export interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "cap" | "book" | "document";
  href?: string;
}

const sizeConfig = {
  sm: {
    icon: "w-5 h-5",
    text: "text-lg",
    gap: "gap-2",
  },
  md: {
    icon: "w-6 h-6",
    text: "text-xl",
    gap: "gap-2.5",
  },
  lg: {
    icon: "w-8 h-8",
    text: "text-2xl",
    gap: "gap-3",
  },
};

export default function Logo({
  className = "",
  iconClassName = "",
  textClassName = "",
  showText = true,
  size = "md",
  variant = "cap",
  href,
}: LogoProps) {
  const currentSize = sizeConfig[size] || sizeConfig.md;

  const renderIcon = () => {
    const baseIconClasses = `${currentSize.icon} text-blue-600 shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconClassName}`.trim();

    switch (variant) {
      case "book":
        return (
          <svg
            className={baseIconClasses}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Academic book with document lines */}
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
            <path d="M6 14h6" />
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          </svg>
        );

      case "document":
        return (
          <svg
            className={baseIconClasses}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Document sheet with folded corner */}
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            {/* Graduation Cap Seal */}
            <path d="M8 13l4-2 4 2-4 2-4-2z" />
            <path d="M9.5 14.5V17c0 .8 1.1 1.5 2.5 1.5s2.5-.7 2.5-1.5v-2.5" />
          </svg>
        );

      case "cap":
      default:
        return (
          <svg
            className={baseIconClasses}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Balanced graduation mortarboard */}
            <path d="M12 2.5 2 7l10 4.5L22 7l-10-4.5Z" />
            {/* Cap band & book curve */}
            <path d="M6 10.5v5.5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5.5" />
            {/* Tassel with bead */}
            <path d="M21 7.5v5" />
            <circle cx="21" cy="13" r="0.8" fill="currentColor" />
          </svg>
        );
    }
  };

  const content = (
    <span
      className={`inline-flex items-center ${currentSize.gap} select-none ${className}`.trim()}
    >
      {renderIcon()}
      {showText && (
        <span
          className={`${currentSize.text} font-bold tracking-tight text-gray-900 transition-colors ${textClassName}`.trim()}
        >
          Apo<span className="text-blue-600">Docs</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
