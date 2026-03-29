import { Suspense } from "react";
import VerifyPage from "./verifyClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyPage/>
    </Suspense>
  );
}