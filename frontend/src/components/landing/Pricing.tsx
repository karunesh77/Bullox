import { useNavigate } from "react-router-dom";

const BG = "#0B0F19";
const CARD = "#111827";
const BORDER = "#1F2937";
const TEXT1 = "#E5E7EB";
const TEXT2 = "#9CA3AF";
const GREEN = "#22C55E";
const BLUE = "#3B82F6";

const pricing = [
  { name: "Free", price: "$0", period: "Forever free", features: ["Basic signals", "Portfolio tracking", "Market data", "Community support"], highlighted: false },
  { name: "Pro", price: "$29", period: "Per month", features: ["Premium signals", "Advanced analytics", "Real-time alerts", "Email support", "Copy trading"], highlighted: true },
  { name: "Elite", price: "$99", period: "Per month", features: ["All Pro features", "API access", "Custom alerts", "Priority support", "Portfolio management"], highlighted: false },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" style={{ backgroundColor: CARD }} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: TEXT1 }}>Simple, Transparent Pricing</h2>
        <p style={{ color: TEXT2 }} className="text-center max-w-2xl mx-auto mb-16">Choose the perfect plan for your trading needs. All plans include access to our core trading features.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, idx) => (
            <div key={idx} style={{ backgroundColor: BG, borderColor: plan.highlighted ? BLUE : BORDER }} className={`border-2 rounded-xl p-8 transition-all ${plan.highlighted ? "md:scale-105" : ""}`}>
              <h3 className="text-2xl font-bold mb-2" style={{ color: TEXT1 }}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold" style={{ color: BLUE }}>{plan.price}</span>
                <span style={{ color: TEXT2 }} className="text-sm">{plan.period}</span>
              </div>
              <p style={{ color: TEXT2 }} className="mb-6 text-sm">Get started with {plan.name}</p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feat, i) => (
                  <li key={i} style={{ color: TEXT2 }} className="flex items-center gap-2 text-sm">
                    <span style={{ color: GREEN }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/dashboard")} style={{ backgroundColor: BLUE }} className="w-full py-2.5 rounded-lg text-white font-semibold transition-all hover:opacity-90">
                {plan.price === "$0" ? "Get Started" : "Start Free Trial"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
