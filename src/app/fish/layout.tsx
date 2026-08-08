import { FishFooter } from "@/components/Layout";

export default function FishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FishFooter />
    </>
  );
}
