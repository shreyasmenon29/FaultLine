"use client";

import { useState } from "react";
import Link from "next/link";
import { TRACKS, TRACK_META } from "@/lib/tracks-meta";

const RED = "#ff0000";
const CYAN = "#00f0ff";

function Corners() {
  return (
    <>
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: RED }} />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: RED }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: RED }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: RED }} />
    </>
  );
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    registerNumber: "",
    name: "",
    email: "",
    phone: "",
    track: TRACKS[0] || "Banking"
  });

  // Default to 2 teammates (Total Team Size = 3 members: 1 Leader + 2 Teammates)
  const [teammateCount, setTeammateCount] = useState(2);
  const [teammates, setTeammates] = useState([
    { name: "", registerNumber: "", email: "", phone: "" },
    { name: "", registerNumber: "", email: "", phone: "" }
  ]);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isCheckboxHovered, setIsCheckboxHovered] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeammateCountChange = (count) => {
    const newCount = Math.max(2, Math.min(4, count));
    setTeammateCount(newCount);

    setTeammates((prev) => {
      const updated = [...prev];
      if (newCount > updated.length) {
        for (let i = updated.length; i < newCount; i++) {
          updated.push({ name: "", registerNumber: "", email: "", phone: "" });
        }
      } else {
        updated.splice(newCount);
      }
      return updated;
    });
  };

  const handleTeammateFieldChange = (index, field, value) => {
    setTeammates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessData(null);

    if (!termsAgreed) {
      setErrorMsg("You must agree to the terms and conditions to register.");
      setLoading(false);
      return;
    }

    const totalMembers = 1 + teammateCount;
    if (totalMembers < 3 || totalMembers > 5) {
      setErrorMsg("A team must consist of minimum 3 and maximum 5 members.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      teammateCount,
      teammates,
      termsAgreed: true
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Registration failed. Please check details.");
      } else {
        setSuccessData(data.registration);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden bg-[#0a0a0a] text-[#f5f5f0]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(0 240 255 / 15%) 1px, transparent 1px), repeating-radial-gradient(circle at center, transparent 0, transparent 120px, rgb(0 240 255 / 4%) 121px, transparent 122px)",
        backgroundSize: "32px 32px, 100% 100%",
        fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif"
      }}
    >
      {/* Background Decorative Graphic Overlays */}
      <svg
        className="absolute top-10 left-10 w-28 h-28 opacity-[0.08] pointer-events-none"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke={CYAN} strokeWidth="1" strokeDasharray="8,6" />
        <line x1="50" y1="0" x2="50" y2="100" stroke={CYAN} strokeWidth="1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke={CYAN} strokeWidth="1" />
      </svg>
      <svg
        className="absolute bottom-10 right-10 w-40 h-40 opacity-[0.06] pointer-events-none"
        viewBox="0 0 100 100"
      >
        <rect x="10" y="10" width="80" height="80" fill="none" stroke={CYAN} strokeWidth="1" strokeDasharray="4,16" />
        <rect x="20" y="20" width="60" height="60" fill="none" stroke={CYAN} strokeWidth="1" />
      </svg>

      <section className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <div className="mb-10 w-full text-center">
          <p
            className="mb-4 text-xs tracking-[0.3em] uppercase text-white/70"
            style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
          >
            <span style={{ color: CYAN }} className="font-bold mr-1">{"///"}</span> TEAM REGISTRATION (3 TO 5 MEMBERS)
          </p>

          <h1
            className="text-[clamp(3rem,8vw,5.5rem)] uppercase leading-[0.9]"
            style={{
              fontFamily: "'Clarendon', 'Rockwell', 'Arvo', serif",
              fontWeight: 700,
              letterSpacing: "-0.03em"
            }}
          >
            <span className="relative inline-block isolate">
              <span
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  color: RED,
                  transform: "translate(-3px, 2px)"
                }}
              >
                REGISTER
              </span>

              <span
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  color: CYAN,
                  transform: "translate(3px, -2px)"
                }}
              >
                REGISTER
              </span>

              REGISTER
            </span>
          </h1>
        </div>

        {/* Main Form Box */}
        <div className="relative w-full p-8 md:p-12 border border-white/10 bg-black/80 backdrop-blur-sm">
          <Corners />

          {/* Success Banner */}
          {successData ? (
            <div className="flex flex-col gap-6 py-4">
              <div
                className="border-l-[4px] bg-[#00f0ff]/10 p-5 text-left"
                style={{
                  borderLeftColor: CYAN,
                  fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace"
                }}
              >
                <p className="text-xs uppercase tracking-[0.2em] mb-1 font-bold" style={{ color: CYAN }}>
                  {"/// REGISTRATION SUCCESSFUL"}
                </p>
                <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-1">
                  TEAM REGISTRATION CONFIRMED
                </h3>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: CYAN }}>
                  TOTAL TEAM SIZE: {successData.total_team_size} MEMBERS
                </p>
                <div className="text-sm text-white/80 space-y-2 border-t border-white/10 pt-3">
                  <p>
                    <span className="text-white/50">LEADER REGISTER NO:</span>{" "}
                    <strong style={{ color: CYAN }}>{successData.register_number}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">LEADER NAME:</span>{" "}
                    <strong>{successData.name}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">LEADER EMAIL:</span>{" "}
                    <strong>{successData.email}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">LEADER PHONE:</span>{" "}
                    <strong>{successData.phone}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">TRACK:</span>{" "}
                    <strong style={{ color: RED }}>{successData.track}</strong>
                  </p>
                  {successData.teammate_count > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/20">
                      <p className="text-xs uppercase font-bold mb-2" style={{ color: CYAN }}>
                        REGISTERED TEAMMATES ({successData.teammate_count})
                      </p>
                      <div className="space-y-2 pl-2 border-l border-white/20">
                        {successData.teammates.map((tm, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-white/50">#{idx + 1}:</span>{" "}
                            <strong>{tm.name}</strong> ({tm.register_number})
                            {tm.email && <span className="text-white/60"> — {tm.email}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/login"
                  className="group flex-1 flex items-center justify-center border-[4px] border-white bg-black py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[6px_6px_0_0_white] transition-all duration-200 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                  Proceed to Login →
                </Link>
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="px-6 py-4 font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-white/60 text-white/70 hover:text-white transition-colors"
                >
                  Register Another Team
                </button>
              </div>
            </div>
          ) : (
            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              {/* Error Banner */}
              {errorMsg && (
                <p
                  className="border-l-[3px] pl-4 py-3 text-xs tracking-wide uppercase"
                  style={{
                    borderColor: RED,
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    color: RED,
                    fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace"
                  }}
                >
                  {errorMsg}
                </p>
              )}

              {/* PRIMARY REGISTRANT / LEADER SECTION */}
              <div className="pb-4 border-b border-white/10">
                <p
                  className="text-xs uppercase tracking-[0.3em] font-bold mb-4"
                  style={{ color: CYAN, fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                >
                  <span style={{ color: CYAN }} className="mr-1">{"///"}</span> LEADER / PRIMARY DETAILS
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field: Register Number */}
                  <div>
                    <label
                      htmlFor="registerNumber"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Register Number <span style={{ color: RED }}>*</span>
                    </label>
                    <input
                      id="registerNumber"
                      name="registerNumber"
                      type="text"
                      required
                      placeholder="e.g. 21BCE0001"
                      value={formData.registerNumber}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00f0ff] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field: Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Full Name <span style={{ color: RED }}>*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00f0ff] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field: Email ID */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Email ID <span style={{ color: RED }}>*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00f0ff] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field: Phone no */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Phone No <span style={{ color: RED }}>*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00f0ff] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Field: Track Selection */}
                <div className="mt-4">
                  <label
                    htmlFor="track"
                    className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                    style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                  >
                    Track <span style={{ color: RED }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="track"
                      name="track"
                      value={formData.track}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/20 focus:border-[#00f0ff] px-4 py-3.5 text-base font-mono text-[#f5f5f0] focus:outline-none appearance-none cursor-pointer transition-colors"
                    >
                      {TRACKS.map((t) => {
                        const meta = TRACK_META[t];
                        return (
                          <option key={t} value={t} className="bg-black text-white py-2">
                            {t} {meta?.desc ? `— ${meta.desc}` : ""}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/60 font-mono text-xs">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* TOTAL TEAM SIZE SELECTION (RED ACCENT BUTTONS) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="text-xs tracking-[0.25em] uppercase text-white/60"
                    style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                  >
                    <span style={{ color: CYAN }} className="mr-1">{"///"}</span> Total Team Size (Min 3, Max 5 People)
                  </label>
                  <span className="text-xs font-mono font-bold" style={{ color: RED }}>
                    {1 + teammateCount} Members Selected
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { total: 3, teammates: 2, label: "3 Members" },
                    { total: 4, teammates: 3, label: "4 Members" },
                    { total: 5, teammates: 4, label: "5 Members" }
                  ].map((option) => {
                    const isSelected = teammateCount === option.teammates;
                    return (
                      <button
                        key={option.total}
                        type="button"
                        onClick={() => handleTeammateCountChange(option.teammates)}
                        style={{
                          borderColor: isSelected ? RED : "rgba(255, 255, 255, 0.2)",
                          backgroundColor: isSelected ? RED : "black",
                          color: isSelected ? "#000000" : "rgba(255, 255, 255, 0.7)"
                        }}
                        className={`py-3.5 px-2 font-mono text-xs md:text-sm font-bold uppercase transition-all border-2 ${
                          isSelected
                            ? "shadow-[4px_4px_0_0_white]"
                            : "hover:border-white hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC TEAMMATE TEXTBOXES */}
              <div className="space-y-6 pt-2">
                {teammates.map((tm, idx) => (
                  <div
                    key={idx}
                    className="p-5 border border-white/20 border-l-4 bg-black/60 relative animate-in fade-in slide-in-from-top-2"
                    style={{ borderLeftColor: CYAN }}
                  >
                    <p
                      className="text-xs uppercase tracking-[0.25em] font-bold mb-4"
                      style={{ color: CYAN, fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      <span style={{ color: CYAN }} className="mr-1">{"///"}</span> {`TEAMMATE #${idx + 1} DETAILS`}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Name <span style={{ color: RED }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={`e.g. Teammate ${idx + 1} Name`}
                          value={tm.name}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "name", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00f0ff] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Register No <span style={{ color: RED }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 21BCE0002"
                          value={tm.registerNumber}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "registerNumber", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00f0ff] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Email ID
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. teammate@example.com"
                          value={tm.email}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "email", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00f0ff] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Phone No
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 9876543211"
                          value={tm.phone}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "phone", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00f0ff] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TERMS & CONDITIONS CHECKBOX & HYPERLINK */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <label
                  onMouseEnter={() => setIsCheckboxHovered(true)}
                  onMouseLeave={() => setIsCheckboxHovered(false)}
                  className="flex items-center gap-3 cursor-pointer select-none group"
                >
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    required
                    className="w-4 h-4 bg-black border border-white/40 checked:bg-[#00f0ff] cursor-pointer accent-[#00f0ff] focus:outline-none"
                  />
                  <span
                    className="text-xs font-mono uppercase tracking-wider text-white/80"
                    style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                  >
                    I agree to the terms and conditions <span style={{ color: RED }}>*</span>
                  </span>
                </label>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    style={{
                      color: isCheckboxHovered ? RED : CYAN,
                      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
                      transition: "color 0.2s ease-in-out"
                    }}
                    className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest underline underline-offset-2 cursor-pointer hover:opacity-90"
                  >
                    Click here to view terms and conditions
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full mt-4 flex items-center justify-center border-[5px] border-white bg-black py-5 font-mono text-lg font-bold uppercase tracking-[0.2em] text-white shadow-[8px_8px_0_0_white] transition-all duration-200 disabled:opacity-50 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black hover:shadow-none hover:translate-x-2 hover:translate-y-2"
              >
                {loading ? "Processing..." : "EXECUTE // REGISTER TEAM"}
              </button>

              {/* Login Redirect Footer */}
              <div className="pt-4 text-center border-t border-white/10">
                <p className="text-xs font-mono uppercase text-white/60">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    style={{ color: CYAN }}
                    className="hover:underline font-bold tracking-wider transition-colors"
                  >
                    LOG IN HERE
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* TERMS & CONDITIONS MODAL OVERLAY */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl p-8 border-4 border-white bg-black shadow-[12px_12px_0_0_#00f0ff] text-white">
            <Corners />

            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/20">
              <p
                className="text-xs font-mono uppercase tracking-[0.25em]"
                style={{ color: CYAN, fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
              >
                {"/// TERMS & CONDITIONS"}
              </p>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-3 py-1 font-mono text-xs font-bold uppercase border border-white/30 hover:border-white hover:bg-white hover:text-black transition-all"
              >
                CLOSE [✕]
              </button>
            </div>

            <div
              className="space-y-4 text-xs font-mono text-white/80 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed"
              style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
            >
              <div className="p-3 border-l-2 bg-white/5" style={{ borderLeftColor: CYAN }}>
                <strong style={{ color: CYAN }} className="block mb-1">1. TEAM SIZE REQUIREMENT</strong>
                All participating teams must consist of minimum 3 and maximum 5 members (1 Team Leader + 2 to 4 Teammates).
              </div>

              <div className="p-3 border-l-2 bg-white/5" style={{ borderLeftColor: RED }}>
                <strong style={{ color: RED }} className="block mb-1">2. CODE OF CONDUCT & FAIR PLAY</strong>
                All work, code repositories, and project submissions must be original work created strictly within the official hackathon timeline.
              </div>

              <div className="p-3 border-l-2 bg-white/5" style={{ borderLeftColor: CYAN }}>
                <strong style={{ color: CYAN }} className="block mb-1">3. INTEGRITY & ATTENDANCE</strong>
                All team members must provide accurate registration details (Register number, Name, Email, Phone). Duplicate registrations across teams will result in disqualification.
              </div>

              <div className="p-3 border-l-2 bg-white/5" style={{ borderLeftColor: RED }}>
                <strong style={{ color: RED }} className="block mb-1">4. JUDGING & DECISION FINALITY</strong>
                Projects will be evaluated according to established rubric criteria. All decisions made by the organizing committee and judging panel are final.
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/20 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setTermsAgreed(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest bg-[#00f0ff] border-2 border-[#00f0ff] text-black shadow-[4px_4px_0_0_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                AGREE & ACCEPT TERMS →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
