import db from "@repo/db/client";
import { Button } from "@repo/ui/button";
import useBalance from "@repo/store/useBalance";

export default function Page(): JSX.Element {
  const balance = useBalance();
  return (
    <div className="text-2xl">
      <Button onClick={() => {}}>Button from Merchant</Button>
    </div>
  );
}
