"use client";

import { useState } from "react";
import SpinPage from "./spinPage";
import HomePage from "./homePage";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return loading ? <SpinPage onFinish={() => setLoading(false)} /> : <HomePage />;
}