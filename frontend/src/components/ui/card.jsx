// components/ui/card.jsx
export function Card({ className, children }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-3  pb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="text-gray-700">{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="mt-3 border-t pt-2 text-sm">{children}</div>;
}
