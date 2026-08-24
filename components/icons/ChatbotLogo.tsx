type ChatbotLogoProps = {
  size?: number;
  className?: string;
};

/**
 * Logo for the Vault assistant chatbot.
 *
 * Deliberately built from two unambiguous signals layered together:
 * - a classic speech-bubble silhouette, so it reads as "chat" at a glance
 * - a small sparkle badge, the common shorthand for "AI-powered"
 *
 * Rendered in the app's existing gold-on-dark vault palette so it still
 * feels native to this app rather than a generic bot icon.
 */
export default function ChatbotLogo({ size = 28, className }: ChatbotLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Vault assistant chatbot"
    >
      {/* Speech bubble */}
      <path
        d="M8 14c0-3.314 2.686-6 6-6h16c3.314 0 6 2.686 6 6v12c0 3.314-2.686 6-6 6H19.5L12 39v-7h-.5c-1.933 0-3.5-1.567-3.5-3.5V14z"
        fill="#C9A45C"
      />
      {/* Typing dots inside the bubble — reinforces "live chat" */}
      <circle cx="17.5" cy="19.5" r="2" fill="#0B0D12" />
      <circle cx="24" cy="19.5" r="2" fill="#0B0D12" />
      <circle cx="30.5" cy="19.5" r="2" fill="#0B0D12" />
      {/* Sparkle badge — "AI-powered" shorthand */}
      <path
        d="M37.5 4l1.7 4.8 4.8 1.7-4.8 1.7-1.7 4.8-1.7-4.8-4.8-1.7 4.8-1.7L37.5 4z"
        fill="#F2E7C9"
        stroke="#0B0D12"
        strokeWidth="0.75"
      />
    </svg>
  );
}
