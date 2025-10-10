import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export default function CustomError({ statusCode }: { statusCode: number }) {
  const { asPath } = useRouter();
  const { frontMatter } = useConfig();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>{statusCode} - Error</h1>
      <p>An error occurred while loading this page.</p>
      <p>
        <a href="/">← Back to Home</a>
      </p>
    </div>
  );
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
