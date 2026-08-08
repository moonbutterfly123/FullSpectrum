import { BirdFooter } from "@/components/Layout";

export default function BirdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BirdFooter />
    </>
  );
}
