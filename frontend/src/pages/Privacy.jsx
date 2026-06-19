import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Skeleton from "../components/Skeleton";
import { getPrivacy } from "../api";

const Privacy = () => {
  const [text, setText] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    getPrivacy().then((r) => setText(r.privacy || "")).catch((e) => setErr(e.message));
  }, []);
  return (
    <PageTransition>
      <section className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="section-title">Privacy</h1>
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

export default Privacy;
