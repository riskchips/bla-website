import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Skeleton from "../components/Skeleton";
import { getTerms } from "../api";

const Terms = () => {
  const [text, setText] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    getTerms().then((r) => setText(r.terms || "")).catch((e) => setErr(e.message));
  }, []);
  return (
    <PageTransition>
      <section className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="section-title">Terms</h1>
            <Ornament />
          </div>
          {err && <div className="alert error">{err}</div>}
          {text === null && !err && (
            <div className="prose">
              <Skeleton height={14} /><div style={{ height: 8 }} />
              <Skeleton height={14} /><div style={{ height: 8 }} />
              <Skeleton height={14} width="80%" />
            </div>
          )}
          {text !== null && <div className="prose">{text}</div>}
        </div>
      </section>
    </PageTransition>
  );
};

export default Terms;
