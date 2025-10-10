import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export default function Custom404() {
  const { asPath } = useRouter();
  const { frontMatter } = useConfig();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p>
        <a href="/">← Back to Home</a>
      </p>
    </div>
  );
}
