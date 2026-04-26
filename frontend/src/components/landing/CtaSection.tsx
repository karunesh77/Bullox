import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BORDER = "#1F2937";
const TEXT1 = "#E5E7EB";
const TEXT2 = "#9CA3AF";
const BLUE = "#3B82F6";

export default function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(34,197,94,0.1) 100%)", borderColor: BORDER }} className="max-w-4xl mx-auto border rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: TEXT1 }}>Ready to Start Trading?</h2>
        <p style={{ color: TEXT2 }} className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of traders using Bullox to make smarter trading decisions every day. Get started for free today.</p>
        <button onClick={() => navigate("/dashboard")} style={{ backgroundColor: BLUE }} className="px-8 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 mx-auto">
          Get Started Free
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
