import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export default function Custom500() {
  const { asPath } = useRouter();
  const { frontMatter } = useConfig();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>500 - Server Error</h1>
      <p>Something went wrong on our end.</p>
      <p>
        <a href="/">← Back to Home</a>
      </p>
    </div>
  );
}
