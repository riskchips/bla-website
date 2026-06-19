import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import AlpanaDivider from "../components/AlpanaDivider";

const pillars = [
  { icon: "ক", title: "Literature", desc: "Open mics, recitations, poetry circles and writing workshops." },
  { icon: "চ", title: "Art & Drawing", desc: "Sketchwalks, alpana sessions and exhibitions across the year." },
  { icon: "ট", title: "Music & Dance", desc: "Rabindra Sangeet, classical, folk, and contemporary performances." },
  { icon: "প", title: "Community", desc: "Festivals, talent showcases and the warmth of an old adda." },
];

const About = () => (
  <PageTransition>
    <section className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">আমাদের কথা</span>
          <h1 className="section-title">About the Association</h1>
          <Ornament />
          <p className="section-subtitle">A cultural home, not a corporate club.</p>
        </div>

        <div className="prose">
          <p>
            The Bengali Literary Association — <span className="bn">বাংলা সাহিত্য সংঘ</span> —
            began as a small gathering of students who missed the sound of Bengali in the corridors
            of our college. Today, it is a full cultural club open to every student, no matter
            where they come from or which language they grew up with.
          </p>
          <p>
            We celebrate the things that have always made Bengali culture beautiful: the rhythm of
            its poetry, the colour of its art, the depth of its music, and the joy of sitting
            together over conversation and chai. From Rabindra Jayanti to open mics, from sketch
            sessions to dance performances, every event is built by students for students.
          </p>
          <p>
            BLA is not about formality. It is about belonging. If you love a song, a story, or a
            single line of verse — you already belong here.
          </p>
        </div>

        <AlpanaDivider />

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span className="eyebrow">আমাদের স্তম্ভ</span>
          <h2 className="section-title" style={{ fontSize: "2rem" }}>Our Pillars</h2>
        </div>

        <div className="pillars">
          {pillars.map((p) => (
            <div className="pillar cursor-target" key={p.title}>
              <div className="icon bn">{p.icon}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <AlpanaDivider />

        <div className="prose">
          <h3 className="italic-en">Our Promise</h3>
          <p>
            To keep this club student-led, welcoming, and rooted in culture — not trends. To
            give every member a stage, a notebook, a brush, or simply a chair in the circle.
          </p>
          <p className="bn">— শব্দে শব্দে বাংলা, সুরে সুরে আমরা।</p>
        </div>
      </div>
    </section>
  </PageTransition>
);

export default About;
