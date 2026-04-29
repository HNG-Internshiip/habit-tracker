"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import HomePage from "@/components/home/HomePage";
import { getSession } from "@/lib/auth";

export default function Page() {
	const router = useRouter();

	const [mounted, setMounted] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [booting, setBooting] = useState(false);

	interface NavigatorStandalone {
		standalone?: boolean;
	}
	// 1. FIRST: lock initial render
	useEffect(() => {
		setMounted(true);

		const standalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as NavigatorStandalone).standalone === true;

		setIsStandalone(standalone);
		setBooting(standalone); // only PWA boots splash flow
	}, []);

	// 2. PWA boot flow
	useEffect(() => {
		if (!booting) return;

		const timer = setTimeout(() => {
			const session = getSession();

			if (session) {
				router.replace("/dashboard");
			} else {
				router.replace("/login");
			}

			setBooting(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, [booting, router]);

	// 🔒 HARD BLOCK: prevents homepage flash
	if (!mounted) return null;

	// 🌐 WEB MODE → direct render
	if (!isStandalone) {
		return <HomePage />;
	}

	// 📲 PWA MODE → ONLY splash (no fallback UI ever)
	if (booting) {
		return <SplashScreen onFinish={() => setBooting(false)} />;
	}

	return null;
}