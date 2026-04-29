"use client";

import { useEffect, useState } from "react";
import AppLogo from "./AppLogo";

type SplashScreenProps = {
	onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
	const [phase, setPhase] = useState<number>(0);

	useEffect(() => {
		const t1: ReturnType<typeof setTimeout> = setTimeout(() => setPhase(1), 200);
		const t2: ReturnType<typeof setTimeout> = setTimeout(() => setPhase(2), 600);
		const t3: ReturnType<typeof setTimeout> = setTimeout(() => setPhase(3), 1200);
		const t4: ReturnType<typeof setTimeout> = setTimeout(() => setPhase(4), 2200);

		const t5: ReturnType<typeof setTimeout> = setTimeout(() => {
			onFinish?.();
		}, 2600);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
			clearTimeout(t5);
		};
	}, [onFinish]);

	return (
		<div
			className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
			style={{
				background: "#111114",
				opacity: phase === 4 ? 0 : 1,
				transform: phase === 4 ? "scale(1.05)" : "scale(1)",
				transition: "all 0.6s ease",
			}}
		>
			{/* Glow */}
			<div
				style={{
					position: "absolute",
					width: 500,
					height: 500,
					borderRadius: "50%",
					background: "radial-gradient(circle, #C9A84C, transparent 70%)",
					opacity: phase >= 1 ? 0.18 : 0,
					filter: "blur(80px)",
					transition: "opacity 0.8s ease",
				}}
			/>

			{/* Orbit ring */}
			<div
				style={{
					position: "absolute",
					width: 220,
					height: 220,
					borderRadius: "50%",
					border: "1px dashed rgba(201,168,76,0.25)",
					opacity: phase >= 2 ? 1 : 0,
					transform: `rotate(${phase >= 2 ? 360 : 0}deg)`,
					transition: "all 2s linear",
				}}
			/>

			{/* Logo */}
			<div
				style={{
					position: "relative",
					transform:
						phase >= 2
							? "scale(1) rotate(0deg)"
							: "scale(0.7) rotate(-10deg)",
					opacity: phase >= 2 ? 1 : 0,
					transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
					zIndex: 2,
				}}
			>
				<div className="logo-shimmer-wrap">
					<AppLogo size={90} />
					<div className={`logo-shimmer ${phase >= 2 ? "run" : ""}`} />
				</div>
			</div>

			{/* Text */}
			<div
				style={{
					marginTop: 20,
					textAlign: "center",
					opacity: phase >= 3 ? 1 : 0,
					transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
					transition: "all 0.5s ease",
				}}
			>
				<h1
					style={{
						fontSize: 28,
						fontWeight: 900,
						background:
							"linear-gradient(135deg,#F0D080,#C9A84C,#A0762A)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					Habit Tracker
				</h1>

				<p
					style={{
						fontSize: 11,
						letterSpacing: "0.2em",
						color: "#C9A84C",
						marginTop: 6,
						fontWeight: 700,
					}}
				>
					BUILD · STREAK · THRIVE
				</p>
			</div>

			{/* Loader */}
			<div
				style={{
					display: "flex",
					gap: 6,
					marginTop: 30,
					opacity: phase >= 3 ? 1 : 0,
				}}
			>
				{[0, 1, 2].map((i: number) => (
					<span
						key={i}
						style={{
							width: 8,
							height: 8,
							borderRadius: 999,
							background: "#C9A84C",
							animation: "pulse 1.2s infinite",
							animationDelay: `${i * 0.2}s`,
						}}
					/>
				))}
			</div>

			<style>{`
				@keyframes pulse {
					0%,100% { opacity: 0.3; transform: scale(1); }
					50% { opacity: 1; transform: scale(1.4); }
				}
			`}</style>
		</div>
	);
}