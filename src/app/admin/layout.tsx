export const metadata = {
  title: {
    default: "Back-office Quince",
    template: "%s · Back-office Quince",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
