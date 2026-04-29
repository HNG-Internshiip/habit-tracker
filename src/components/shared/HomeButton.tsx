"use client";

import Link from "next/link";
import { useState } from "react";
import { FiHome } from "react-icons/fi";

export default function HomeButton() {
	const [pressed, setPressed] = useState(false);

	return (
		<div
			style={{
				position: "fixed",
				bottom: "calc(18px + env(safe-area-inset-bottom))",
				left: 0,
				right: 0,
				display: "flex",
				justifyContent: "center",
				zIndex: 50,
				pointerEvents: "none",
			}}
		>
			<Link
				href="/home"
				style={{
					pointerEvents: "auto",
					position: "relative",
					display: "flex",
					alignItems: "center",
					gap: 8,
					padding: "12px 22px",
					borderRadius: 999,

					// ✨ GOLD GRADIENT (this was missing)
					background:
						"linear-gradient(135deg,#F0D080,#C9A84C,#A0762A)",

					color: "#1A1814",
					fontWeight: 700,
					fontSize: 13,

					// 🧊 glass edge
					border: "1px solid rgba(255,255,255,0.08)",

					// 💥 press effect
					transform: pressed ? "scale(0.92)" : "scale(1)",
					transition:
						"transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease",

					// 🔥 glow
					boxShadow:
						"0 10px 30px rgba(201,168,76,0.35), 0 2px 10px rgba(0,0,0,0.3)",

					overflow: "hidden",
				}}
				onMouseDown={() => setPressed(true)}
				onMouseUp={() => setPressed(false)}
				onTouchStart={() => setPressed(true)}
				onTouchEnd={() => setPressed(false)}
			>
				{/* Ripple */}
				<span className="home-ripple" />

				<FiHome size={16} />
				<span>Home</span>
			</Link>

			<style>{`
				.home-ripple {
					position: absolute;
					inset: 0;
					background: radial-gradient(circle, rgba(255,255,255,0.4) 10%, transparent 60%);
					opacity: 0;
					transform: scale(0.8);
				}

				a:active .home-ripple {
					opacity: 1;
					transform: scale(1.4);
					transition: all 0.4s ease;
				}
			`}</style>
		</div>
	);
}