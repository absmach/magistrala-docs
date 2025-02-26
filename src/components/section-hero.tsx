import { heroData } from "../data/data";

export function HeroSection() {
  return (
    <section>
      <div className="container">
        <div>
          <div>
            <h1>{heroData.title}</h1>
            <p>{heroData.subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
