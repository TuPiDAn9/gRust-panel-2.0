import { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

export function Icons() {
  return null
}

Icons.steam = ({ className, ...props }: IconProps) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15.56v.44c0 1.67 1.33 3 3 3v1.93zm7.93-3.37c-.46.17-.95.27-1.46.31v-2.02c.91-.28 1.62-.99 1.9-1.9h2.02c.04.51.14 1 .31 1.46.39 1.11.51 2.31.31 3.51zM15 11c0-1.1-.9-2-2-2v-1c-1.1 0-2 .9-2 2h-1c0 1.1.9 2 2 2v1c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2h1c0-1.1-.9-2-2-2z"/>
  </svg>
)

Icons.spinner = ({ className, ...props }: IconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)