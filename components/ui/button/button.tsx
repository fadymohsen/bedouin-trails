import { Link } from "@/lib/i18n/navigation";
import styles from "./button.module.scss";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
};

export default function Button({ href, children, variant = "solid" }: ButtonProps) {
  return (
    <Link href={href} className={`${styles.button} ${variant === "outline" ? styles.outline : ""}`}>
      {children}
    </Link>
  );
}
