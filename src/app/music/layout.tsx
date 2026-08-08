import { MusicFooter } from "@/components/Layout";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MusicFooter />
    </>
  );
}
