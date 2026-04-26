const CARD = "#111827";
const BORDER = "#1F2937";
const TEXT1 = "#E5E7EB";
const TEXT2 = "#9CA3AF";
const TEXT3 = "#6B7280";

export default function Footer() {
  const footerLinks = [
    { title: "Product", links: ["Features", "Pricing", "Security"] },
    { title: "Company", links: ["About Us", "Blog", "Careers"] },
    { title: "Legal", links: ["Privacy", "Terms", "Contact"] },
    { title: "Follow", links: ["Twitter", "LinkedIn", "Discord"] },
  ];

  return (
    <footer style={{ backgroundColor: CARD, borderColor: BORDER }} className="border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerLinks.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-3" style={{ color: TEXT1 }}>{col.title}</h4>
              <ul style={{ color: TEXT2 }} className="space-y-2 text-sm">
                {col.links.map((link, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderColor: BORDER, color: TEXT3 }} className="border-t pt-8 text-center">
          <p>© 2026 Bullox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
