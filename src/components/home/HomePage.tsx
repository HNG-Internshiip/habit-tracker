"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	FiActivity,
	FiCheckCircle,
	FiWifiOff,
	FiLock,
	FiSmartphone,
	FiBarChart2
} from "react-icons/fi";
import Link from "next/link";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

const GOLD = "#C9A84C";
const GOLD_L = "#F0D080";
const GOLD_D = "#A0762A";

function useReveal(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVisible(true);
					obs.disconnect();
				}
			},
			{ threshold }
		);

		if (ref.current) obs.observe(ref.current);

		return () => obs.disconnect();
	}, [threshold]);

	return [ref, visible];
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ size = 36 }) {
	return (
		<svg width={size} height={size} viewBox="0 0 64 64" fill="none">
			<defs>
				<linearGradient id="logo-g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor={GOLD_L} />
					<stop offset="50%" stopColor={GOLD} />
					<stop offset="100%" stopColor={GOLD_D} />
				</linearGradient>
			</defs>
			<rect width="64" height="64" rx="18" fill="url(#logo-g)" />
			<circle cx="32" cy="32" r="19" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
			<path d="M20 33 L29 42 L45 23" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

// ── Hero Illustration (v2 orbital) ────────────────────────────────────────────
function HeroIllustration() {
	return (
		<svg viewBox="0 0 520 480" fill="none" style={{ width: "100%", maxWidth: 520, display: "block" }}>
			<defs>
				<linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
					<stop stopColor={GOLD_L} /><stop offset=".5" stopColor={GOLD} /><stop offset="1" stopColor={GOLD_D} />
				</linearGradient>
				<linearGradient id="card-g" x1="0" y1="0" x2="0" y2="1">
					<stop stopColor="#27272C" /><stop offset="1" stopColor="#1C1C20" />
				</linearGradient>
				<radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
					<stop stopColor={GOLD} stopOpacity=".18" />
					<stop offset="1" stopColor={GOLD} stopOpacity="0" />
				</radialGradient>
			</defs>

			{/* Glow */}
			<ellipse cx="260" cy="240" rx="200" ry="180" fill="url(#hero-glow)" />

			{/* Orbital rings */}
			<ellipse cx="260" cy="240" rx="195" ry="60" stroke={GOLD} strokeWidth=".6"
				strokeDasharray="4 6" opacity=".2"
				style={{ transformOrigin: "260px 240px", animation: "spin-slow 28s linear infinite" }} />
			<ellipse cx="260" cy="240" rx="155" ry="48" stroke={GOLD} strokeWidth=".5"
				strokeDasharray="3 8" opacity=".15"
				style={{ transformOrigin: "260px 240px", animation: "spin-slow-r 22s linear infinite" }} />

			{/* Phone body */}
			<rect x="170" y="60" width="180" height="320" rx="30" fill="#1C1C20" stroke="#35353C" strokeWidth="1.5" />
			<rect x="179" y="74" width="162" height="292" rx="22" fill="#111114" />
			<rect x="222" y="74" width="76" height="16" rx="8" fill="#1C1C20" />

			{/* Header */}
			<rect x="179" y="90" width="162" height="40" fill="#1C1C20" />
			<rect x="188" y="100" width="36" height="8" rx="4" fill={GOLD} opacity=".8" />
			<rect x="188" y="112" width="60" height="5" rx="2.5" fill="#35353C" />
			<rect x="316" y="100" width="18" height="18" rx="5" fill="#27272C" />
			<path d="M320 108h10M327 106l3 2-3 2" stroke="#5C5A52" strokeWidth="1.1" strokeLinecap="round" />

			{/* Progress */}
			<rect x="179" y="130" width="162" height="22" fill="#161618" />
			<rect x="188" y="135" width="100" height="4" rx="2" fill="#27272C" />
			<rect x="188" y="135" width="68" height="4" rx="2" fill="url(#pg)">
				<animate attributeName="width" from="10" to="68" dur="2s" fill="freeze" />
			</rect>
			<rect x="300" y="134" width="32" height="6" rx="3" fill={GOLD} opacity=".2" />
			<text x="303" y="140" fontSize="5" fontWeight="800" fill={GOLD} opacity=".8">68%</text>

			{/* Habit cards */}
			{[
				{ y: 157, label: "Drink Water", done: true, streak: 12 },
				{ y: 202, label: "Morning Run", done: true, streak: 5 },
				{ y: 247, label: "Read 20 Pages", done: false, streak: 2 },
				{ y: 292, label: "Meditate", done: false, streak: 0 },
			].map(({ y, done, streak }) => (
				<g key={y}>
					<rect x="185" y={y} width="150" height="38" rx="10"
						fill={done ? "rgba(201,168,76,0.07)" : "url(#card-g)"}
						stroke={done ? "rgba(201,168,76,0.28)" : "#2A2A30"} strokeWidth="1" />
					{done
						? <><circle cx="198" cy={y + 19} r="8" fill={GOLD} />
							<path d={`M194 ${y + 19}l3 3 5-5`} stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
						</>
						: <circle cx="198" cy={y + 19} r="8" fill="none" stroke="#35353C" strokeWidth="1.4" />
					}
					<rect x="212" y={y + 11} width={done ? 48 : 58} height="5" rx="2.5"
						fill={done ? "#5C5A52" : "#F2EFE8"} opacity={done ? .45 : .75} />
					<rect x="212" y={y + 20} width="24" height="5" rx="2.5" fill={GOLD} opacity=".18" />
					<rect x="240" y={y + 21} width="16" height="3" rx="1.5" fill="#35353C" />
					<rect x="307" y={y + 12} width="22" height="14" rx="7"
						fill={streak > 0 ? "rgba(255,107,43,0.14)" : "#27272C"} />
					<text x="312" y={y + 22} fontSize="7" fontWeight="800" fill={streak > 0 ? "#FF6B2B" : "#5C5A52"}>
						{streak > 0 ? streak : "·"}
					</text>
					{streak > 0 && <text x="308" y={y + 22} fontSize="7">{<FiActivity />}</text>}
				</g>
			))}

			{/* FAB */}
			<circle cx="318" cy="355" r="18" fill="url(#pg)"
				style={{ filter: `drop-shadow(0 6px 16px ${GOLD}66)` }} />
			<path d="M311 355h14M318 348v14" stroke="#1A1814" strokeWidth="2.4" strokeLinecap="round" />

			{/* Floating cards */}
			<g style={{ animation: "floatA 3.5s ease-in-out infinite" }}>
				<rect x="12" y="90" width="120" height="52" rx="14" fill="#1C1C20" stroke="#35353C" strokeWidth="1" />
				<circle cx="31" cy="116" r="13" fill="rgba(255,107,43,0.12)" />
				<text x="26" y="121" fontSize="14">{<FiActivity />}</text>
				<rect x="50" y="105" width="70" height="6" rx="3" fill="#FF6B2B" opacity=".6" />
				<rect x="50" y="115" width="48" height="5" rx="2.5" fill="#35353C" />
				<rect x="50" y="124" width="34" height="4" rx="2" fill="#27272C" />
			</g>

			<g style={{ animation: "floatB 4s ease-in-out infinite" }}>
				<rect x="382" y="130" width="126" height="52" rx="14" fill="#1C1C20" stroke="#35353C" strokeWidth="1" />
				<circle cx="401" cy="156" r="13" fill="rgba(201,168,76,0.12)" />
				<circle cx="401" cy="156" r="9" fill={GOLD} opacity=".9" />
				<path d="M397 156l3 3 5-5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<rect x="420" y="147" width="76" height="6" rx="3" fill={GOLD} opacity=".7" />
				<rect x="420" y="157" width="52" height="5" rx="2.5" fill="#35353C" />
				<rect x="420" y="166" width="38" height="4" rx="2" fill="#27272C" />
			</g>

			<g style={{ animation: "floatC 5s ease-in-out infinite" }}>
				<rect x="370" y="310" width="136" height="52" rx="14" fill="#1C1C20" stroke="#35353C" strokeWidth="1" />
				<circle cx="390" cy="336" r="13" fill="rgba(167,139,250,0.12)" />
				<rect x="384" y="327" width="12" height="18" rx="3" fill="#A78BFA" opacity=".25" />
				<path d="M390 329v9M387 335l3 3 3-3" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<rect x="410" y="327" width="80" height="6" rx="3" fill="#A78BFA" opacity=".5" />
				<rect x="410" y="337" width="56" height="5" rx="2.5" fill="#35353C" />
				<rect x="410" y="346" width="42" height="4" rx="2" fill="#27272C" />
			</g>

			<g style={{ animation: "floatD 3s ease-in-out infinite" }}>
				<rect x="22" y="300" width="126" height="38" rx="19" fill="#1C1C20" stroke="#35353C" strokeWidth="1" />
				<circle cx="44" cy="319" r="10" fill="rgba(74,222,128,0.12)" />
				<text x="40" y="323" fontSize="11">{<FiWifiOff />}</text>
				<rect x="60" y="313" width="70" height="6" rx="3" fill="#4ADE80" opacity=".55" />
				<rect x="60" y="323" width="50" height="4" rx="2" fill="#35353C" />
			</g>
		</svg>
	);
}

function FeatureIcon({ children }: { children: ReactNode }) {
	return (
		<div style={{
			width: 48, height: 48, borderRadius: 14,
			background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
			display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
		}}>{children}</div>
	);
}

const FEATURES = [
	{ icon: FiActivity, color: "#FF6B2B", title: "Streak Tracking", desc: "Consecutive-day counters that make you want to show up every single day." },
	{ icon: FiCheckCircle, color: "#4ADE80", title: "One-tap Completion", desc: "Mark habits done instantly. A satisfying check that makes progress feel real." },
	{ icon: FiWifiOff, color: "#60A5FA", title: "Full Offline Support", desc: "Service worker caches the app shell. Works at 30,000 ft with zero signal." },
	{ icon: FiLock, color: "#FACC15", title: "Zero Data Leaks", desc: "localStorage only. Your habits never touch a server. GDPR by design." },
	{ icon: FiSmartphone, color: "#A78BFA", title: "Install as App", desc: "Add to home screen in one tap. Native feel, no App Store required." },
	{ icon: FiBarChart2, color: "#F472B6", title: "Progress Bar", desc: "A shimmer gold bar shows exactly how your day is going at a glance." },
];

const STEPS = [
	{ n: "01", title: "Create an account", desc: "Sign up with email — no OAuth, no third-party, just you." },
	{ n: "02", title: "Add your habits", desc: "Tap the gold + button. Name it, describe it, set it daily." },
	{ n: "03", title: "Track every day", desc: "Check off habits each day to build your streak." },
	{ n: "04", title: "Install the app", desc: "Hit 'Add to Home Screen' for a full native-like experience." },
];

const TESTIMONIALS = [
	{ name: "Amara O.", role: "Product Designer", text: "The cleanest habit tracker I've used. The streak badges actually make me not want to miss a day." },
	{ name: "Kwame B.", role: "Software Engineer", text: "Love that my data stays on my device. No subscriptions, no nonsense. Just focus." },
	{ name: "Zainab M.", role: "Student", text: "Installed it on my home screen in 10 seconds. Feels exactly like a native app." },
];

type FeatureCardProps = {
	icon: IconType;
	title: string;
	desc: string;
	delay: number;
	color: string;
};

function FeatureCard({ icon: Icon, title, desc, delay, color }: FeatureCardProps) {
	const [ref, visible] = useReveal();

	return (
		<div
			ref={ref}
			style={{
				background: "#1C1C20",
				border: "1px solid #35353C",
				borderRadius: 20,
				padding: "24px 22px",
				opacity: visible ? 1 : 0,
				transform: visible ? "translateY(0)" : "translateY(24px)",
				transition: `opacity 0.5s ${delay}s ease, transform 0.5s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
			}}
		>
			<FeatureIcon>
				<Icon
					size={22}
					color={color}
					style={{
						filter: `drop-shadow(0 2px 8px ${color}55)`,
					}}
				/>
			</FeatureIcon>

			<p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 15, color: "#F2EFE8" }}>
				{title}
			</p>

			<p style={{ margin: 0, fontSize: 14, color: "#5C5A52", lineHeight: 1.6 }}>
				{desc}
			</p>
		</div>
	);
}

export default function HomePage() {
	const [scrolled, setScrolled] = useState(false);
	const [heroVisible, setHeroVisible] = useState(false);

	useEffect(() => {
		setTimeout(() => setHeroVisible(true), 100);
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const [stepsRef, stepsVisible] = useReveal(0.1);
	const [testiRef, testiVisible] = useReveal(0.1);
	const [ctaRef, ctaVisible] = useReveal(0.2);

	// v1 hero entrance helper
	const T = (delay: number) => ({
		opacity: heroVisible ? 1 : 0,
		transform: heroVisible ? "translateY(0)" : "translateY(22px)",
		transition: `opacity .65s ${delay}s ease, transform .65s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
	});

	return (
		<div style={{
			background: "#111114", color: "#F2EFE8", minHeight: "100vh",
			fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
			overflowX: "hidden",
		}}>

			{/* ── Navbar ───────────────────────────────────────────────────────── */}
			<nav style={{
				position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
				padding: "0 24px", height: 64,
				background: scrolled ? "rgba(17,17,20,0.85)" : "transparent",
				backdropFilter: scrolled ? "blur(16px)" : "none",
				borderBottom: scrolled ? "1px solid #1E1E24" : "none",
				transition: "all 0.3s ease",
				display: "flex", alignItems: "center", justifyContent: "space-between",
			}}>
				<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<Logo size={32} />
					<span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -.5 }}>Habit Tracker</span>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<Link href="/login" style={{
						padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
						background: "transparent", border: "1px solid #35353C",
						color: "#A09880", textDecoration: "none",
					}}>Log in</Link>
					<Link href="/signup" style={{
						padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 800,
						background: `linear-gradient(135deg,${GOLD_L},${GOLD},${GOLD_D})`,
						color: "#1A1814", textDecoration: "none",
						boxShadow: `0 4px 16px rgba(201,168,76,0.25)`,
					}}>Get started →</Link>
				</div>
			</nav>

			{/* ── Hero ─────────────────────────────────────────────────────────── */}
			<section style={{
				minHeight: "100vh", display: "flex", alignItems: "center",
				padding: "100px 24px 60px", maxWidth: 1100, margin: "0 auto",
				gap: 40, flexWrap: "wrap", justifyContent: "center",
			}}>
				{/* Left copy — v1 style */}
				<div style={{ flex: "1 1 340px", maxWidth: 520 }}>
					{/* Badge */}
					<div style={{
						...T(0.05),
						display: "inline-flex", alignItems: "center", gap: 7,
						background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.2)`,
						borderRadius: 99, padding: "5px 14px", marginBottom: 24,
					}}>
						<span style={{
							width: 7, height: 7, borderRadius: "50%", background: GOLD,
							boxShadow: `0 0 7px ${GOLD}`, display: "inline-block"
						}} />
						<span style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: .5 }}>
							Progressive Web App
						</span>
					</div>

					<h1 style={{
						...T(0.10),
						fontSize: "clamp(36px,6vw,60px)", fontWeight: 900, lineHeight: 1.05,
						margin: "0 0 20px", letterSpacing: -1.5,
					}}>
						Build habits that{" "}
						<span style={{
							background: `linear-gradient(135deg,${GOLD_L},${GOLD})`,
							WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
						}}>actually stick.</span>
					</h1>

					<p style={{
						...T(0.18),
						fontSize: 17, color: "#6B6555", lineHeight: 1.7, margin: "0 0 36px",
					}}>
						A mobile-first PWA that tracks your daily habits, celebrates
						your streaks, and works completely offline — all without a
						single server touching your data.
					</p>

					<div style={{ ...T(0.26), display: "flex", gap: 12, flexWrap: "wrap" }}>
						<Link href="/signup" style={{
							padding: "14px 28px", borderRadius: 14, fontWeight: 800, fontSize: 15,
							background: `linear-gradient(135deg,${GOLD_L},${GOLD},${GOLD_D})`,
							color: "#1A1814", textDecoration: "none",
							boxShadow: `0 8px 28px rgba(201,168,76,0.28)`,
							display: "flex", alignItems: "center", gap: 8,
						}}>
							Start for free
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
								stroke="#1A1814" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M5 12h14M13 6l6 6-6 6" />
							</svg>
						</Link>
						<Link href="#features" style={{
							padding: "14px 24px", borderRadius: 14, fontWeight: 700, fontSize: 15,
							background: "transparent", border: "1px solid #2A2A30",
							color: "#6B6555", textDecoration: "none",
						}}>See features</Link>
					</div>

					{/* v1 stat pills */}
					<div style={{ ...T(0.34), display: "flex", gap: 20, marginTop: 36, flexWrap: "wrap" }}>
						{[
							{ v: "100%", l: "Private data" },
							{ v: "0ms", l: "Server latency" },
							{ v: "PWA", l: "Installable" },
						].map(({ v, l }) => (
							<div key={v} style={{ textAlign: "center" }}>
								<div style={{ fontSize: 22, fontWeight: 900, color: GOLD, letterSpacing: -1 }}>{v}</div>
								<div style={{ fontSize: 11, color: "#5C5A52", marginTop: 2, fontWeight: 600 }}>{l}</div>
							</div>
						))}
					</div>
				</div>

				{/* Right — v2 orbital illustration */}
				<div style={{
					flex: "1 1 300px", maxWidth: 520,
					...T(0.15),
					transitionDuration: ".9s",
				}}>
					<HeroIllustration />
				</div>
			</section>

			{/* ── Features ─────────────────────────────────────────────────────── */}
			<section id="features" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: 56 }}>
					<p style={{
						fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1.5,
						textTransform: "uppercase", marginBottom: 10
					}}>What you get</p>
					<h2 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, margin: 0, letterSpacing: -1 }}>
						Everything you need.<br />
						<span style={{ color: "#35353C" }}>Nothing you don&apos;t.</span>
					</h2>
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
					{FEATURES.map((f, i) => (
						<FeatureCard key={f.title} {...f} delay={i * 0.07} />
					))}
				</div>
			</section>

			{/* ── How it works ─────────────────────────────────────────────────── */}
			<section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: 56 }}>
					<p style={{
						fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1.5,
						textTransform: "uppercase", marginBottom: 10
					}}>How it works</p>
					<h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, margin: 0, letterSpacing: -1 }}>
						Up and running in 60 seconds.
					</h2>
				</div>
				<div ref={stepsRef} style={{
					display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 20,
				}}>
					{STEPS.map((s, i) => (
						<div key={s.n} style={{
							background: "#1C1C20", border: "1px solid #35353C", borderRadius: 20,
							padding: "24px 20px", position: "relative", overflow: "hidden",
							opacity: stepsVisible ? 1 : 0,
							transform: stepsVisible ? "translateY(0)" : "translateY(28px)",
							transition: `all 0.5s ${i * 0.1}s cubic-bezier(0.22,1,0.36,1)`,
						}}>
							<div style={{
								fontSize: 44, fontWeight: 900, lineHeight: 1,
								background: `linear-gradient(135deg,${GOLD_L},${GOLD})`,
								WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
								marginBottom: 14, opacity: .25,
							}}>{s.n}</div>
							<p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#F2EFE8" }}>{s.title}</p>
							<p style={{ margin: 0, fontSize: 12, color: "#5C5A52", lineHeight: 1.6 }}>{s.desc}</p>
							{i < STEPS.length - 1 && (
								<div style={{
									position: "absolute", top: "50%", right: -10, transform: "translateY(-50%)",
									width: 20, height: 20, borderRadius: "50%",
									background: "#111114", border: `2px solid ${GOLD}`,
									display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
								}}>
									<div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
								</div>
							)}
						</div>
					))}
				</div>
			</section>

			{/* ── Testimonials ─────────────────────────────────────────────────── */}
			<section style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: 48 }}>
					<p style={{
						fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1.5,
						textTransform: "uppercase", marginBottom: 10
					}}>From users</p>
					<h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, margin: 0, letterSpacing: -1 }}>
						People who made it a habit.
					</h2>
				</div>
				<div ref={testiRef} style={{
					display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(375px,1fr))", gap: 16,
				}}>
					{TESTIMONIALS.map((t, i) => (
						<div key={t.name} style={{
							background: "#1C1C20", border: "1px solid #35353C", borderRadius: 20,
							padding: "24px 22px",
							opacity: testiVisible ? 1 : 0,
							transform: testiVisible ? "translateY(0)" : "translateY(24px)",
							transition: `all 0.5s ${i * 0.1}s cubic-bezier(0.22,1,0.36,1)`,
						}}>
							<div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
								{[...Array(5)].map((_, j) => (
									<svg key={j} width="13" height="13" viewBox="0 0 24 24" fill={GOLD} stroke="none">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								))}
							</div>
							<p style={{ margin: "0 0 16px", fontSize: 14, color: "#A09880", lineHeight: 1.65, fontStyle: "italic" }}>
								&ldquo;{t.text}&rdquo;
							</p>
							<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
								<div style={{
									width: 34, height: 34, borderRadius: "50%",
									background: `linear-gradient(135deg,${GOLD_L},${GOLD_D})`,
									display: "flex", alignItems: "center", justifyContent: "center",
									fontWeight: 800, fontSize: 13, color: "#1A1814",
								}}>{t.name[0]}</div>
								<div>
									<p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#F2EFE8" }}>{t.name}</p>
									<p style={{ margin: 0, fontSize: 11, color: "#5C5A52" }}>{t.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ── CTA ──────────────────────────────────────────────────────────── */}
			<section style={{ padding: "60px 24px 100px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
				<div ref={ctaRef} style={{
					background: "#1C1C20", border: "1px solid rgba(201,168,76,0.2)",
					borderRadius: 28, padding: "52px 32px",
					boxShadow: `0 0 80px rgba(201,168,76,0.06)`,
					opacity: ctaVisible ? 1 : 0,
					transform: ctaVisible ? "scale(1)" : "scale(0.97)",
					transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
				}}>
					<div style={{
						display: "inline-flex", alignItems: "center", justifyContent: "center",
						width: 64, height: 64, borderRadius: 20,
						background: `linear-gradient(135deg,${GOLD_L},${GOLD},${GOLD_D})`,
						marginBottom: 22,
						boxShadow: `0 12px 32px rgba(201,168,76,0.3)`,
					}}>
						<svg width="30" height="30" viewBox="0 0 64 64" fill="none">
							<circle cx="32" cy="32" r="19" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />
							<path d="M20 33l9 9 16-19" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
					<h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, margin: "0 0 12px", letterSpacing: -1 }}>
						Your streak starts today.
					</h2>
					<p style={{ fontSize: 15, color: "#5C5A52", margin: "0 0 28px", lineHeight: 1.7 }}>
						Free forever. No ads. No tracking. Just you and your habits.
					</p>
					<Link href="/signup" style={{
						display: "inline-flex", alignItems: "center", gap: 8,
						padding: "14px 32px", borderRadius: 14, fontWeight: 800, fontSize: 15,
						background: `linear-gradient(135deg,${GOLD_L},${GOLD},${GOLD_D})`,
						color: "#1A1814", textDecoration: "none",
						boxShadow: `0 8px 28px rgba(201,168,76,0.3)`,
					}}>
						Create free account
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
							stroke="#1A1814" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M5 12h14M13 6l6 6-6 6" />
						</svg>
					</Link>
					<p style={{ marginTop: 14, fontSize: 12, color: "#35353C" }}>
						No credit card · Installs in one tap · Works offline
					</p>
				</div>
			</section>

			{/* ── Footer ───────────────────────────────────────────────────────── */}
			<footer style={{
				borderTop: "1px solid #1A1A1E", padding: "28px 24px",
				display: "flex", justifyContent: "space-between", alignItems: "center",
				flexWrap: "wrap", gap: 12, maxWidth: 1100, margin: "0 auto",
			}}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Logo size={24} />
					<span style={{ fontWeight: 700, fontSize: 13, color: "#35353C" }}>Habit Tracker</span>
				</div>
				<p style={{ fontSize: 12, color: "#2A2A2E", margin: 0 }}>
					Built with Next.js · All data stays on your device.
				</p>
			</footer>

			<style>{`
        @keyframes spin-slow   { to { transform: rotate(360deg);  } }
        @keyframes spin-slow-r { to { transform: rotate(-360deg); } }
        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(-1.5deg); }
          55%     { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0) rotate(1deg); }
          50%     { transform: translateY(-18px) rotate(-1.5deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0); }
          60%     { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatD {
          0%,100% { transform: translateY(0) rotate(-.5deg); }
          50%     { transform: translateY(-8px) rotate(.5deg); }
        }
        * { box-sizing: border-box; }
        a { transition: opacity .2s, transform .15s; }
        a:hover { opacity: .88; transform: translateY(-1px); }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#111114; }
        ::-webkit-scrollbar-thumb { background:#2A2A30; border-radius:99px; }
      `}</style>
		</div>
	);
}